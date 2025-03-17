import prisma from "@/lib/prisma";
import { brlToFloat } from "@/utils/functions";

export default async function AtualizarPrecoDaPersonalizacao(req, res) {
  let { id, precoDaPersonalizacao } = req.body;
  if (typeof precoDaPersonalizacao == "string") {
    if (precoDaPersonalizacao.includes("R$")) {
      precoDaPersonalizacao = brlToFloat(precoDaPersonalizacao);
    } else {
      precoDaPersonalizacao = parseFloat(precoDaPersonalizacao);
    }
  }
  console.log("AtualizarPrecoDaPersonalizacao");
  console.log(precoDaPersonalizacao);
  console.log("precoDaPersonalizacao");
  console.log(id);
  console.log("id");

  const pedidoAtualizado = await prisma.itemPedido.update({
    where: {
      id: id,
    },
    data: {
      precoDaPersonalizacao: precoDaPersonalizacao,
    },
  });

  console.log(pedidoAtualizado);
  console.log("pedidoAtualizado");

  return res.send(pedidoAtualizado);
}
