/**
 * GET /api/health
 * Check API and LLM service health
 */

import { NextRequest, NextResponse } from 'next/server';
import { HealthResponse } from '@/app/lib/types/news';
import { checkLLMHealth } from '@/app/lib/llm/newsClient';
import { createSuccessResponse } from '@/app/lib/newsUtils';

export async function GET(request: NextRequest) {
  try {
    // Check LLM service
    const llmHealthy = await checkLLMHealth();

    const health: HealthResponse = {
      status: llmHealthy ? 'healthy' : 'degraded',
      services: {
        api: 'ok',
        llm: llmHealthy ? 'ok' : 'error',
        parser: 'ok',
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(createSuccessResponse(health), { status: 200 });
  } catch (error) {
    const health: HealthResponse = {
      status: 'unhealthy',
      services: {
        api: 'ok',
        llm: 'error',
        parser: 'ok',
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(createSuccessResponse(health), { status: 200 });
  }
}
