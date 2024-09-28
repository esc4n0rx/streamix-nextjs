// app/api/profiles/route.ts (POST)
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { user_id, profile_name, avatar_url, pin_code } = await req.json();

    const { data, error } = await supabase
      .from("account_profile")
      .insert({
        user_id,
        profile_name,
        avatar_url: avatar_url || '/img/default_avatar.png',
        pin_code: pin_code || null,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Perfil criado com sucesso!", profile: data });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar perfil." }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const user_id = searchParams.get("user_id");
  
      const { data, error } = await supabase
        .from("account_profile")
        .select("*")
        .eq("user_id", user_id);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json({ profiles: data });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao buscar perfis." }, { status: 500 });
    }
  }
