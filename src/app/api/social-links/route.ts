import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isPublic: true },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Get social links error:', error);
    return NextResponse.json(
      { error: '获取社交链接失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, url, isPublic, sortOrder } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: '平台和链接不能为空' },
        { status: 400 }
      );
    }

    const validPlatforms = ['GitHub', 'LinkedIn', 'Twitter', '掘金', '博客园', '其他'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: '不支持的平台类型' },
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

    const link = await prisma.socialLink.create({
      data: {
        platform,
        url,
        isPublic: isPublic ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Create social link error:', error);
    return NextResponse.json(
      { error: '创建社交链接失败' },
      { status: 500 }
    );
  }
}
