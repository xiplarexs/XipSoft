import { NextRequest, NextResponse } from 'next/server';
import { safeErrorResponse } from '@/lib/api-guard';
import { checkRateLimit, getEndpointRateLimit } from '@/lib/rate-limit';
import { getPublishedBlogPostsAction } from '@/app/_actions/blog-actions';

export async function gET(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
  
  const rateConfig = getEndpointRateLimit('/api/blog');
  const rateResult = await checkRateLimit(`ip:${ip}`, rateConfig);
  
  if (!rateResult.success) {
    const headers = new Headers({
      'X-RateLimit-Limit': String(rateResult.limit),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(rateResult.reset),
    });
    if (rateResult.retryAfter) {
      headers.set('Retry-After', String(Math.ceil(rateResult.retryAfter / 1000)));
    }
    return NextResponse.json(
      { error: 'Too Many Requests', message: rateConfig.message },
      { status: 429, headers }
    );
  }

  const pageSizeRaw = parseInt(request.nextUrl.searchParams.get('pageSize') || '10', 10);
  const pageSize = Math.min(isNaN(pageSizeRaw) ? 10 : pageSizeRaw, 50);
  const offsetRaw = parseInt(request.nextUrl.searchParams.get('offset') || '0', 10);
  const offset = isNaN(offsetRaw) ? 0 : Math.max(0, offsetRaw);

  let data: any;
  try {
    const result = await getPublishedBlogPostsAction(pageSize + 1, offset);
    data = result;
  } catch (err) {
    return safeErrorResponse(err, { userId: null, userRole: 'guest', userEmail: null, isAuthenticated: false });
  }

  const filteredData = data.data.filter((post: any) => {
    const contentText = extractTextFromContent(post.content);
    const totalLength = (post.title?.length || 0) + (post.description?.length || 0) + contentText.length;
    return totalLength >= 200;
  });

  const hasMore = filteredData.length > pageSize;
  const result = filteredData.slice(0, pageSize);
  const nextOffset = hasMore ? offset + pageSize : offset;

  const headers = new Headers({
    'X-RateLimit-Limit': String(rateResult.limit),
    'X-RateLimit-Remaining': String(rateResult.remaining),
    'X-RateLimit-Reset': String(rateResult.reset),
  });

  return NextResponse.json(
    {
      data: result,
      hasMore,
      nextOffset,
      count: result.length,
    },
    { headers }
  );
}

function extractTextFromContent(content: any): string {
  if (!content || !content.root) return '';
  const nodes = content.root.children || [];
  return nodes
    .map((node: any) => {
      if (node.type === 'text') return node.text || '';
      return '';
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}