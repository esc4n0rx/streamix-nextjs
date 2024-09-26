import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) { 
    const res = NextResponse.next();
  
    const supabaseToken = req.cookies.get('sb-access-token')?.value;
  
    if (!supabaseToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    return res;
  }


export const config = {
  matcher: ['/dashboard/:path*', '/player/:path*'], 
};
