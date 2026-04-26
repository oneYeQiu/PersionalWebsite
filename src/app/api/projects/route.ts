import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      content,
      imageUrl,
      projectUrl,
      githubUrl,
      techStack,
      role,
      sortOrder,
      isPublished,
    } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: '项目名称、别名和描述不能为空' },
        { status: 400 }
      );
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { error: '项目别名只能包含小写字母、数字和连字符' },
        { status: 400 }
      );
    }

    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: '项目别名已存在' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        content: content || '',
        imageUrl,
        projectUrl,
        githubUrl,
        techStack: techStack || [],
        role,
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: '创建项目失败' },
      { status: 500 }
    );
  }
}
