import prisma from "@/lib/prisma"

export default async function EditarProduto(req, res) {
    console.log("EditarProduto")
    let { sabor } = req.body
    const id = sabor?.id
    delete sabor.id
    if(!!sabor?.nome){
        sabor.nome = sabor.nome.toUpperCase().trim()
    }
    const saborAtualizado = await prisma.sabores.update({
        where: { id: id},
        data: {
            ...sabor
        }
    });
    console.log(saborAtualizado)
    console.log("saborAtualizado")
    return res.status(201).json(saborAtualizado)
}
