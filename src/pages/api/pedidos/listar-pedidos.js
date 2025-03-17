import prisma from "@/lib/prisma"

export default async function ListarPedidos(req, res) {
    console.log('Listar Pedidos')
    const pedidos = await prisma.pedidos.findMany()
    return res.status(200).json(pedidos)

}