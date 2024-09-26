"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se o login já existe
    const { data: existingUser } = await supabase
      .from("usuarios")
      .select("*")
      .eq("login", login)
      .single();

    if (existingUser) {
      setError("Esse login já existe. Escolha outro.");
      return;
    }

    // Cria o novo usuário
    const { error } = await supabase.from("usuarios").insert([
      {
        login,
        senha,
        email,
        data_criacao: new Date(),
      },
    ]);

    if (error) {
      console.error("Erro ao registrar:", error);
      setError("Erro ao criar conta. Tente novamente.");
      return;
    }

    // Redireciona para a página de login
    router.push("/login");
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("https://ucare.timepad.ru/ba19db85-233a-4e4c-867e-fd06d35b3a8d/poster_event_686269.jpg")`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Layer de escurecimento */}

      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-black bg-opacity-50 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">Criar Conta</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Escolha um login"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Insira seu email"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Escolha uma senha"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Criar Conta
        </button>
      </form>
    </div>
  );
}
