import prisma from "@/lib/prisma";

export default async function AdicionarPedidoAoCarrinho(req, res) {
  console.log("AdicionarPedidoAoCarrinho");
  const { email, id_item_pedido } = req.body;
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

  let newItens = [id_item_pedido];
  if(!!pedidoAtual?.itens) newItens.push(...pedidoAtual.itens)
  console.log(newItens);
  console.log("newItens");

  const atualizarPedido = await prisma.Pedidos.update({
    where: {
      id: pedidoAtual.id,
    },
    data: {
      itens: newItens,
    },
  });
  console.log(atualizarPedido);
  console.log("atualizarPedido");
  return res.status(200).json(atualizarPedido);
}