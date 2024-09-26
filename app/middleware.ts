import { NextResponse } from 'next/server';
import { supabase } from './lib/supabaseClient';

// Middleware para verificar a sessão
export async function middleware(req: any) {
  const res = NextResponse.next();

  const supabaseToken = req.cookies.get('sb-access-token')?.value;

  if (!supabaseToken) {
    // Redireciona para a página de login se não houver token
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Rotas protegidas que precisam de login
export const config = {
  matcher: ['/dashboard/:path*', '/player/:path*'], // Adicione outras rotas que precisam de proteção
};
