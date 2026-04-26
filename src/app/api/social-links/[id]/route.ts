import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { platform, url, isPublic, sortOrder } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: '平台和链接不能为空' },
        { status: 400 }
      );
    }

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(url)) {
      return NextResponse.json(
        { error: '请输入有效的URL格式' },
        { status: 400 }
      );
    }

    const link = await prisma.socialLink.update({
      where: { id: params.id },
      data: {
        platform,
        url,
        isPublic: isPublic ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Update social link error:', error);
    return NextResponse.json(
      { error: '更新社交链接失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.socialLink.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete social link error:', error);
    return NextResponse.json(
      { error: '删除社交链接失败' },
      { status: 500 }
    );
  }
}
