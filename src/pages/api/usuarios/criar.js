import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { pegarDataAtual } from "@/utils/functions";

export default async function CriarUsuario(req, res) {
  try {
    let { nome, email, cargo, senha, cpf, telefone } = req.body;
    nome = nome.toLowerCase();

    // Hash da senha
    const saltRounds = 10; // Nível de segurança do hash
    const hashedPassword = await bcrypt.hash(senha, saltRounds);

    const usuarioExistenteEmail = await prisma.Usuarios.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (usuarioExistenteEmail) {
      return res
        .status(400)
        .json({ mensagem: "Este email já está em uso. Tente outro." });
    }

    const usuarioExistenteCPF = await prisma.Usuarios.findUnique({
      where: { cpf: cpf },
    });

    if (usuarioExistenteCPF) {
      return res.status(400).json({ mensagem: "Este CPF já está em uso." });
    }

    // Tentativa de criação do usuário
    const usuario = await prisma.Usuarios.create({
      data: {
        nome,
        email: email.toLowerCase(),
        cargo,
        senha: hashedPassword,
        cpf,
        telefone,
      },
    });
    // Criação do pedido vinculado ao usuário criado
    const Pedido = await prisma.Pedidos.create({
      data: {
        dataPedido: pegarDataAtual(),
        dataFinalPedido: "",
        status: "PENDENTE",
        id_usuario: usuario.id,
        itens: [],
      },
    });
    // Retorna a resposta ao cliente
    return res.status(201).json(usuario);
  } catch (error) {
    console.error("Erro ao criar usuário e pedido:", error);
    return res
      .status(500)
      .json({ mensagem: "Erro no servidor ao criar usuário." });
  }
}
