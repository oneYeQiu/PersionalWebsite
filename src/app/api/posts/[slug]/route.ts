import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: '获取文章详情失败' },
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

    if (slug) {
      const slugPattern = /^[a-z0-9-]+$/;
      if (!slugPattern.test(slug)) {
        return NextResponse.json(
          { error: '文章别名只能包含小写字母、数字和连字符' },
          { status: 400 }
        );
      }

      const existingPost = await prisma.post.findFirst({
        where: {
          slug,
          NOT: { slug: params.slug },
        },
      });

      if (existingPost) {
        return NextResponse.json(
          { error: '文章别名已存在' },
          { status: 400 }
        );
      }
    }

    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      coverImage?: string;
      category?: string;
      tags?: string[];
      isPublished?: boolean;
      publishedAt?: Date | null;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !publishedAt) {
        const currentPost = await prisma.post.findUnique({ where: { slug: params.slug } });
        updateData.publishedAt = currentPost?.publishedAt || new Date();
      } else if (!isPublished) {
        updateData.publishedAt = null;
      }
    }
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
}
