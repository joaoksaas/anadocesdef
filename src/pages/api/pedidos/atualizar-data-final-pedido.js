import prisma from "@/lib/prisma"

export default async function AtualizarItemPedido(req, res) {
    let { id, dataFinalPedido } = req.body

    const pedidoAtualizado = await prisma.Pedidos.update({
        where: {
          id: id,
        },
        data: {
           dataFinalPedido: dataFinalPedido,
        },
      })

      console.log(pedidoAtualizado)
      console.log("pedidoAtualizado")

      return res.send(pedidoAtualizado) 
}