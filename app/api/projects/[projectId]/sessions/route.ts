import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ImportSession from '@/lib/db/models/ImportSession';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await context.params;

    if (!projectId) {
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    await connectDB();

    // Support both ObjectId and string formats in the stored field
    const query = mongoose.isValidObjectId(projectId)
      ? { projectId: new mongoose.Types.ObjectId(projectId) }
      : { projectId };

    const sessions = await ImportSession.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[sessions route] Error:', msg);
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
