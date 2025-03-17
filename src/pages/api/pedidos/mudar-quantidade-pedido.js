import prisma from "@/lib/prisma";

export default async function MudarQuantidadePedido(req, res) {
  console.log("MudarQuantidadePedido");
  let { id_pedido, quantidade } = req.body;
  if(quantidade < 0 ) quantidade = 0
  const pedidoAtualizado = await prisma.itemPedido.update({
    where: {
      id: id_pedido,
    },
    data: {
      quantidade: quantidade,
    },
  });
  console.log(id_pedido)
  console.log("id_pedido")
  console.log(pedidoAtualizado)
  console.log("pedidoAtualizado")
  return res.status(200).json(pedidoAtualizado);
}

