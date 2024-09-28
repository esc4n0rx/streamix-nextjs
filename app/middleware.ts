import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const selectedProfile = req.cookies.get('selected_profile');

  if (!token) {
    // Se não houver token, redireciona para login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!selectedProfile) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }
  
  try {
    // Verifica se o token JWT é válido
    jwt.verify(token, 'streamix');
  } catch (error) {
    // Token inválido ou expirado, redireciona para login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se o token for válido, segue para a página de perfil
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/player/:path*', '/profile/:path*'],
};
