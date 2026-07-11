import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ImportService } from '@/services/import.service';
import { Logger } from '@/lib/logger/logger';

const importRequestSchema = z.object({
  projectId: z.string(),
  rawRows: z.array(z.record(z.string(), z.string()))
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = importRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      Logger.warn("Invalid /api/import request payload");
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request payload", 
        details: parsed.error.format() 
      }, { status: 400 });
    }

    const { projectId, rawRows } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      Logger.error("GEMINI_API_KEY environment variable is not set");
      return NextResponse.json({ 
        success: false, 
        error: "Server configuration error: Gemini API key is missing" 
      }, { status: 500 });
    }

    // Process the import via the orchestrator service
    const importResult = await ImportService.processImport(projectId, rawRows, apiKey);

    return NextResponse.json({
      success: true,
      data: importResult
    });
    
  } catch (error: unknown) {
    Logger.error('API Error in /api/import:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }, { status: 500 });
  }
}
