import prisma from "@/lib/prisma"

export default async function UsuarioPorEmail(req, res) {
    console.log("UsuarioPorEmail")
    const { email } = req.body
    let usuario = await prisma.usuarios.findFirst({
        where: {
            email: email
        }
    })
    if(usuario.senha){
        delete usuario.senha
    }
    console.log(email)
    console.log("email")
    console.log(usuario)
    console.log("usuario")
    return res.status(200).json(usuario)
}
