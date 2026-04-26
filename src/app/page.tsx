import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

async function getUser() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "叶秋",
        tagline: "5年产品经理，专注B端工具类产品",
      },
    });
  }
  return user;
}

async function getProjects() {
  return prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
}

async function getSocialLinks() {
  return prisma.socialLink.findMany({
    where: { isPublic: true },
    orderBy: { sortOrder: "asc" },
  });
}

async function getRecentPosts() {
  return prisma.post.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      slug: true,
      title: true,
      publishedAt: true,
    },
  });
}

export default async function HomePage() {
  const [user, projects, skills, socialLinks, recentPosts] = await Promise.all([
    getUser(),
    getProjects(),
    getSkills(),
    getSocialLinks(),
    getRecentPosts(),
  ]);

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-3xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name[0]
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {user.tagline}
                </p>
              </div>
            </div>

            {user.bio && (
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {link.platform}
                </a>
              ))}
              {user.email && (
                <a href={`mailto:${user.email}`} className="hover:underline">
                  邮箱
                </a>
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">项目作品</h2>
            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <h3 className="text-xl font-medium mb-2">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.techStack.slice(0, 5).map((tech) => (
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
          </section>

          {Object.keys(groupedSkills).length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">技能标签</h2>
              <div className="space-y-4">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-sm text-gray-500 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                          title={`熟练度: ${skill.proficiency}/5`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {recentPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">博客文章</h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <h3 className="font-medium mb-1">{post.title}</h3>
                    {post.publishedAt && (
                      <p className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString("zh-CN")}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold mb-6">联系方式</h2>
            <p className="text-gray-600 dark:text-gray-400">
              欢迎通过邮箱联系我：
              {user.email ? (
                <a href={`mailto:${user.email}`} className="ml-1 hover:underline">
                  {user.email}
                </a>
              ) : (
                " 待设置"
              )}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
