import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (existingAdmin) {
    console.log('管理员已存在');
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });
    console.log(`管理员创建成功: ${adminUsername} / ${adminPassword}`);
    console.log('请及时修改默认密码！');
  }

  const existingUser = await prisma.user.findFirst();
  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: '叶秋',
        tagline: '5年产品经理，专注B端工具类产品',
      },
    });
    console.log('默认用户信息已创建');
  }

  const existingSkills = await prisma.skill.findMany();
  if (existingSkills.length === 0) {
    const skills = [
      { name: 'Java', category: '技术', proficiency: 5, sortOrder: 1 },
      { name: 'Python', category: '技术', proficiency: 4, sortOrder: 2 },
      { name: 'SpringBoot', category: '技术', proficiency: 5, sortOrder: 3 },
      { name: 'Spring Cloud', category: '技术', proficiency: 4, sortOrder: 4 },
      { name: 'MySQL', category: '技术', proficiency: 4, sortOrder: 5 },
      { name: 'Redis', category: '技术', proficiency: 4, sortOrder: 6 },
      { name: 'ElasticSearch', category: '技术', proficiency: 3, sortOrder: 7 },
      { name: '需求分析', category: '产品', proficiency: 5, sortOrder: 1 },
      { name: 'PRD撰写', category: '产品', proficiency: 5, sortOrder: 2 },
      { name: '用户研究', category: '产品', proficiency: 4, sortOrder: 3 },
      { name: '项目管理', category: '产品', proficiency: 4, sortOrder: 4 },
    ];

    for (const skill of skills) {
      await prisma.skill.create({ data: skill });
    }
    console.log('默认技能标签已创建');
  }

  const existingSocialLink = await prisma.socialLink.findFirst();
  if (!existingSocialLink) {
    await prisma.socialLink.create({
      data: {
        platform: 'GitHub',
        url: 'https://github.com/oneYeQiu',
        isPublic: true,
        sortOrder: 1,
      },
    });
    console.log('默认社交链接已创建');
  }

  console.log('数据库初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
