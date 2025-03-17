import prisma from "@/lib/prisma"

export default async function ItemPedidoPorID(req, res) {
    console.log("Item Pedido")
    
    const { id } = req.body
    const pedido = await prisma.itemPedido.findUnique({
        where: {
            id: id
        }
    })
    console.log(id)
    console.log("id")
    console.log(pedido)
    console.log("pedido")
    return res.status(200).json(pedido)

}