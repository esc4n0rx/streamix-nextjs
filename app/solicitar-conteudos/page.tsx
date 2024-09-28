"use client"; 

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SolicitarConteudosPage() {
  const [formData, setFormData] = useState({
    nome: '',
    tipoConteudo: 'filme',
    nomeConteudo: '',
    plataforma: 'streaming',
    temImdb: 'nao',
    imdbId: '',
  });

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        body: new URLSearchParams(formData),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/dashboard');
      } else {
        alert('Erro ao enviar a solicitação');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center relative" style={{ backgroundImage: 'url("https://ucare.timepad.ru/ba19db85-233a-4e4c-867e-fd06d35b3a8d/poster_event_686269.jpg")' }}>
     
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>
    
      <form onSubmit={handleSubmit} className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full z-10 backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Solicitar Conteúdo</h2>
        
        <label className="block mb-2">Nome:</label>
        <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white" />

        <label className="block mb-2">Tipo de Conteúdo:</label>
        <select name="tipoConteudo" value={formData.tipoConteudo} onChange={handleInputChange} required className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white">
          <option value="filme">Filme</option>
          <option value="serie">Série</option>
          <option value="novela">Novela</option>
          <option value="anime">Anime</option>
        </select>

        <label className="block mb-2">Nome do Conteúdo:</label>
        <input type="text" name="nomeConteudo" value={formData.nomeConteudo} onChange={handleInputChange} required className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white" />

        <label className="block mb-2">Plataforma:</label>
        <select name="plataforma" value={formData.plataforma} onChange={handleInputChange} required className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white">
          <option value="streaming">Streaming</option>
          <option value="cinema">Cinema</option>
          <option value="nao-sei">Não sei</option>
        </select>

        <label className="block mb-2">Tem o ID do IMDB?</label>
        <div className="flex mb-4">
          <label className="mr-4">
            <input type="radio" name="temImdb" value="sim" checked={formData.temImdb === 'sim'} onChange={handleInputChange} />
            Sim
          </label>
          <label>
            <input type="radio" name="temImdb" value="nao" checked={formData.temImdb === 'nao'} onChange={handleInputChange} />
            Não
          </label>
        </div>

        {formData.temImdb === 'sim' && (
          <div>
            <label className="block mb-2">ID do IMDB:</label>
            <input type="text" name="imdbId" value={formData.imdbId} onChange={handleInputChange} className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white" />
          </div>
        )}

        <button type="submit" className="w-full bg-purple-600 py-3 rounded-lg text-white hover:bg-purple-800">Enviar</button>
      </form>
    </div>
  );
}
