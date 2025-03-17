import prisma from "@/lib/prisma"

export default async function UsuarioPorId(req, res) {
    console.log("UsuarioPeloId")
    const { id } = req.body
    const usuario = await prisma.usuarios.findUnique({
        where: {
            id: id
        }
    })

    if(usuario.senha){
        delete usuario.senha
    }
    
    console.log(id)
    console.log("id")
    console.log(usuario)
    console.log("usuario")
    return res.status(200).json(usuario)
}