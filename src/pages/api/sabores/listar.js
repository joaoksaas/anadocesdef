import prisma from "@/lib/prisma";

export default async function ListarSabores(req, res) {
  console.log("ListarSabores");
  let { somenteNomes } = req.body;
  const todosOsSabores = await prisma.sabores.findMany();
  let somenteNomesDosSabores = [];
  if (somenteNomes) {
    todosOsSabores.map((sabor) => {
      if (!!sabor?.nome) {
        somenteNomesDosSabores.push(sabor.nome);
      }
    });
  }
  const sabores = somenteNomes ? somenteNomesDosSabores : todosOsSabores;
  return res.status(200).json(sabores);
}
