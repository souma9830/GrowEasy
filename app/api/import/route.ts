import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ImportService } from '@/services/import.service';
import { Logger } from '@/lib/logger/logger';

// Updated validation schema for incoming request
const importRequestSchema = z.object({
  rawRows: z.array(z.record(z.string(), z.string())),
  apiKey: z.string().min(1, "API Key is required for AI extraction")
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

    const { rawRows, apiKey } = parsed.data;

    // Process the import via the orchestrator service
    const importResult = await ImportService.processImport(rawRows, apiKey);

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
