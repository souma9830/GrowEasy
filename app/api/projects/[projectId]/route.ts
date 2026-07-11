import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Project from '@/lib/db/models/Project';

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await context.params;
    await connectDB();
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await context.params;
    await connectDB();
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await context.params;
    const body = await request.json();
    const { total_imports, total_records, imported_records, skipped_records } = body;

    await connectDB();
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $inc: {
          total_imports: total_imports || 0,
          total_records: total_records || 0,
          imported_records: imported_records || 0,
          skipped_records: skipped_records || 0,
        }
      },
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update project stats' }, { status: 500 });
  }
}
