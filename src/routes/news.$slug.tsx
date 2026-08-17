import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Markdown } from "@/components/site/Markdown";
import { useLang } from "@/i18n/LanguageProvider";
import { getNewsPost } from "@/lib/news.functions";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["news", "post", slug],
    queryFn: () => getNewsPost({ data: { slug } }),
    staleTime: 1000 * 60 * 5,
  });

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ context, params }) => {
    const result = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!result.post) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    const title = post ? `${post.title} — Pedra & Luz` : "News — Pedra & Luz";
    const description = post?.excerpt ?? "Studio news and project updates from Pedra & Luz.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post?.cover?.startsWith("https://")
          ? [
              { property: "og:image", content: post.cover },
              { name: "twitter:image", content: post.cover },
            ]
          : []),
      ],
    };
  },
  component: NewsPostPage,
});

function NewsPostPage() {
  const { slug } = Route.useParams();
  const { t } = useLang();
  const { data } = useSuspenseQuery(postQuery(slug));
  const post = data.post;
  if (!post) return null;

  const date = post.date ? new Date(post.date) : null;
  const formatted =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
      : post.date;

  return (
    <SiteLayout>
      <article className="container-edge pb-24 pt-36">
        <Link
          to="/news"
          className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-[var(--brass)]"
        >
          ← {t("nav.news")}
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="label-tag text-[var(--brass)]">{formatted}</p>
          <h1 className="font-display mt-4 text-4xl leading-[1.08] md:text-6xl">{post.title}</h1>
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="img-warm mt-12 max-h-[70vh] w-full object-cover"
            loading="eager"
          />
        )}

        <div className="mt-12">
          <Markdown source={post.body} />
        </div>
      </article>
    </SiteLayout>
  );
}
