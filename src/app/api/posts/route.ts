import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        tags: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      isPublished,
      publishedAt,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: '标题、别名和内容不能为空' },
        { status: 400 }
      );
    }

    const slugPattern = /^[a-z0-9-]+$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { error: '文章别名只能包含小写字母、数字和连字符' },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: '文章别名已存在' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category,
        tags: tags || [],
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? (publishedAt || new Date()) : null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
}
