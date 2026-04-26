import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: { id: session.userId, username: session.username },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: '获取会话失败' },
      { status: 500 }
    );
  }
}
