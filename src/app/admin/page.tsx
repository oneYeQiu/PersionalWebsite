"use client";

import { useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string;
  avatar: string | null;
  tagline: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  wechat: string | null;
}

export default function AdminUserPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    tagline: "",
    bio: "",
    email: "",
    phone: "",
    wechat: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name || "",
        avatar: data.avatar || "",
        tagline: data.tagline || "",
        bio: data.bio || "",
        email: data.email || "",
        phone: data.phone || "",
        wechat: data.wechat || "",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      setMessage({ type: "success", text: "保存成功" });
      fetchUser();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "保存失败" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">加载中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">个人信息</h1>

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

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">姓名</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="2-20个字符"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">头像 URL</label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">一句话介绍</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="展示在首页的个人简介"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">详细简介</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="关于你自己的详细介绍"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">邮箱</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="联系邮箱"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">手机号</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">微信号</label>
          <input
            type="text"
            value={formData.wechat}
            onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}
