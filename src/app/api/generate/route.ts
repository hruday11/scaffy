import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockGenerateStructure } from '@/lib/mockGenerator';

const requestSchema = z.object({
  prompt: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = requestSchema.parse(body);

    // Use mock generator instead of OpenAI
    const structure = mockGenerateStructure(prompt);

    return NextResponse.json({ structure });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    
    console.error('Error generating backend structure:', error);
    return NextResponse.json(
      { error: 'Failed to generate backend structure' },
      { status: 500 }
    );
  }
} 