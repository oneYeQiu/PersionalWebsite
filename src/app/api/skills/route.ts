import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    return NextResponse.json(
      { error: '获取技能列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, proficiency, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: '技能名称不能为空' },
        { status: 400 }
      );
    }

    if (proficiency !== undefined && (proficiency < 1 || proficiency > 5)) {
      return NextResponse.json(
        { error: '熟练度必须在1-5之间' },
        { status: 400 }
      );
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { name },
    });

    if (existingSkill) {
      return NextResponse.json(
        { error: '技能已存在' },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category: category || '技术',
        proficiency: proficiency ?? 3,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    return NextResponse.json(
      { error: '创建技能失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills } = body;

    if (!Array.isArray(skills)) {
      return NextResponse.json(
        { error: '技能列表格式不正确' },
        { status: 400 }
      );
    }

    const updatedSkills = await prisma.$transaction(
      skills.map((skill: { id: string; name: string; category: string; proficiency: number; sortOrder: number }) =>
        prisma.skill.update({
          where: { id: skill.id },
          data: {
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            sortOrder: skill.sortOrder,
          },
        })
      )
    );

    return NextResponse.json(updatedSkills);
  } catch (error) {
    console.error('Update skills error:', error);
    return NextResponse.json(
      { error: '更新技能列表失败' },
      { status: 500 }
    );
  }
}
