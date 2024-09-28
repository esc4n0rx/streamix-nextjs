"use client";

import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import './Banner.css';

type Conteudo = {
  uuid: string;
  nome: string;
  categoria: string;
  sinopse: string;
  avaliacao: number;
  url_streaming: string;
  poster_url: string;
  data_criacao: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [selectedContent, setSelectedContent] = useState<Conteudo | null>(null);
  
  useEffect(() => {
    const selectedProfile = Cookies.get("selected_profile");

    if (!selectedProfile) {
      router.push("/profile");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };


  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("conteudos").select("*");
      if (error) {
        console.error("Erro ao buscar conteúdos:", error);
      } else if (data) {
        setConteudos(data as Conteudo[]);
      }
    };
    fetchData();
  }, []);

  const closePopup = () => setSelectedContent(null);

  return (
    <div className="main-content">
     
      <div className="background-blur"></div>

      <div className="relative min-h-screen">
       
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4  bg-opacity-80 z-50">
          <div className="flex items-center space-x-4">
            <img src="/img/logo.png" alt="Streamix Logo" width={100} height={40} />
            <nav className="flex space-x-6">
              <a href="#" className="text-lg font-semibold hover:text-gray-300">Início</a>
              <a href="#" className="text-lg font-semibold hover:text-gray-300">Séries</a>
              <a href="#" className="text-lg font-semibold hover:text-gray-300">Filmes</a>
              <a href="#" className="text-lg font-semibold hover:text-gray-300">Animes</a>
              <Link href="/solicitar-conteudos" className="text-lg font-semibold hover:text-gray-300">
                Solicitar Conteúdos
              </Link>
            </nav>
          </div>
          <div>
            <a href="#" className="text-lg hover:text-gray-300">
              <img src="/img/profile.png" alt="Profile" width={40} height={40} />
            </a>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        
        <div className="relative mt-20 mx-auto max-w-full p-4 banner-container">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-[300px] carousel-container">
              <div className="carousel flex items-center">
                {conteudos.map((conteudo, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center w-[200px]"
                    onClick={() => setSelectedContent(conteudo)}
                  >
                    <img
                      src={conteudo.poster_url}
                      alt={conteudo.nome}
                      className="h-[180px] w-[140px] object-cover rounded-lg"
                    />
                    <h2 className="text-lg font-bold mt-2">{conteudo.nome}</h2>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

       
        <div className="mt-12 px-4 sm:px-8">
          <h2 className="text-2xl font-bold mb-4">Recomendado para você</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 grid-container">
            {conteudos
              .filter((conteudo) => conteudo.avaliacao >= 7.5)
              .map((conteudo) => (
                <div
                  key={conteudo.uuid}
                  className="relative rounded-lg shadow-lg overflow-hidden card-content cursor-pointer"
                  onClick={() => setSelectedContent(conteudo)}
                >
                  <img
                    src={conteudo.poster_url}
                    alt={conteudo.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 w-full  bg-opacity-60 text-white p-2 text-center text-sm sm:text-lg font-semibold card-overlay">
                    {conteudo.nome}
                  </div>
                </div>
              ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8">Continue Assistindo</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 grid-container">
            {conteudos.slice(0, 8).map((conteudo) => (
              <div
                key={conteudo.uuid}
                className="relative rounded-lg shadow-lg overflow-hidden card-content cursor-pointer"
                onClick={() => setSelectedContent(conteudo)}
              >
                <img
                  src={conteudo.poster_url}
                  alt={conteudo.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 w-full  bg-opacity-60 text-white p-2 text-center text-sm sm:text-lg font-semibold card-overlay">
                  {conteudo.nome}
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8">Novidades</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 grid-container">
            {conteudos
              .sort(
                (a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
              )
              .map((conteudo) => (
                <div
                  key={conteudo.uuid}
                  className="relative rounded-lg shadow-lg overflow-hidden card-content cursor-pointer"
                  onClick={() => setSelectedContent(conteudo)}
                >
                  <img
                    src={conteudo.poster_url}
                    alt={conteudo.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 w-full  bg-opacity-60 text-white p-2 text-center text-sm sm:text-lg font-semibold card-overlay">
                    {conteudo.nome}
                  </div>
                </div>
              ))}
          </div>
        </div>

       
        {selectedContent && (
          <div className="fixed inset-0  bg-opacity-60 flex justify-center items-center z-40">
            <div className="bg-gray-900 p-6 rounded-lg max-w-xs sm:max-w-lg mx-auto text-center relative shadow-2xl">
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                X 
              </button>
              <img
                src={selectedContent.poster_url}
                alt={selectedContent.nome}
                className="mx-auto rounded-lg w-32 h-48 object-cover mb-4"
              />
              <h2 className="text-2xl font-bold mb-4">{selectedContent.nome}</h2>
              <p className="text-sm mb-4">{selectedContent.sinopse}</p>
              <div className="flex justify-around mb-4">
                <button className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600">Favoritar</button>
                <button className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600">Adicionar à Lista</button>
                <button className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600">Criar Grupo</button>
              </div>
              <a
                href={`/player/${selectedContent.uuid}`}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-800 block mb-4"
              >
                Assistir Agora
              </a>
              <a
                href={`/download/${selectedContent.uuid}`}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 block"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
