import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/i;

function getYoutubeId(href?: string): string | null {
  if (!href) return null;
  const match = href.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

/**
 * Blog yazısı içeriğini (Firestore'da markdown string olarak saklanır)
 * sitenin koyu temasıyla uyumlu, okunabilir bir tipografiyle render eder.
 *
 * Özel davranışlar:
 * - Kendi satırında duran bir YouTube linki otomatik olarak gömülü
 *   (responsive iframe) oynatıcıya dönüşür.
 * - Görseller (`![alt](url)`) yuvarlatılmış, kenarlıklı, tam genişlikte
 *   render edilir; alt metni varsa altında küçük bir açıklama olarak gösterilir.
 */
export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert max-w-none space-y-4 text-gray-300 leading-relaxed prose-headings:text-white prose-strong:text-white prose-a:text-[#A9B7C4] prose-a:no-underline hover:prose-a:text-[#C7D2DA] prose-blockquote:border-l-[#A9B7C4]/40 prose-blockquote:text-gray-400 prose-hr:border-white/10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre className="rounded-xl border border-white/10 bg-[#0B0E12] p-4 overflow-x-auto text-sm">
              {children}
            </pre>
          ),
          code: ({ children, className }) => {
            const isBlock = Boolean(className && className.includes("language-"));
            if (isBlock) {
              return <code className={`${className} text-gray-200`}>{children}</code>;
            }
            return (
              <code className="bg-white/[0.06] text-[#A9B7C4] rounded px-1.5 py-0.5 text-[0.9em]">
                {children}
              </code>
            );
          },
          a: ({ href, children }) => {
            const youtubeId = getYoutubeId(href);
            if (youtubeId) {
              return (
                <span className="not-prose block my-6 rounded-xl overflow-hidden border border-white/10 bg-black aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </span>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <span className="not-prose block my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={typeof src === "string" ? src : undefined}
                alt={alt ?? ""}
                loading="lazy"
                className="w-full rounded-xl border border-white/10 shadow-lg shadow-black/20"
              />
              {alt && <span className="block mt-2 text-center text-xs text-gray-500">{alt}</span>}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
