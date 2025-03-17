import prisma from "@/lib/prisma";

export default async function AtualizarPedido(req, res) {
  console.log("AtualizarPedido");
  let { usuario, produtos } = req.body;
  console.log(produtos)
  console.log("produtos")
  
  let pedidoAtual = await prisma.Pedidos.findFirst({
    where: {
      id_usuario: usuario.id,
    },
    orderBy: {
      id: "desc",
    },
  });
  console.log(pedidoAtual)
  console.log("pedidoAtual")
  return res.status(200).json(pedidoAtual);
}

