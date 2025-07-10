import { NextResponse } from "next/server";

export function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /admin-login
Disallow: /admin-login/

Sitemap: https://xn--2n1b19ndwjhoj6sb.com/sitemap.xml
  `.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
