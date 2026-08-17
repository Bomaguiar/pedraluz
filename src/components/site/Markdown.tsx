import type { ReactNode } from "react";

function inline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /!\[([^\]]*)\]\(([^)\s]+)\)|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[2]) {
      nodes.push(
        <img key={key} src={m[2]} alt={m[1]} className="my-8 w-full object-cover" loading="lazy" />,
      );
    } else if (m[4]) {
      nodes.push(
        <a
          key={key}
          href={m[4]}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--brass)] underline underline-offset-4"
        >
          {m[3]}
        </a>,
      );
    } else if (m[5]) {
      nodes.push(
        <strong key={key} className="font-medium text-foreground">
          {m[5]}
        </strong>,
      );
    } else if (m[6]) {
      nodes.push(<em key={key}>{m[6]}</em>);
    } else if (m[7]) {
      nodes.push(
        <code key={key} className="bg-muted px-1.5 py-0.5 text-[0.85em]">
          {m[7]}
        </code>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (!list.length) return;
    blocks.push(
      <ul key={key} className="my-6 space-y-2 pl-5">
        {list.map((item, idx) => (
          <li key={idx} className="list-disc text-muted-foreground">
            {inline(item, `${key}-${idx}`)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  let paragraph: string[] = [];
  const flushParagraph = (key: string) => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ");
    blocks.push(
      <p key={key} className="my-5 text-base leading-relaxed text-muted-foreground">
        {inline(text, key)}
      </p>,
    );
    paragraph = [];
  };

  lines.forEach((line, i) => {
    const key = `b-${i}`;
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);

    if (heading) {
      flushParagraph(`${key}-p`);
      flushList(`${key}-l`);
      const level = heading[1].length;
      const sizes = ["text-4xl", "text-3xl", "text-2xl", "text-xl"];
      blocks.push(
        <h2
          key={key}
          className={`font-display mt-12 mb-4 leading-tight text-foreground ${sizes[level - 1]}`}
        >
          {inline(heading[2], key)}
        </h2>,
      );
    } else if (bullet) {
      flushParagraph(`${key}-p`);
      list.push(bullet[1]);
    } else if (line.trim() === "") {
      flushParagraph(`${key}-p`);
      flushList(`${key}-l`);
    } else {
      flushList(`${key}-l`);
      paragraph.push(line.trim());
    }
  });
  flushParagraph("b-end-p");
  flushList("b-end-l");

  return <div className="max-w-2xl">{blocks}</div>;
}
