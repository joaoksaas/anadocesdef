import prisma from "@/lib/prisma"

export default async function DesativarPeloId(req, res) {
    console.log("DesativarPeloId")
    let { id, desativado } = req.body
    if(typeof desativado == "undefined") desativado = true
    const produtoDesativado = await prisma.produtos.update({
        where: { id: id },
        data: {
            desativado: desativado
        },
    });
    console.log(produtoDesativado)
    console.log("produtoDesativado")
    return res.status(201).json(produtoDesativado)
}
