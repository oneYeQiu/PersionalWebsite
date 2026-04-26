"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function EditPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: [] as string[],
    isPublished: false,
    publishedAt: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${params.slug}`);
      const data = await res.json();
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        coverImage: data.coverImage || "",
        category: data.category || "",
        tags: data.tags || [],
        isPublished: data.isPublished ?? false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : "",
      });
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`/api/posts/${params.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.isPublished && formData.publishedAt ? new Date(formData.publishedAt) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage({ type: "success", text: "保存成功" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  if (loading) {
    return <p className="text-gray-500">加载中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>

      {message.text && (
        <div
          className={`p-3 mb-6 text-sm rounded-lg ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-600"
              : "bg-red-50 dark:bg-red-900/20 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">标题 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">别名 *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData({
                ...formData,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              })
            }
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">摘要</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">内容 * (Markdown)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={20}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 font-mono text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">封面图片 URL</label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">分类</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">发布日期</label>
            <input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">标签</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">发布</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
