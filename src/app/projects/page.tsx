import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

async function getProjects() {
  return prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">项目作品</h1>
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                >
                  <h2 className="text-xl font-medium mb-2">{project.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {project.description}
                  </p>
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无项目</p>
          )}
        </div>
      </main>
    </>
  );
}
