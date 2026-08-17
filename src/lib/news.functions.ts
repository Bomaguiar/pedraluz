import { createServerFn } from "@tanstack/react-start";

export const getNewsPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchNewsPosts } = await import("./news.server");
  return fetchNewsPosts();
});

export const getNewsPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { fetchNewsPost } = await import("./news.server");
    return fetchNewsPost(data.slug);
  });
