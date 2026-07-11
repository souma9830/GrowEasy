import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/db/models/User';
import * as bcrypt from 'bcryptjs';
import { signToken, COOKIE_NAME } from '@/lib/auth/jwt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    if ((password as string).length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password as string, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = await signToken({ userId: user._id.toString(), name: user.name, email: user.email });

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[register] Error:', msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
