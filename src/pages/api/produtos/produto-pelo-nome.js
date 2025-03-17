import prisma from "@/lib/prisma"

export default async function ProdutoPeloNome(req, res) {
    console.log("ProdutoPeloNome")
    const { nome } = req.body
    const produto = await prisma.produtos.findFirst({
        where: {
            nome: nome
        }
    })
    console.log(nome)
    console.log("nome")
    console.log(produto)
    console.log("produto")
    return res.status(200).json(produto)
}
