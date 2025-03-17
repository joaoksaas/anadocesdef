import prisma from "@/lib/prisma"

export default async function EditarProduto(req, res) {
    console.log("EditarProduto")
    let { id, imagem, nome, preco, peso, sabores } = req.body
    nome = nome.toLowerCase()
    const updateProduto = await prisma.produtos.update({
        where: { id: id },
        data: {
            imagem, nome, preco, peso, sabores
        },
    });
    console.log(updateProduto)
    console.log("updateProduto")
    return res.status(201).json(updateProduto)
}
