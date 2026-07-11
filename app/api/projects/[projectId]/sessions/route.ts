import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ImportSession from '@/lib/db/models/ImportSession';

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await context.params;
    await connectDB();
    const sessions = await ImportSession.find({ projectId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sessions });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
