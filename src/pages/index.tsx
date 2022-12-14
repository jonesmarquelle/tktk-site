import { AnimatePresence, motion } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import VideoInfo from "../components/VideoInfo";
import { trpc } from "../utils/trpc";

enum VideoLoadState {
  Default,
  Loading,
  Loaded,
  Failed
}

interface TiktokVideo {
  filename: string,
  username: string,
  name: string,
  likesCount: number,
  commentsCount: number,
  sharesCount: number,
  thumbnail: string,
}

const Home: NextPage = () => {
  const [ state, setState ] = useState(VideoLoadState.Default);
  const [ url, setUrl ] = useState<string>();
  const [ video, setVideo ] = useState<TiktokVideo>();
  const acRef = useRef<AbortController | null>();

  const utils = trpc.useContext();

  const isState = () => {
    return {
      default:  state === VideoLoadState.Default,
      loading:  state === VideoLoadState.Loading,
      loaded:   state === VideoLoadState.Loaded,
      failed:   state === VideoLoadState.Failed
    }
  }

  const buttonColor = () => {
    return [
      "hover:bg-slate-800", 
      "hover:bg-red-800", 
      "hover:bg-green-800", 
      "hover:bg-violet-800"
    ][state];
  }

  const handleClick = async () => {
    console.debug('Download button clicked')
    console.debug(`State before click: ${state}`);
    switch (state) {
      case VideoLoadState.Default:
        if (verifyURL(url)) requestVideo();
        break;
      case VideoLoadState.Loading:
        abortVideoDownload();
        break;
      case VideoLoadState.Loaded:
        downloadVideo();
        break;
      case VideoLoadState.Failed:
        resetToDefault();
        break;
    }
  }

  const resetToDefault = () => {
    setUrl(undefined);
    setState(VideoLoadState.Default);
  }

  const verifyURL = (url?: string) => {
    console.debug('Verifying URL');
    return !!url && true;
  }

  const abortVideoDownload = () => {
    if (!acRef.current) return;
    console.debug('Aborting video request...')
    acRef.current.abort();
    console.debug(`Video request aborted, current state: ${state}`);
  }

  const requestVideo = async () => {
    console.debug('Sending video request to server');
    
    if (acRef.current) acRef.current.abort();
    acRef.current = new AbortController();
    
    setState(VideoLoadState.Loading);

    try {
      const video = await utils.client.video.getVideo.query({ url }, {signal: acRef.current.signal});
      if (video.res) {
        setVideo(video.res);
        setState(VideoLoadState.Loaded);
      } else {
        setState(VideoLoadState.Failed);
      }
      console.debug(`Response: ${JSON.stringify(video.res)}`);
    } catch (e) {
      console.debug('Error requesting video');
      setState(VideoLoadState.Failed);
    }
  }

  const downloadVideo = async () => {
    if (!video) return resetToDefault();

    const getPath = video.filename;
    console.debug(`Downloading video to client: ${getPath}`);

    fetch(`./api/download?filename=${getPath}`)
      .then((res) => res.blob())
      .then((blob) => {
        const localURL = URL.createObjectURL(blob);
        resetToDefault();
        const anchor = document.createElement('a');
        anchor.setAttribute('href', localURL);
        anchor.setAttribute('download', getPath);
        anchor.click();
      });
    
    console.debug('Video saved!');
    return;
  }

  const updateUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  }

  const buttonVariants = {
    default:  { width: "3rem", borderRadius: "3rem", rotate: 0 },
    loading:  { width: "9rem", borderRadius: "3rem" },
    loaded:   { width: "22.5rem", borderRadius: "1rem" },
    failed:   { width: "3rem", borderRadius: "1rem", rotate: 45 },
  }

  const mainDivVariants = {
    default:  { width: "30rem", height: "3rem" },
    loading:  { height: "1rem" },
    loaded:   { width: "22.5rem", height: "40rem" }
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ce9595] to-[#35043b] gap-6">
            <AnimatePresence>
              {isState().default && 
                <motion.h1 className="absolute top-60 text-center text-4xl md:text-5xl text-white"
                initial={ false }
                animate={{ opacity: 1 }}
                exit={{ opacity: 0}}>
                  <strong>Tiktok</strong> Video Downloader
                </motion.h1>}
            </AnimatePresence>
            
            <motion.div
            className="bg-neutral-300 shadow-md p-2 gap-2" 
            style={{ borderRadius: "3rem" }}
            initial={{ width: "22.5rem", height: "3rem" }}
            animate={["default", "loading", "loaded"][state]}
            variants={mainDivVariants}>
              {isState().default &&
                <input
                onChange={updateUrl}
                className="w-full h-full bg-transparent text-neutral-700 text-xl text-center outline-none"
                placeholder="Enter Tiktok URL..."/>
              }
              {isState().loaded &&
                <div className="flex flex-col h-full w-full gap-2">
                  <VideoInfo video={video} />
                  <div className="relative bg-neutral-500 w-full flex flex-grow rounded-[2.5rem] overflow-clip">
                  {video?.thumbnail && 
                    <Image 
                    className="absolute top-0 w-full object-cover aspect-[360/640] rounded-[2.5rem]" 
                    alt="" width={360} height={640} src={video.thumbnail}/>
                  }
                  </div>
                </div>
              }
            </motion.div>
            <motion.button 
              className={`${buttonColor()} bg-neutral-300 shadow-md h-12 text-xl text-neutral-600 hover:text-white hover:shadow-lg transition-colors`}
              onClick={handleClick}
              style={{rotate: 0}}
              animate={["default", "loading", "loaded", "failed"][state]}
              variants={buttonVariants}>
                {isState().default}
                {isState().loading && <span>CANCEL</span>}
                {isState().loaded && <span>DOWNLOAD</span>}
            </motion.button>
      </main>
    </>
  );
};

export default Home;
