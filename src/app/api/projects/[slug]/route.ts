import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
    });

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json(
      { error: '获取项目详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
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

    if (slug) {
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(slug)) {
        return NextResponse.json(
          { error: '项目别名只能包含小写字母、数字和连字符' },
          { status: 400 }
        );
      }

      const existingProject = await prisma.project.findFirst({
        where: {
          slug,
          NOT: { slug: params.slug },
        },
      });

      if (existingProject) {
        return NextResponse.json(
          { error: '项目别名已存在' },
          { status: 400 }
        );
      }
    }

    const project = await prisma.project.update({
      where: { slug: params.slug },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(projectUrl !== undefined && { projectUrl }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(techStack !== undefined && { techStack }),
        ...(role !== undefined && { role }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json(
      { error: '更新项目失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.project.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: '删除项目失败' },
      { status: 500 }
    );
  }
}
