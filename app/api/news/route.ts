import { NextResponse } from 'next/server';
import { GetGNews } from '@/shared/external/gnews/gnews.api';

export async function GET() {
  const data = await GetGNews();
  return NextResponse.json(data);
}
