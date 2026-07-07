import { NextResponse } from 'next/server';
import { z } from 'zod';
import { MappingService, AIProviderType } from '@/services/mapping.service';
import { TARGET_CRM_SCHEMA } from '@/core/constants/crm';

// Validation schema for incoming request
const mapRequestSchema = z.object({
  headers: z.array(z.string()).min(1, "At least one header is required"),
  sampleRows: z.array(z.record(z.string())).max(10, "Max 10 sample rows allowed"),
  provider: z.enum(['mock', 'gemini', 'anthropic']).default('mock'),
  apiKey: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = mapRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid request payload", 
        details: parsed.error.format() 
      }, { status: 400 });
    }

    const { headers, sampleRows, provider, apiKey } = parsed.data;

    const mappings = await MappingService.mapHeadersToSchema(
      provider as AIProviderType,
      apiKey,
      headers,
      sampleRows,
      TARGET_CRM_SCHEMA
    );

    return NextResponse.json({
      success: true,
      data: mappings
    });
    
  } catch (error: any) {
    console.error('API Error in /api/map:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
