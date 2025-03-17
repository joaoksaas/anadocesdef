import prisma from "@/lib/prisma";

export default async function Listar(req, res) {
  let { mostrarDesativados } = req.body;
  console.log("Listarprodutos, mostrarDesativados:", !!mostrarDesativados);
  const todosOsProdutos = await prisma.produtos.findMany();
  let produtosAtivos = [];
  if (!mostrarDesativados) {
    todosOsProdutos.map((produto) => {
      if (!produto.desativado) {
        produtosAtivos.push(produto);
      }
    });
  }
  let produtos = mostrarDesativados ? todosOsProdutos : produtosAtivos;
  console.log(produtos);
  console.log("produtos");
  return res.status(200).json(produtos);
}
