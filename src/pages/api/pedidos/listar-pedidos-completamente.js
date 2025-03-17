import prisma from "@/lib/prisma";

export default async function ListarPedidosCompletamente(req, res) {
  console.log("Listar Pedidos Completamente");
  const pedidos = await prisma.pedidos.findMany();
  let pedidosCompletos = [];
  await Promise.all(
    pedidos.map(async (pedido, i) => {
      let novoPedido = { ...pedido, itens: [] };
      let shouldPush = false;
      const todasAsInfosDoCliente = await prisma.Usuarios.findUnique({
        where: {
          id: pedido.id_usuario,
        },
      });
      let cliente = {
          nome: todasAsInfosDoCliente.nome,
          email: todasAsInfosDoCliente.email,
          cargo: todasAsInfosDoCliente.cargo,
          telefone: todasAsInfosDoCliente.telefone,
          id: pedido.id_usuario,
      }
      novoPedido = { cliente, ...novoPedido};
      await Promise.all(
        pedido.itens.map(async (itemPedidoID) => {
          shouldPush = true;
          const itemPedido = await prisma.itemPedido.findUnique({
            where: {
              id: itemPedidoID,
            },
          });
          const produto = await prisma.produtos.findFirst({
            where: {
              id: itemPedido.id_produto,
            },
          });
          novoPedido.itens.push({ ...itemPedido, produto: produto });
        })
      );
      if (shouldPush) pedidosCompletos.push(novoPedido);
    })
  );
  console.log(JSON.stringify(pedidosCompletos, null, 2));
  console.log("pedidosCompletos");
  return res.status(200).json(pedidosCompletos);
}
