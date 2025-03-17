import prisma from "@/lib/prisma"

export default async function CriarProduto(req, res) {
    console.log("CriarProduto")
    let { imagem, nome, preco, peso, sabores, desativado} = req.body
    desativado = !!desativado
    nome = nome.toLowerCase()
    const produto = await prisma.produtos.create({
        data: { imagem, nome, preco, peso, sabores, desativado},
    })
    return res.status(201).json(produto)

}