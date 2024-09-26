import { supabase } from '../lib/supabaseClient';
import { redirect } from 'next/navigation';

export default async function Home() {
  // Verifica se há uma sessão ativa
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não houver sessão, redireciona para a página de login
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Bem-vindo ao sistema Streamix</h1>
    </div>
  );
}
