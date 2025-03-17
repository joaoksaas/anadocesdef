import prisma from "@/lib/prisma";

export default async function RemoverPedido(req, res) {
  console.log("RemoverPedido");
  let { id_pedido, id_usuario } = req.body;
  if (!id_pedido || !id_usuario) return res.status(400);
  const pedidoAtual = await prisma.Pedidos.findFirst({
    where: {
      id_usuario: id_usuario,
    },
    orderBy: {
      id: "desc",
    },
  });
  const novosItens = pedidoAtual.itens.filter((item) => {
    return item != id_pedido;
  });
  const pedidoAtualizado = await prisma.Pedidos.update({
    where: {
      id: pedidoAtual.id,
    },
    data: {
      itens: novosItens,
    },
  });
  return res.status(200).json(pedidoAtualizado);
}
