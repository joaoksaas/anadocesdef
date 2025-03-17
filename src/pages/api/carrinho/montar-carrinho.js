import prisma from "@/lib/prisma";

export default async function MontarCarrinho(req, res) {
  console.log("MontarCarrinho");
  const { email } = req.body;
  const usuario = await prisma.Usuarios.findFirst({
    where: {
      email: email,
    },
  });
  let pedidoAtual = await prisma.Pedidos.findFirst({
    where: {
      id_usuario: usuario.id,
    },
    orderBy: {
      id: "desc",
    },
  });
  let carrinhoMontado = { ...pedidoAtual, itens: [] };
  await Promise.all(
    pedidoAtual.itens.map(async (itemPedidoId) => {
      const itemPedido = await prisma.itemPedido.findUnique({
        where: {
          id: itemPedidoId,
        },
      });
      let dadosProduto = await prisma.Produtos.findUnique({
        where: {
          id: itemPedido.id_produto,
        },
      });

      carrinhoMontado.itens.push(
        formatarItemPedido({
          ...itemPedido,
          id_pedido: itemPedidoId,
          sabor: itemPedido?.sabor || "",
          produto: dadosProduto,
        })
      );
    })
  );

  return res.status(200).json(carrinhoMontado);
}

function formatarItemPedido(itemPedido) {
  console.log("formatarItemPedido");
  let { produto } = itemPedido;
  let itemPedidoFormatado = {
    id: produto.id,
    id_pedido: itemPedido.id_pedido,
    nome: produto.nome,
    peso: produto.peso,
    quantidade: itemPedido.quantidade,
    preco: produto.preco,
    imagem: produto.imagem,
    sabor: itemPedido?.sabor || "",
    descricao: itemPedido.descricao,
  };
  return itemPedidoFormatado;
}
