import prisma from "@/lib/prisma"

export default async function AtualizarItemPedido(req, res) {
    let { id, status } = req.body
    status = status.toUpperCase().replace(/ /g, '')

    const pedidoAtualizado = await prisma.Pedidos.update({
        where: {
          id: id,
        },
        data: {
           status: status,
        },
      })

      console.log(pedidoAtualizado)
      console.log("pedidoAtualizado")

      return res.send(pedidoAtualizado) 
}