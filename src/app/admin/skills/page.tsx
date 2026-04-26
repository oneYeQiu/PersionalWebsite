"use client";

import { useEffect, useState } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  sortOrder: number;
}

const categories = ["技术", "产品", "其他"];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({ name: "", category: "技术", proficiency: 3 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      setNewSkill({ name: "", category: "技术", proficiency: 3 });
      fetchSkills();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "添加失败" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${editingSkill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });

      if (!res.ok) throw new Error();

      setEditingSkill(null);
      fetchSkills();
    } catch {
      alert("更新失败");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("确定要删除这个技能吗？")) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSkills(skills.filter((s) => s.id !== id));
    } catch {
      alert("删除失败");
    }
  };

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  if (loading) {
    return <p className="text-gray-500">加载中...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">技能标签</h1>

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

      <form onSubmit={handleAddSkill} className="mb-8 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
        <h2 className="text-lg font-medium mb-4">添加新技能</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1">技能名称</label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
              placeholder="如：React"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">分类</label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">熟练度 (1-5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={newSkill.proficiency}
              onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) || 1 })}
              className="w-20 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 disabled:opacity-50"
          >
            {saving ? "添加中..." : "添加"}
          </button>
        </div>
      </form>

      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-medium mb-4">{category}</h2>
          <div className="space-y-2">
            {categorySkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                {editingSkill?.id === skill.id ? (
                  <form onSubmit={handleUpdateSkill} className="flex-1 flex gap-4 items-end">
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
                    />
                    <select
                      value={editingSkill.category}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={editingSkill.proficiency}
                      onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) || 1 })}
                      className="w-20 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
                    />
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">
                      保存
                    </button>
                    <button type="button" onClick={() => setEditingSkill(null)} className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg">
                      取消
                    </button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-500">熟练度: {skill.proficiency}/5</span>
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="px-3 py-1 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      删除
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <p className="text-gray-500">暂无技能</p>
      )}
    </div>
  );
}
