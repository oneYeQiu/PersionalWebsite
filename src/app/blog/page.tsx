import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

async function getPosts() {
  return prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      tags: true,
      publishedAt: true,
    },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">博客文章</h1>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-xl font-medium mb-2">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {post.publishedAt && (
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString("zh-CN")}
                      </span>
                    )}
                    {post.category && <span>{post.category}</span>}
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
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
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无文章</p>
          )}
        </div>
      </main>
    </>
  );
}
