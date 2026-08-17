// Server-only helpers that read markdown posts from a public GitHub repository.
// The repo acts as a lightweight CMS: push a .md file, the site picks it up.

export type NewsPost = {
  slug: string;
  title: string;
  date: string | null;
  excerpt: string;
  cover: string | null;
  tags: string[];
  body: string;
};

const GH = "https://api.github.com";

function repoConfig() {
  const repo = process.env["NEWS_GITHUB_REPO"] ?? "ourarchitect/pedraluz-news";
  const branch = process.env["NEWS_GITHUB_BRANCH"] ?? "main";
  const dir = process.env["NEWS_GITHUB_PATH"] ?? "posts";
  return { repo, branch, dir };
}

function headers() {
  const h: Record<string, string> = { Accept: "application/vnd.github+json" };
  const token = process.env["NEWS_GITHUB_TOKEN"];
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

function toPost(fileName: string, raw: string): NewsPost {
  const { meta, body } = parseFrontmatter(raw);
  const slug = (meta["slug"] || fileName.replace(/\.mdx?$/i, "")).trim();
  const firstHeading = /^#\s+(.+)$/m.exec(body);
  const title = meta["title"] || firstHeading?.[1] || slug.replace(/[-_]/g, " ");
  const plain = body
    .replace(/^#.*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return {
    slug,
    title,
    date: meta["date"] || null,
    excerpt: meta["excerpt"] || meta["description"] || plain.slice(0, 180),
    cover: meta["cover"] || meta["image"] || null,
    tags: (meta["tags"] || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    body,
  };
}

export type NewsResult = { posts: NewsPost[]; repo: string; error: string | null };

export async function fetchNewsPosts(): Promise<NewsResult> {
  const { repo, branch, dir } = repoConfig();
  try {
    const listRes = await fetch(
      `${GH}/repos/${repo}/contents/${encodeURIComponent(dir)}?ref=${encodeURIComponent(branch)}`,
      { headers: headers() },
    );
    if (!listRes.ok) {
      const text = await listRes.text();
      return {
        posts: [],
        repo,
        error: `GitHub responded ${listRes.status}: ${text.slice(0, 200)}`,
      };
    }
    const files = (await listRes.json()) as Array<{
      name: string;
      type: string;
      download_url: string | null;
    }>;
    const markdown = files.filter(
      (f) => f.type === "file" && /\.mdx?$/i.test(f.name) && f.download_url,
    );

    const posts = await Promise.all(
      markdown.map(async (f) => {
        const res = await fetch(f.download_url!, { headers: headers() });
        const raw = res.ok ? await res.text() : "";
        return toPost(f.name, raw);
      }),
    );

    posts.sort((a, b) => {
      const da = a.date ? Date.parse(a.date) : 0;
      const db = b.date ? Date.parse(b.date) : 0;
      return db - da;
    });

    return { posts, repo, error: null };
  } catch (err) {
    return { posts: [], repo, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function fetchNewsPost(slug: string): Promise<{ post: NewsPost | null; repo: string; error: string | null }> {
  const { posts, repo, error } = await fetchNewsPosts();
  return { post: posts.find((p) => p.slug === slug) ?? null, repo, error };
}
