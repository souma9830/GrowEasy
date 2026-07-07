import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ImportService } from '@/services/import.service';
import { TARGET_CRM_SCHEMA } from '@/core/constants/crm';

const importRequestSchema = z.object({
  rawRows: z.array(z.record(z.string())),
  mappings: z.array(z.object({
    crmFieldKey: z.string(),
    csvHeader: z.string().nullable()
  }))
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = importRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request payload", 
        details: parsed.error.format() 
      }, { status: 400 });
    }

    const { rawRows, mappings } = parsed.data;

    // Process the import via the orchestrator service
    const importResult = await ImportService.processImport(
      rawRows,
      mappings,
      TARGET_CRM_SCHEMA
    );

    return NextResponse.json({
      success: true,
      data: importResult
    });
    
  } catch (error: any) {
    console.error('API Error in /api/import:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
