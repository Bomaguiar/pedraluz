import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useLang } from "@/i18n/LanguageProvider";
import { getNewsPosts } from "@/lib/news.functions";
import featuredImg from "@/assets/featured-project.jpg";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News & Updates — Pedra & Luz" },
      {
        name: "description",
        content:
          "Studio news, site progress, and project updates from Pedra & Luz — published straight from our editorial repository.",
      },
      { property: "og:title", content: "News & Updates — Pedra & Luz" },
      {
        property: "og:description",
        content: "Studio news, site progress, and project updates from Pedra & Luz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Pedra & Luz — News & Updates",
        href: "/rss.xml",
      },
    ],
  }),
  loader: () => getNewsPosts(),
  component: NewsPage,
});

function formatDate(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function NewsPage() {
  const { t } = useLang();
  const data = Route.useLoaderData();
  const posts = data.posts;

  return (
    <SiteLayout overHero>
      <PageHero
        label={t("nav.news")}
        title={t("news.hero.title")}
        subtitle={t("news.hero.subtitle")}
        image={featuredImg}
      />

      <section className="container-edge py-20">
        {posts.length === 0 ? (
          <div className="max-w-2xl border border-border p-8">
            <p className="label-tag text-[var(--brass)]">{t("news.empty.label")}</p>
            <h2 className="font-display mt-4 text-3xl">{t("news.empty.title")}</h2>
            <p className="mt-4 text-muted-foreground">{t("news.empty.body")}</p>
            <ol className="mt-6 space-y-3 pl-5 text-sm text-muted-foreground">
              <li className="list-decimal">
                {t("news.empty.step1")}{" "}
                <code className="bg-muted px-1.5 py-0.5">{data.repo}</code>
              </li>
              <li className="list-decimal">
                {t("news.empty.step2")} <code className="bg-muted px-1.5 py-0.5">posts/</code>
              </li>
              <li className="list-decimal">{t("news.empty.step3")}</li>
            </ol>
            <pre className="mt-6 overflow-x-auto border border-border bg-muted/40 p-4 text-[11px] leading-relaxed text-muted-foreground">
{`---
title: Foundations poured in Cascais
date: 2026-08-12
excerpt: Structural slab complete, two days ahead of schedule.
cover: https://example.com/photo.jpg
tags: site progress, cascais
---

# Foundations poured in Cascais

Full story in markdown...`}
            </pre>
            {data.error && (
              <p className="mt-6 text-xs text-muted-foreground/70">{data.error}</p>
            )}
          </div>
        ) : (
          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to="/news/$slug"
                params={{ slug: post.slug }}
                className="group flex flex-col bg-background p-8 transition-colors hover:bg-muted/40"
              >
                {post.cover && (
                  <img
                    src={post.cover}
                    alt=""
                    loading="lazy"
                    className="img-warm mb-6 aspect-[4/3] w-full object-cover"
                  />
                )}
                <p className="label-tag text-[var(--brass)]">{formatDate(post.date)}</p>
                <h2 className="font-display mt-3 text-2xl leading-snug">{post.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                <span className="mt-6 text-[11px] uppercase tracking-[0.18em] text-foreground/70 group-hover:text-[var(--brass)]">
                  {t("news.read")} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
