"use client"; 

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";


type Conteudo = {
  uuid: string;
  nome: string;
  categoria: string;
  sinopse: string;
  avaliacao: number;
  url_streaming: string;
  poster_url: string;
};

export default function ConfiguracaoPage() {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]); 
  const [newContent, setNewContent] = useState({
    nome: "",
    categoria: "",
    sinopse: "",
    avaliacao: 0,
    url_streaming: "",
    poster_url: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingUuid, setEditingUuid] = useState<string | null>(null); 

  
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

  const saveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
     
      const { error } = await supabase
        .from("conteudos")
        .update(newContent)
        .eq("uuid", editingUuid);
      if (!error) {
        const updatedContents = conteudos.map((content) =>
          content.uuid === editingUuid ? { ...content, ...newContent } : content
        );
        setConteudos(updatedContents);
        setIsEditing(false);
        setEditingUuid(null);
      }
    } else {
    
      const { error } = await supabase.from("conteudos").insert([newContent]);
      if (!error) {
        setConteudos([...conteudos, newContent]);
      }
    }

    setNewContent({
      nome: "",
      categoria: "",
      sinopse: "",
      avaliacao: 0,
      url_streaming: "",
      poster_url: "",
    });
  };

 
  const removeContent = async (uuid: string) => {
    const { error } = await supabase.from("conteudos").delete().eq("uuid", uuid);
    if (!error) {
      setConteudos(conteudos.filter((conteudo) => conteudo.uuid !== uuid));
    }
  };

  const editContent = (conteudo: Conteudo) => {
    setIsEditing(true);
    setEditingUuid(conteudo.uuid);
    setNewContent({
      nome: conteudo.nome,
      categoria: conteudo.categoria,
      sinopse: conteudo.sinopse,
      avaliacao: conteudo.avaliacao,
      url_streaming: conteudo.url_streaming,
      poster_url: conteudo.poster_url,
    });
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">
        {isEditing ? "Editar Conteúdo" : "Adicionar Novo Conteúdo"}
      </h1>
      <form onSubmit={saveContent} className="mb-8">
        <div className="mb-4">
          <label className="block mb-2">Nome</label>
          <input
            type="text"
            value={newContent.nome}
            onChange={(e) => setNewContent({ ...newContent, nome: e.target.value })}
            className="p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Categoria</label>
          <input
            type="text"
            value={newContent.categoria}
            onChange={(e) => setNewContent({ ...newContent, categoria: e.target.value })}
            className="p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Sinopse</label>
          <textarea
            value={newContent.sinopse}
            onChange={(e) => setNewContent({ ...newContent, sinopse: e.target.value })}
            className="p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Avaliação</label>
          <input
            type="number"
            value={newContent.avaliacao}
            onChange={(e) => setNewContent({ ...newContent, avaliacao: Number(e.target.value) })}
            className="p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">URL de Streaming</label>
          <input
            type="text"
            value={newContent.url_streaming}
            onChange={(e) => setNewContent({ ...newContent, url_streaming: e.target.value })}
            className="p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">URL do Poster</label>
          <input
            type="text"
            value={newContent.poster_url}
            onChange={(e) => setNewContent({ ...newContent, poster_url: e.target.value })}
            className="p-2 bg-gray-800 rounded w-full"
          />
        </div>

        <button className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-800" type="submit">
          {isEditing ? "Salvar Alterações" : "Adicionar Conteúdo"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {conteudos.map((conteudo) => (
          <div key={conteudo.uuid} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">{conteudo.nome}</h3>
            <p className="text-sm text-gray-400">Categoria: {conteudo.categoria}</p>
            <button
              onClick={() => editContent(conteudo)}
              className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-800 mt-2"
            >
              Editar
            </button>
            <button
              onClick={() => removeContent(conteudo.uuid)}
              className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-800 mt-2 ml-2"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
