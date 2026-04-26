import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
  });
  return post;
}

async function getAllPostSlugs() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-gray-500 hover:underline mb-6 inline-block"
          >
            ← 返回博客列表
          </Link>

          <article>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("zh-CN")}
                </span>
              )}
              {post.category && <span>{post.category}</span>}
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInlineCode = !match;
                    return isInlineCode ? (
                      <code
                        className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
