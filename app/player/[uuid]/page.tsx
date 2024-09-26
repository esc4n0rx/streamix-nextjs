"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import './AmbilightPlayer.css';

type Conteudo = {
  uuid: string;
  nome: string;
  url_streaming: string;
  poster_url: string;
  sinopse: string;
  avaliacao: number;
};

export default function AmbilightPlayer({ params }: { params: { uuid: string } }) {
  const { uuid } = params; 
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [conteudo, setConteudo] = useState<Conteudo | null>(null);
  const [ambilightColors, setAmbilightColors] = useState({
    topColor: '#000',
    bottomColor: '#000',
    leftColor: '#000',
    rightColor: '#000',
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("conteudos")
        .select("*")
        .eq("uuid", uuid)
        .single();

      if (error) {
        console.error("Erro ao carregar conteúdo:", error);
      } else {
        setConteudo(data as Conteudo); 
      }
    };

    fetchContent();
  }, [uuid]);

  
  useEffect(() => {
    if (!conteudo || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 32;
    canvas.height = 18;

    let animationFrameId: number;

    const averageColor = (data: Uint8ClampedArray) => {
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      return `rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`;
    };

    const getEdgeColors = () => {
      if (video && video.readyState === video.HAVE_ENOUGH_DATA && context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const topData = context.getImageData(0, 0, canvas.width, 1).data;
        const bottomData = context.getImageData(0, canvas.height - 1, canvas.width, 1).data;
        const leftData = context.getImageData(0, 0, 1, canvas.height).data;
        const rightData = context.getImageData(canvas.width - 1, 0, 1, canvas.height).data;

        const topColor = averageColor(topData);
        const bottomColor = averageColor(bottomData);
        const leftColor = averageColor(leftData);
        const rightColor = averageColor(rightData);

        setAmbilightColors({ topColor, bottomColor, leftColor, rightColor });
      }
    };

    const updateAmbilight = () => {
      getEdgeColors();
      animationFrameId = requestAnimationFrame(updateAmbilight);
    };

    updateAmbilight();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [conteudo]);

  if (!conteudo) {
    return <div className="text-white text-center">Carregando...</div>;
  }

  
  const isLocalVideo = conteudo.url_streaming.includes("vids/");

  return (
    <div
      className="ambilight-container"
      style={{
        background: `
          radial-gradient(circle at top left, ${ambilightColors.topColor}, transparent),
          radial-gradient(circle at top right, ${ambilightColors.rightColor}, transparent),
          radial-gradient(circle at bottom left, ${ambilightColors.leftColor}, transparent),
          radial-gradient(circle at bottom right, ${ambilightColors.bottomColor}, transparent)
        `,
      }}
    >
      <div className="player-card">
        <video ref={videoRef} controls autoPlay loop className="video-player">
          <source
            src={isLocalVideo ? `/vids/${conteudo.url_streaming.split('/').pop()}` : conteudo.url_streaming}
            type="video/mp4"
          />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>
    </div>
  );
}
