import { Fragment } from "react";

/** Minimal, safe markdown renderer for CMS pages: ## / ### headings, paragraphs, - lists, **bold**, [links](url). */
function inline(text: string, keyBase: string) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={`${keyBase}-${i++}`}>{m[2]}</strong>);
    else if (m[4]) {
      const href = /^(https?:|mailto:|tel:|\/)/.test(m[5]) ? m[5] : "#";
      parts.push(
        <a key={`${keyBase}-${i++}`} href={href} rel="noreferrer">
          {m[4]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function Markdown({ content, className = "prose-site" }: { content: string; className?: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((block, bi) => {
        const b = block.trim();
        if (!b) return null;
        if (b.startsWith("### ")) return <h3 key={bi}>{inline(b.slice(4), `h${bi}`)}</h3>;
        if (b.startsWith("## ")) return <h2 key={bi}>{inline(b.slice(3), `h${bi}`)}</h2>;
        if (b.startsWith("# ")) return <h2 key={bi}>{inline(b.slice(2), `h${bi}`)}</h2>;
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*[-*] /, ""), `l${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `p${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
