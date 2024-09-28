import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const nome = formData.get('nome');
    const tipoConteudo = formData.get('tipoConteudo');
    const nomeConteudo = formData.get('nomeConteudo');
    const plataforma = formData.get('plataforma');
    const imdbId = formData.get('imdbId');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: 'itaduro@proton.me',
      subject: 'Solicitação de Conteúdo',
      text: `
        Nome: ${nome}
        Tipo de Conteúdo: ${tipoConteudo}
        Nome do Conteúdo: ${nomeConteudo}
        Plataforma: ${plataforma}
        ID do IMDB: ${imdbId ? imdbId : 'Não fornecido'}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Solicitação enviada com sucesso!', success: true });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ message: 'Erro ao enviar email', success: false }, { status: 500 });
  }
}
