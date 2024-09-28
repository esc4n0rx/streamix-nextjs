"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, senha }),
      });

      if (!response.ok) {
        throw new Error("Login ou senha incorretos");
      }

      const { token } = await response.json();

      Cookies.set('token', token, { expires: 1, secure: true });
      console.log("Token armazenado com sucesso:", token);

      router.push("/profile");
      console.log("Redirecionando para a página de perfil...");
    } catch (err) {
    
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido");
      }
      console.error("Erro ao fazer login:", err);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("https://ucare.timepad.ru/ba19db85-233a-4e4c-867e-fd06d35b3a8d/poster_event_686269.jpg")`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-black bg-opacity-50 p-8 rounded-lg shadow-md w-full max-w-md backdrop-blur-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-500">Login</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-300 bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Insira seu login"
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
            placeholder="Insira sua senha"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Entrar
        </button>

        <p className="text-center mt-4 text-gray-400">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-purple-500 underline">
            Crie uma agora
          </Link>
        </p>
      </form>
    </div>
  );
}
