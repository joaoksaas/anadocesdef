import prisma from "@/lib/prisma"

export default async function CriarPedido(req, res) {
    console.log("CriarPedido")
    let { dataPedido, dataFinalPedido, status, id_usuario } = req.body
    const pedido = await prisma.Pedidos.create({
        data: { dataPedido, dataFinalPedido, status, id_usuario },
    })
    console.log(pedido)
    console.log("pedido")
    return res.status(201).json(pedido)
}
