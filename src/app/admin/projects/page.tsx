"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  techStack: string[];
  isPublished: boolean;
  sortOrder: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/all");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("确定要删除这个项目吗？")) return;

    setDeleting(slug);
    try {
      const res = await fetch(`/api/projects/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProjects(projects.filter((p) => p.slug !== slug));
    } catch (error) {
      alert("删除失败");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <p className="text-gray-500">加载中...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">项目作品</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80"
        >
          添加项目
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium">{project.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      project.isPublished
                        ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}
                  >
                    {project.isPublished ? "已发布" : "草稿"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{project.description}</p>
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techStack.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/admin/projects/${project.slug}`}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(project.slug)}
                  disabled={deleting === project.slug}
                  className="px-3 py-1 text-sm text-red-500 border border-red-200 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  {deleting === project.slug ? "删除中..." : "删除"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无项目</p>
      )}
    </div>
  );
}
