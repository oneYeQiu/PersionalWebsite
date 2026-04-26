import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Get all projects error:', error);
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}
