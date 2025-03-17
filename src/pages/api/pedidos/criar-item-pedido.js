import prisma from "@/lib/prisma"

export default async function CriarItemPedido(req, res) {
    console.log("CriarItemPedido")
    let { nome, quantidade , descricao, sabor, precoUnitario, pesoUnitario, id_produto, id_pedido } = req.body
    quantidade = parseInt(quantidade)
    const itemPedido = await prisma.itemPedido.create({
        data: {  nome, quantidade, descricao, sabor: sabor, precoUnitario, pesoUnitario, id_produto, id_pedido, precoDaPersonalizacao: 0.0 },
    })
    return res.status(201).json(itemPedido)
}