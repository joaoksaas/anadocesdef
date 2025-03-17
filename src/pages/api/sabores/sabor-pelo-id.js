import prisma from "@/lib/prisma"

export default async function SaborPeloId(req, res) {
    console.log("SaborPeloId")
    const { id } = req.body
    const sabor = await prisma.sabores.findFirst({
        where: {
            id: id
        }
    })
    console.log(id)
    console.log("id")
    console.log(sabor)
    console.log("sabor")
    return res.status(200).json(sabor)
}
