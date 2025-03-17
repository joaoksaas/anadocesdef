import prisma from "@/lib/prisma"

export default async function CriarCarrinho(req, res) {
    console.log("CriarCarrinho")
    let { id, dataPedido, dataFinalPedido, status, id_usuario } = req.body
    const pedido = await prisma.pedidos.create({
        data: { id, dataPedido, dataFinalPedido, status, id_usuario },
    })
    console.log("criou mané", pedido)
    return res.status(201).json(pedido)

}
