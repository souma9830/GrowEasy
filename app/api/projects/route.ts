import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Project from '@/lib/db/models/Project';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const projects = await Project.find({ userId: user.userId }).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { project_name, description } = body;

    if (!project_name) {
      return NextResponse.json({ success: false, error: 'Project name is required' }, { status: 400 });
    }

    await connectDB();
    const project = await Project.create({ userId: user.userId, project_name, description });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
