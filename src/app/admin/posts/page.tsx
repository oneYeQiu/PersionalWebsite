"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/all");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;

    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setPosts(posts.filter((p) => p.slug !== slug));
    } catch {
      alert("删除失败");
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("zh-CN");
  };

  if (loading) {
    return <p className="text-gray-500">加载中...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">博客文章</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80"
        >
          写文章
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium">{post.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      post.isPublished
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {post.isPublished ? "已发布" : "草稿"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>创建于: {formatDate(post.createdAt)}</span>
                  {post.publishedAt && <span>发布于: {formatDate(post.publishedAt)}</span>}
                  {post.category && <span>{post.category}</span>}
                </div>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/admin/posts/${post.slug}`}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="px-3 py-1 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无文章</p>
      )}
    </div>
  );
}
