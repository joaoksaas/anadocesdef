import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";
import { avisoSucesso } from '@/components/Aviso';

export default async function AtualizarSenha(req, res) {
    const { email, senhaNova } = req.body;
    try {
        // Gera o hash da nova senha
        const novaSenhaHash = await bcrypt.hash(senhaNova, 10);
        // Atualiza a senha no banco de dados
        await prisma.usuarios.update({
            where: { email: email.toLowerCase() },
            data: { senha: novaSenhaHash }
        });
        return res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar a senha:", error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}
