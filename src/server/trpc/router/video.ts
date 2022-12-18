import { observable } from "@trpc/server/observable";
import { randomBytes } from "crypto";
import EventEmitter from "events";
import youtubeDl from "youtube-dl-exec";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

interface TiktokVideo {
  filename: string,
  username: string,
  name: string,
  likesCount: number,
  commentsCount: number,
  sharesCount: number,
  thumbnail: string,
}

interface MyEvents {
  video: (data: TiktokVideo) => void;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MyEventEmitter extends EventEmitter {}

const ee = new MyEventEmitter();

export const videoRouter = router({
  onVideo: publicProcedure
  .subscription(() => {
    return observable<TiktokVideo>((emit) => {
      const onVideo = (data: TiktokVideo) => {
        emit.next(data);
      };

      ee.on('video', onVideo);

      return () => {
        ee.off('video', onVideo);
      };
    });
  }),

  getVideo: publicProcedure
    .input(z.object({
      url: z.string().nullish()
    }).nullish())
    .query(async ({ input }) => {
      if (!input || !input.url) return { res: undefined };
      
      const randID = randomBytes(8).toString('hex');
      const flags: Record<string, unknown> = {
        maxFilesize: "100M",
        output: `${randID}_%(id)s.%(ext)s`,
        format: 'mp4',
        dumpJson: true,
        simulate:false,
        quiet:true,
      }

      console.log(`Downloading video...: ${input.url}`);
      const res = await youtubeDl(input.url, flags);
      const vid = 
        {
          filename: res._filename,
          username: res.uploader,
          name: res.creator,
          likesCount: res.like_count,
          // @ts-ignore
          commentsCount: res.comment_count,
          // @ts-ignore
          sharesCount: res.repost_count,
          thumbnail: res.thumbnails.find((thumb) => thumb.id === "dynamic_cover")?.url ?? res.thumbnail,
        } as TiktokVideo
      console.log(`Result: ${JSON.stringify(vid)}`);
      ee.emit('video', vid);
      return {res: vid};
    }),
});
