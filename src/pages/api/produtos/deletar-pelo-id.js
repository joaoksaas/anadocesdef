import prisma from "@/lib/prisma"

export default async function DeletarPeloId(req, res) {
    console.log("DeletarPeloId")
    const { id } = req.body
    const produtoDeletado = await prisma.produtos.delete({
        where: {
            id: id
        }
    })
    console.log(produtoDeletado)
    console.log("produtoDeletado")
    return res.status(200).json(produtoDeletado)
}
