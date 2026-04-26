"use client";

import { useEffect, useState } from "react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isPublic: boolean;
  sortOrder: number;
}

const platformOptions = ["GitHub", "LinkedIn", "Twitter", "掘金", "博客园", "其他"];

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [newLink, setNewLink] = useState({ platform: "GitHub", url: "", isPublic: true });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/social-links/all");
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.url.trim()) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      setNewLink({ platform: "GitHub", url: "", isPublic: true });
      fetchLinks();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "添加失败" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/social-links/${editingLink.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLink),
      });

      if (!res.ok) throw new Error();

      setEditingLink(null);
      fetchLinks();
    } catch {
      alert("更新失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("确定要删除这个链接吗？")) return;

    try {
      const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLinks(links.filter((l) => l.id !== id));
    } catch {
      alert("删除失败");
    }
  };

  if (loading) {
    return <p className="text-gray-500">加载中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">社交链接</h1>

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

      <form onSubmit={handleAddLink} className="mb-8 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h2 className="text-lg font-medium mb-4">添加链接</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">平台</label>
            <select
              value={newLink.platform}
              onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">链接 URL</label>
            <input
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
              placeholder="https://..."
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={newLink.isPublic}
              onChange={(e) => setNewLink({ ...newLink, isPublic: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm">公开</span>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "添加中..." : "添加"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between"
          >
            {editingLink?.id === link.id ? (
              <form onSubmit={handleUpdateLink} className="flex-1 flex gap-4 items-end">
                <select
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
                >
                  {platformOptions.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
                />
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={editingLink.isPublic}
                    onChange={(e) => setEditingLink({ ...editingLink, isPublic: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">公开</span>
                </label>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
                  保存
                </button>
                <button type="button" onClick={() => setEditingLink(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg">
                  取消
                </button>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{link.platform}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {link.url}
                  </a>
                  {!link.isPublic && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
                      隐藏
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingLink(link)}
                    className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="px-3 py-1 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <p className="text-gray-500">暂无链接</p>
      )}
    </div>
  );
}
