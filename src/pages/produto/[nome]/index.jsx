import Header from "@/components/Header";
import Produto from "@/components/Produto";
import { api } from "@/services/api";
import { floatToBrl } from "@/utils/functions";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { useEffect, useState } from 'react';

// getStaticProps retornará os props da página antes de ela ser renderizada
export async function getStaticProps(context) {
  console.log("getStaticProps");
  // busca nos parametros do contexto o nome do produto 
  // (funciona porque a página é site.com/produtos/[nome] ,
  // então tudo que vier depois de site.com/produtos/ irá ser considerado nome)
  const { nome } = context.params;

  const produto = await api.post(`/api/produtos/produto-pelo-nome`, { nome }).then(({ data }) => { return data })
  return {
    props: {
      produto: produto
    },
  };
}



// getStaticPaths permite especificar quais rotas dinâmicas devem ser geradas estaticamente 
// durante o processo de construção da página.
// É usado quando você tem uma página com segmentos dinâmicos (por exemplo, site.com/usuario/[email] ou site.com/usuario/[id].js),
export async function getStaticPaths() {
  return {
    paths: [], // Definir aqui os caminhos que você deseja pré-renderizar. (pesquisar sobre depois se tiver interesse)
    fallback: 'blocking', // ou 'true' ou 'false' com base nas suas necessidades. (pesquisar sobre depois se tiver interesse)
  };
}

export default function PaginaDoProduto(props) {
  const [produto, setProdutoPagina] = useState(props?.produto || {})
  if (!produto) {
    return <div>
      <h1>EU NÃO EXISTO!!</h1>
    </div>
  }
 

  const { id, nome, preco, peso, imagem, sabores } = produto

  return (
    <>
      <Header />
      <Produto
        produto={produto}
        setProdutoPagina={setProdutoPagina}
      />

    </>
  );
}
