import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const videoRouter = router({
  getVideo: publicProcedure
    .input(z.object({ url: z.string().nullish() }).nullish())
    .query(async ({ input }) => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        await sleep(10000);
      return {
        greeting: `Hello ${input?.url ?? "world"}`,
      };
    }),
});
