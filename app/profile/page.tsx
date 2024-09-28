"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { supabase } from "../../lib/supabaseClient";

// Definir a estrutura esperada do payload JWT
interface DecodedToken {
  userId: string;
  exp?: number;
}

export default function ProfileSelectionPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [newProfileName, setNewProfileName] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setSessionError("Token de autenticação não encontrado!");
        router.push("/login");
        return;
      }

      try {
        const decoded = jwt.decode(token) as DecodedToken;
        const userId = decoded?.userId;

        if (!userId) {
          throw new Error("ID de usuário não encontrado no token.");
        }

        const response = await fetch(`/api/profiles?user_id=${userId}`);
        const { profiles, error } = await response.json();

        if (error) {
          console.error("Erro ao buscar perfis:", error);
          setSessionError("Erro ao buscar perfis!");
          return;
        }

        setProfiles(profiles);
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        setSessionError("Token inválido!");
        router.push("/login");
      }
    };

    fetchProfiles();
  }, [router]);

  const handleEditProfile = (profile: any) => {
    setIsEditing(true);
    setEditingProfile(profile);
    setNewProfileName(profile.profile_name);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/profiles/${editingProfile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_name: newProfileName,
        }),
      });

      const data = await response.json();
      if (data.error) {
        console.error("Erro ao atualizar perfil:", data.error);
        return;
      }

      setProfiles(
        profiles.map((p) =>
          p.id === editingProfile.id ? { ...p, profile_name: newProfileName } : p
        )
      );
      setIsEditing(false);
      setEditingProfile(null);
      setNewProfileName("");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.error) {
        console.error("Erro ao excluir perfil:", data.error);
        return;
      }

      setProfiles(profiles.filter((profile) => profile.id !== profileId));
    } catch (error) {
      console.error("Erro ao excluir perfil:", error);
    }
  };

  const handleAddProfile = async () => {
    try {
      const token = Cookies.get("token");
      const decoded = jwt.decode(token) as DecodedToken;
      const userId = decoded?.userId;

      if (!userId) {
        throw new Error("ID de usuário não encontrado no token.");
      }

      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          profile_name: newProfileName,
        }),
      });

      const data = await response.json();
      if (data.error) {
        console.error("Erro ao adicionar perfil:", data.error);
        return;
      }

      const newProfile = Array.isArray(data.profile)
        ? data.profile[0]
        : data.profile;

      setProfiles([...profiles, newProfile]);
      setNewProfileName("");
    } catch (error) {
      console.error("Erro ao adicionar perfil:", error);
    }
  };

  const handleSelectProfile = async (profileId: number) => {
    try {
      Cookies.set("selected_profile", profileId.toString(), { expires: 1, path: "/" });
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao selecionar o perfil:", error);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url("https://ucare.timepad.ru/ba19db85-233a-4e4c-867e-fd06d35b3a8d/poster_event_686269.jpg")`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-lg"></div>

      <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded-lg shadow-md w-full max-w-2xl backdrop-blur-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Selecione um Perfil
        </h1>
        {sessionError && <p className="text-red-500">{sessionError}</p>}

        <div className="grid grid-cols-2 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="p-4 bg-gray-800 rounded-lg cursor-pointer relative"
              onClick={() => handleSelectProfile(profile.id)}
            >
              <img
                src={profile.avatar_url || "/default_avatar.png"}
                alt={profile.profile_name}
                className="w-24 h-24 rounded-full mb-2 mx-auto"
              />
              <h2 className="text-white">{profile.profile_name}</h2>

              <div className="flex justify-center mt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-2 rounded mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProfile(profile);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white text-sm py-1 px-2 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProfile(profile.id);
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          {isEditing ? (
            <div>
              <input
                type="text"
                className="p-2 rounded bg-gray-700 text-white"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Nome do perfil"
              />
              <button
                className="bg-purple-600 hover:bg-purple-800 text-white py-2 px-4 rounded ml-2"
                onClick={handleSaveEdit}
              >
                Salvar
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded ml-2"
                onClick={() => {
                  setIsEditing(false);
                  setEditingProfile(null);
                  setNewProfileName("");
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                className="p-2 rounded bg-gray-700 text-white"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Nome do novo perfil"
              />
              <button
                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded ml-2"
                onClick={handleAddProfile}
              >
                Adicionar Perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
