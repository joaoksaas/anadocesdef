import prisma from "@/lib/prisma"

export default async function handler(req, res) {

    if (req.method === 'GET') {
        console.log("GET")
        const usuarios = await prisma.usuarios.findMany()
        console.log(usuarios)
        console.log("usuarios")
        return res.status(200).json(usuarios)
    }


    if (req.method === 'POST') {
        console.log("POST")
        const { nome, email, cargo } = req.body
        const user = await prisma.usuarios.create({
            data: { nome, email, cargo },
        })
        return res.status(201).json(user)
    }
}
