import { AnimatePresence, motion } from "framer-motion";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import DownloadIcon from "../components/DownloadIcon";
import RefreshIcon from "../components/RefreshIcon";
import VideoInfo from "../components/VideoInfo";
import { trpc } from "../utils/trpc";
import { https } from "follow-redirects";

enum VideoLoadState {
  Default = "default",
  Loading = "loading",
  Loaded = "loaded",
  Failed = "failed"
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

  const isState = {
      default:  state === VideoLoadState.Default,
      loading:  state === VideoLoadState.Loading,
      loaded:   state === VideoLoadState.Loaded,
      failed:   state === VideoLoadState.Failed
  }

  const hoverButtonColor = () => {
    return {
      default: "hover:bg-slate-800", 
      loading: "hover:bg-red-800", 
      loaded: "hover:bg-green-800", 
      failed: "hover:bg-violet-800"
    }[state];
  }

  const videoFinished = (video: TiktokVideo) => {
    console.debug(`State: ${state}\nEvent: Video finished downloading`);
    setVideo(video);
    if (isState.loading) {
      setState(VideoLoadState.Loaded);
    } else {
      pingServer();
    }
  }

  const videoErrored = (err: unknown) => {
    console.error(`Event: Video subscription error:`, err);
    setVideo(undefined);
    setState(VideoLoadState.Failed);
  }

  trpc.video.onVideo.useSubscription(undefined, {
    onData: videoFinished, onError: videoErrored
  });

  const handleClick = async () => {
    console.debug('Download button clicked')
    console.debug(`State before click: ${state}`);
    switch (state) {
      case VideoLoadState.Default:
        const urlResolved = await verifyURL(url);
        if (urlResolved) {
          setUrl(urlResolved);
          requestVideo();
        }
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
    setVideo(undefined);
    setState(VideoLoadState.Default);
  }

  const verifyURL = async (url?: string) => {
    console.debug('Verifying URL');
    if (!url) return false;
    
    const finalUrl = await new Promise<string>((resolve, reject) => {
      https.get(url, res => {
        res.on('error', err => reject(err));
        resolve(res.responseUrl);
      });
    });
    console.log(`Resolved URL: ${finalUrl}`);
    
    if (!finalUrl.includes('tiktok.com')) return false;
    if (!finalUrl.includes('www.')) return false;
    return finalUrl;
  }

  const abortVideoDownload = () => {
    if (!acRef.current) return;
    console.debug('Aborting video request...')
    acRef.current.abort();
    console.debug(`Video request aborted, current state: ${state}`);
    resetToDefault();
  }

  const requestVideo = async () => {
    setState(VideoLoadState.Loading);
    console.debug('Sending video request to server');
    
    if (acRef.current) acRef.current.abort();
    acRef.current = new AbortController();
    
    try {
      await utils.client.video.getVideo.query({ url }, {signal: acRef.current.signal});
    } catch (e) {
      console.error(e);
      pingServer();
    }
  }

  const downloadVideo = async () => {
    if (!video) return resetToDefault();

    const getPath = video.filename;
    console.debug(`Downloading video to client: ${getPath}`);

    return fetch(`./api/download?filename=${getPath}`)
      .then((res) => res.blob())
      .then((blob) => {
        const localURL = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.setAttribute('href', localURL);
        anchor.setAttribute('download', getPath);
        anchor.click();
        resetToDefault();
      })
      .finally(()=>{
        console.debug('Video saved!');
      });
  }

  const pingServer = () => {
    if (!video) return;
    const getPath = video.filename;
    fetch(`./api/download?filename=${getPath}`);
    return;
  }

  /* Since the server automatically deletes the file when touched, we send the request when the app unloads to free up space */
 useEffect(() => {
  return () => { //Called on component unload
    pingServer();
  }
 }, []);

  const updateUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.currentTarget.value);
  }

  const buttonVariants = {
    default:  { width: "3rem", borderRadius: "3rem", rotate: 0 },
    loading:  { width: "9rem", borderRadius: "3rem" },
    loaded:   { width: "22rem", borderRadius: "1rem" },
    failed:   { width: "3rem", borderRadius: "1rem", rotate: 45 },
  }

  const mainDivVariants = {
    default:  { width: "60vw", height: "3rem", background: "rgb(212,212,212)"}, //Neutral 300
    loading:  { width: "60vw", height: "1rem", background: "rgb(212,212,212)"},
    loaded:   { width: "22rem", height: "40rem", background: "rgb(212,212,212)"},  
    failed:  { width: "22rem", height: "3rem", background: "rgb(153,27,27)"}, //Red 800
  }

  return (
    <>
      <Head>
        <title>TT Downloader</title>
        <meta name="description" content="Download Tiktok Videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#ce9595] to-[#35043b] gap-6">
            <AnimatePresence>
              {isState.default && 
                <motion.h1 className="text-center text-4xl md:text-5xl text-white"
                initial={ false }
                animate={{ opacity: 1 }}
                exit={{ opacity: 0}}>
                  <strong>Tiktok</strong><br/>Downloader
                </motion.h1>
              }
            </AnimatePresence>
            <motion.form className="items-center flex flex-col gap-6" onSubmit={(e) => {e.preventDefault()}}>
              <motion.div
              className="flex shadow-md p-2" 
              style={{ borderRadius: "3rem", maxHeight: "80vh", maxWidth: "95vw" }}
              initial={false}
              animate={state as string}
              variants={mainDivVariants}>
                {isState.default &&
                  <input
                  onChange={updateUrl}
                  className="w-full h-full bg-transparent text-neutral-700 text-xl text-center outline-none"
                  placeholder="Enter Tiktok URL..."/>
                }
                {isState.loaded &&
                  <div className="flex flex-col h-full w-full gap-2">
                    <VideoInfo video={video} />
                    <div className="relative bg-neutral-500 w-full flex flex-grow rounded-[2.5rem] overflow-clip">
                    {video?.thumbnail && 
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                      className="absolute top-0 w-full object-cover aspect-[360/640] rounded-[2.5rem]" 
                      alt="" width={360} height={640} src={video.thumbnail}/>
                    }
                    </div>
                  </div>
                }
                {isState.failed &&
                  <span className="w-full h-full bg-transparent text-white text-2xl text-center">
                    Download Failed
                  </span>
                }
              </motion.div>
              <motion.button 
                className={`${hoverButtonColor()} items-center bg-neutral-300 shadow-md h-12 text-xl text-neutral-600 hover:text-white hover:fill-white fill-neutral-600 hover:shadow-lg transition-colors`}
                onClick={handleClick}
                style={{rotate: 0, maxWidth: "95vw"}}
                animate={state as string}
                variants={buttonVariants}>
                  {isState.default && <DownloadIcon className="m-1" />}
                  {isState.loading && <span>CANCEL</span>}
                  {isState.loaded && <span>DOWNLOAD</span>}
                  {isState.failed && <RefreshIcon className="m-2 mt-1" />}
              </motion.button>
            </motion.form>
      </main>
    </>
  );
};

export default Home;
