import prisma from "@/lib/prisma"

export default async function CriarSabor(req, res) {
    console.log("CriarSabor")
    let { sabor } = req.body
    if(!!sabor?.nome){
        sabor.nome = sabor.nome.toUpperCase().replace(/  /g," ").trim()
        if(!sabor.nome.replace(/ /g,"")){
            throw new Error("Nome de sabor inválido!")
        }
    }
    const saborCriado = await prisma.sabores.create({
        data: sabor,
    })
    return res.status(201).json(saborCriado)
}
