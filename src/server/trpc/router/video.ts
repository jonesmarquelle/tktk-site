import { randomBytes } from "crypto";
import youtubeDl from "youtube-dl-exec";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const videoRouter = router({
  getVideo: publicProcedure
    .input(z.object({
      url: z.string().nullish()
    }).nullish())
    .query(async ({ input }) => {
      if (!input || !input.url) return { res: undefined };
      
      const randID = randomBytes(8).toString('hex');
      const flags: Record<string, unknown> = {
        maxFilesize: "50M",
        output: `${randID}_%(id)s.%(ext)s`,
        format: 'mp4',
        dumpJson: true,
        simulate:false,
        quiet:true,
      }

      console.log("Downloading video...");
      const res = await youtubeDl(input.url, flags);
      return {
        res: {
          filename: res._filename,
          username: res.uploader,
          name: res.creator,
          likesCount: res.like_count,
          // @ts-ignore
          commentsCount: res.comment_count,
          // @ts-ignore
          sharesCount: res.repost_count,
          thumbnail: res.thumbnails.find((thumb) => thumb.id === "dynamic_cover")?.url ?? res.thumbnail,
        }
      };
    }),
});
