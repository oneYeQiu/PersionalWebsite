import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: '叶秋',
          tagline: '5年产品经理，专注B端工具类产品',
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, avatar, tagline, bio, email, phone, wechat } = body;

    if (name && (name.length < 2 || name.length > 20)) {
      return NextResponse.json(
        { error: '姓名长度必须在2-20个字符之间' },
        { status: 400 }
      );
    }

    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: { name: name || '叶秋' },
      });
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(avatar !== undefined && { avatar }),
        ...(tagline !== undefined && { tagline }),
        ...(bio !== undefined && { bio }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(wechat !== undefined && { wechat }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}
