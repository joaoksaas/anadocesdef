import nodemailer from 'nodemailer';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { avisoErro } from '@/components/Aviso';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    // Gerar OTP aleatório de 4 dígitos
    const otp = crypto.randomInt(1000, 9999).toString();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000); 

    try {
      // Salvar o OTP no banco de dados para o usuário correspondente
      const user = await prisma.usuarios.update({
        where: { email },
        data: { otp,
          otpExpires: expirationTime,
         },
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      // Configurar Nodemailer para enviar email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Seu código de recuperação de senha',
        text: `Seu código de recuperação de senha é: ${otp}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Email enviado com sucesso!', success: true });
    } catch (error) {
      console.error('Erro ao enviar email ou atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao enviar email.', error: error.toString() });
      avisoErro("Erro ao enviar email.")
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
