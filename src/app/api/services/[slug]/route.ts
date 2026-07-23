import { NextResponse } from 'next/server';
import { getServiceBySlug } from '@/data/services';

export async function gET(request: Request, context: any) {
  const params = await context?.params;
  const { slug } = params || {};
  if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  const data = getServiceBySlug(slug);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
