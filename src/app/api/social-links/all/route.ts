import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Get all social links error:', error);
    return NextResponse.json(
      { error: '获取社交链接失败' },
      { status: 500 }
    );
  }
}
