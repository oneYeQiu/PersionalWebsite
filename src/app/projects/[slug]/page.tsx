import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug },
  });
  return project;
}

async function getAllProjectSlugs() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return projects.map((p) => p.slug);
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="text-sm text-gray-500 hover:underline mb-6 inline-block"
          >
            ← 返回项目列表
          </Link>

          <article>
            <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

            {project.role && (
              <p className="text-gray-500 mb-4">角色：{project.role}</p>
            )}

            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {project.description}
            </p>

            {project.imageUrl && (
              <div className="mb-8">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {project.content && (
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="whitespace-pre-wrap">{project.content}</p>
              </div>
            )}

            {project.techStack.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">技术栈</h2>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
                >
                  查看项目
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
