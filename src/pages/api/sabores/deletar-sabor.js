import prisma from "@/lib/prisma"

export default async function DeletarSabor(req, res) {
    console.log("DeletarSabor")
    const { id } = req.body
    const saborDeletado = await prisma.sabores.delete({
        where: {
            id: id
        }
    })
    console.log(saborDeletado)
    console.log("saborDeletado")
    return res.status(200).json(saborDeletado)
}
