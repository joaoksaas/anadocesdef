import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";

export default async function ValidarLogin(req, res) {
    console.log("Validar Login");
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo email
        const usuario = await prisma.usuarios.findFirst({
            where: { email: email.toLowerCase() }
        });

        if (!usuario) {
            // Usuário não encontrado
            return res.status(401).send(false);
        }

        // Compara a senha fornecida com o hash no banco de dados
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (senhaValida) {
            // Senha correta, login bem-sucedido
            return res.status(200).send(true);
        } else {
            // Senha incorreta
            return res.status(401).send(false);
        }
    } catch (error) {
        console.error("Erro na validação do login:", error);
        return res.status(500).json({ message: "Erro no servidor" });
    }
}
