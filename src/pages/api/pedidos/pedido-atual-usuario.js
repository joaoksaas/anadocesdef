import prisma from "@/lib/prisma";

export default async function PedidoAtualPorEmailUsuario(req, res) {
  console.log("PedidoAtualPorEmailUsuario");
  const { email } = req.body;
  const usuario = await prisma.Usuarios.findFirst({
    where: {
      email: email,
    },
  });
  const pedidoAtual = await prisma.Pedidos.findFirst({
    where: {
      id_usuario: usuario.id,
    },
    orderBy: {
      id: "desc",
    },
  });
  console.log(pedidoAtual);
  console.log("pedidoAtual");
  return res.status(200).json(pedidoAtual);
}
