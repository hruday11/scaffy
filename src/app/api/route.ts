import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('Root webhook received');
  const payload = await req.json();
  console.log('Root webhook payload:', JSON.stringify(payload, null, 2));
  
  return NextResponse.json({ message: 'Please use /api/webhook/clerk endpoint' }, { status: 200 });
} 