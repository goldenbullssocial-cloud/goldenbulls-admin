import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'resource.pdf';

  if (!url) {
    return new Response('URL is required', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch file');

    const data = await response.blob();
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return new Response('Failed to download file', { status: 500 });
  }
}
