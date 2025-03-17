import prisma from "@/lib/prisma";
import { pegarDataAtual } from "@/utils/functions";

export default async function FecharPedido(req, res) {
  console.log("FecharPedido");
  const { email, produtos, dataPedido } = req.body;
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

  console.log(produtos);
  console.log("produtos");
  console.log(pedidoAtual);
  console.log("pedidoAtual");

  if (pedidoAtual.itens.length == 0) {
    console.log("PEDIDOS ATUAIS VAZIO, CRIAÇÃO ABORTADA");
    return res.status(200).send(true);
  }

  await atualizarDescricoes(pedidoAtual, produtos)

  const id_usuario = usuario.id;
  let { dataFinalPedido = "", status = "PENDENTE" } = req.body;
  const pedido = await prisma.Pedidos.create({
    data: { dataPedido, dataFinalPedido, status, id_usuario },
  });
  console.log(pedido);
  console.log("pedido");
  console.log(pedidoAtual);
  console.log("pedidoAtual");
  const novoPedidoAtual = await prisma.Pedidos.findFirst({
    where: {
      id_usuario: usuario.id,
    },
    orderBy: {
      id: "desc",
    },
  });
  console.log(novoPedidoAtual);
  console.log("novoPedidoAtual");

  return res.status(200).send(true);
}

// Atualiza a descrição dos produtos no banco de dados de acordo com a descrição customziada que o usuário criou
async function atualizarDescricoes(pedidoAtual, produtos) {
  await Promise.all(
    pedidoAtual.itens.map(async (itemPedidoId) => {
      const itemPedido = await prisma.itemPedido.findFirst({
        where: {
          id: itemPedidoId,
        },
      });
      await Promise.all(
        produtos.map(async (produto) => {
          if (
            produto.descricao != itemPedido.descricao &&
            produto.id == itemPedido.id_produto
          ) {
            const itemPedidoAtualizado = await prisma.itemPedido.update({
              where: {
                id: itemPedidoId,
              },
              data: {
                descricao: produto.descricao,
                precoDaPersonalizacao: 0.0
              },
            });
          }
        })
      );
    })
  );
}
