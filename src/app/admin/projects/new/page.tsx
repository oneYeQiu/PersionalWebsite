"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  name: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  projectUrl: string;
  githubUrl: string;
  techStack: string[];
  role: string;
  sortOrder: number;
  isPublished: boolean;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Project>({
    name: "",
    slug: "",
    description: "",
    content: "",
    imageUrl: "",
    projectUrl: "",
    githubUrl: "",
    techStack: [],
    role: "",
    sortOrder: 0,
    isPublished: true,
  });
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      router.push("/admin/projects");
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "创建失败" });
    } finally {
      setSaving(false);
    }
  };

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tech),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">添加项目</h1>

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
          <label className="block text-sm font-medium mb-2">项目名称 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, ""),
              })
            }
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">项目别名 *</label>
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
            placeholder="用于URL，如: my-project"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">项目描述 *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="简短描述项目"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">项目详情</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 font-mono text-sm"
            placeholder="Markdown 格式的项目详细介绍"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">封面图片 URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">项目链接</label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub 链接</label>
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">角色</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            placeholder="如：产品负责人"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">技术栈</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
              placeholder="输入技术名称后按回车添加"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              添加
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
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

          <div>
            <label className="block text-sm mb-1">排序</label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-24 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "创建中..." : "创建"}
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
