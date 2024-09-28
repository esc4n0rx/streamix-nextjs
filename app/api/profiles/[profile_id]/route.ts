// app/api/profiles/[profile_id]/route.ts (PUT)
import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function PUT(req: Request, { params }: any) {
  try {
    const profile_id = params.profile_id;
    const { profile_name, avatar_url, pin_code } = await req.json();

    const { data, error } = await supabase
      .from("account_profile")
      .update({
        profile_name,
        avatar_url: avatar_url || 'default_avatar.png',
        pin_code: pin_code || null,
      })
      .eq("id", profile_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Perfil atualizado com sucesso!", profile: data });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar perfil." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: any) {
    try {
      const profile_id = params.profile_id;
  
      const { error } = await supabase
        .from("account_profile")
        .delete()
        .eq("id", profile_id);
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json({ message: "Perfil removido com sucesso!" });
    } catch (error) {
      return NextResponse.json({ error: "Erro ao remover perfil." }, { status: 500 });
    }
  }