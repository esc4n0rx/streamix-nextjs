"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import Image from 'next/image';

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
  const [conteudos, setConteudos] = useState<Conteudo[]>([]); 
  const [selectedContent, setSelectedContent] = useState<Conteudo | null>(null); 

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
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url('https://ucare.timepad.ru/ba19db85-233a-4e4c-867e-fd06d35b3a8d/poster_event_686269.jpg')`,
      }}
    >
      
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg z-0"></div>

     
      <div className="relative z-10 p-4 sm:p-8">
        
        <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-center bg-black bg-opacity-80 py-4">
          <ul className="flex space-x-2 sm:space-x-6">
            <li><a href="#" className="text-purple-500 hover:text-white">Filmes</a></li>
            <li><a href="#" className="text-purple-500 hover:text-white">Séries</a></li>
            <li><a href="#" className="text-purple-500 hover:text-white">Novelas</a></li>
            <li><a href="#" className="text-purple-500 hover:text-white">Animes</a></li>
            <li><a href="#" className="text-purple-500 hover:text-white">Solicitar Conteúdos</a></li>
          </ul>
        </nav>

        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Novidades</h2>
          <div className="relative w-full h-56 sm:h-96 overflow-hidden">
            <div className="absolute w-full h-full flex animate-slideShow space-x-4 sm:space-x-6">
              {conteudos.slice(0, 5).map((conteudo) => (
                <div
                  key={conteudo.uuid}
                  className="w-2/5 sm:w-1/5 flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedContent(conteudo)}
                >
                  <Image
                    src={conteudo.poster_url}
                    alt={conteudo.nome}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seções de conteúdo */}
        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Filmes e Séries</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {conteudos
              .filter((conteudo) => conteudo.categoria === "Filme" || conteudo.categoria === "Serie")
              .map((conteudo) => (
                <div
                  key={conteudo.uuid}
                  className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg cursor-pointer"
                  onClick={() => setSelectedContent(conteudo)}
                >
                  <Image
                    src={conteudo.poster_url}
                    alt={conteudo.nome}
                    width={500}
                    height={300}
                    className="w-full h-32 sm:h-64 object-cover rounded-lg mb-2 sm:mb-4"
                  />
                  <h3 className="text-sm sm:text-lg font-semibold">{conteudo.nome}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Avaliação: {conteudo.avaliacao}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Em Alta</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {conteudos
              .filter((conteudo) => conteudo.avaliacao >= 8.5)
              .map((conteudo) => (
                <div
                  key={conteudo.uuid}
                  className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg cursor-pointer"
                  onClick={() => setSelectedContent(conteudo)}
                >
                  <Image
                    src={conteudo.poster_url}
                    alt={conteudo.nome}
                    width={500}
                    height={300}
                    className="w-full h-32 sm:h-64 object-cover rounded-lg mb-2 sm:mb-4"
                  />
                  <h3 className="text-sm sm:text-lg font-semibold">{conteudo.nome}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Avaliação: {conteudo.avaliacao}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-2xl font-bold mb-4">Recentemente Adicionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {conteudos
              .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
              .map((conteudo) => (
                <div
                  key={conteudo.uuid}
                  className="bg-gray-800 p-2 sm:p-4 rounded-lg shadow-lg cursor-pointer"
                  onClick={() => setSelectedContent(conteudo)}
                >
                  <Image
                    src={conteudo.poster_url}
                    alt={conteudo.nome}
                    width={500}
                    height={300}
                    className="w-full h-32 sm:h-64 object-cover rounded-lg mb-2 sm:mb-4"
                  />
                  <h3 className="text-sm sm:text-lg font-semibold">{conteudo.nome}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Avaliação: {conteudo.avaliacao}</p>
                </div>
              ))}
          </div>
        </div>

       
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
            <div className="bg-gray-900 p-4 sm:p-8 rounded-lg max-w-xs sm:max-w-md mx-auto text-center">
              <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">{selectedContent.nome}</h2>
              <p className="mb-2 sm:mb-4">{selectedContent.sinopse}</p>
              <p className="mb-2 sm:mb-4">Avaliação: {selectedContent.avaliacao}</p>
              <a
                href={`/player/${selectedContent.uuid}`}
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-800"
              >
                Assistir
              </a>
              <button
                onClick={closePopup}
                className="mt-4 text-gray-300 underline"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
