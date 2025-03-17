import prisma from "@/lib/prisma";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, otp } = req.body;
    console.log('Email recebido:', email); // Log para verificar o email recebido

    try {
      // Verificar se o usuário existe no banco de dados
      const user = await prisma.usuarios.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado.' });
      }

      // Verificar se o OTP está correto
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Código OTP incorreto.' });
      }

      // Verificar se o OTP não expirou
      const expirationTime = new Date(user.otpExpires); 
      if (Date.now() > expirationTime) {
        // Limpar o OTP expirado do banco de dados
        await prisma.usuarios.update({
          where: { email },
          data: { otp: null, otpExpires: null },
        });

        return res.status(400).json({ message: 'Código OTP expirou.' });
      }

      // Limpar o OTP após a verificação bem-sucedida
      await prisma.usuarios.update({
        where: { email },
        data: { otp: null, otpExpires: null },
      });

      return res.status(200).json({ message: 'OTP verificado com sucesso!', success: true });
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      res.status(500).json({ message: 'Erro ao verificar OTP.', error: error.toString() });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
