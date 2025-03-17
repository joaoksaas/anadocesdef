import prisma from "@/lib/prisma"

export default async function ProdutoPeloId(req, res) {
    console.log("ProdutoPeloId")
    const { id } = req.body
    const produto = await prisma.produtos.findFirst({
        where: {
            id: id
        }
    })
    console.log(id)
    console.log("id")
    console.log(produto)
    console.log("produto")
    return res.status(200).json(produto)
}
