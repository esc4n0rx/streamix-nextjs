import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req: Request) {
  const { login, senha } = await req.json();

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("login", login)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Login ou senha incorretos" }, { status: 400 });
  }

  // Gerar o token JWT no servidor
  const token = jwt.sign({ userId: data.uuid }, 'streamix', { expiresIn: '1h' });

  return NextResponse.json({ token });
}
