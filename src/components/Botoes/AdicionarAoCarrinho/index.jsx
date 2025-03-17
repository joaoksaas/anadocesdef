import { avisoErro, avisoSucesso } from "@/components/Aviso";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { api } from "@/services/api";
import { useRouter } from "next/router";

export default function BotaoAdicionarAoCarrinho({ usuario, id, quantia, produto }) {
    const { carrinho, setCarrinho } = pegarUsuario()
    const router = useRouter()
    async function adicionarAoCarrinho() {
        if (!usuario.email) {
            router.push("/login")
            return
        }
        try {
            // CRIAR ITEM PEDIDO
            // PEGAR PEDIDO-ATUAL-USUARIO
            // ADICIONAR ITEM PEDIDO AO PEDIDO-ATUAL-USUARIO

            // const dadosUsuario = await api.post("/api/usuarios/usuario-por-email", {
            //     email: usuario.email
            // }).then(({ data }) => { return data })
            console.log(quantia)
            console.log("quantia")
            const pedidoAtualUsuario = await api.post("/api/pedidos/pedido-atual-usuario",
                { email: usuario.email }
            ).then(({ data }) => { return data })
            console.log(pedidoAtualUsuario)
            console.log("pedidoAtualUsuario")

            // CRIAR ITEM PEDIDO
            const itemPedidoCriado = await api.post("/api/pedidos/criar-item-pedido",
                { nome: produto.nome, quantidade: quantia, descricao: "", sabor: produto?.sabor || "", precoUnitario: produto.preco, pesoUnitario: produto.peso, id_produto: produto.id, id_pedido: pedidoAtualUsuario.id }
            ).then(({ data }) => { return data })
            console.log(itemPedidoCriado)
            console.log("itemPedidoCriado")
            // PEGAR PEDIDO-ATUAL-USUARIO + ADICIONAR ITEM PEDIDO AO PEDIDO-ATUAL-USUARIO
            const pedidoAtualizado = await api.post("/api/carrinho/adicionar-pedido",
                { email: usuario.email, id_item_pedido: itemPedidoCriado.id }
            ).then(({ data }) => { return data })

            const carrinhoAtualizado = await api.post("/api/carrinho/montar-carrinho",
                { email: usuario.email }
            ).then(({ data }) => { return data })

            console.log(carrinhoAtualizado)
            console.log("carrinhoAtualizado")

            setCarrinho(carrinhoAtualizado)
            console.log(carrinho)
            console.log("CARRINHO")

            avisoSucesso('Produto Adicionado ao Carrinho!')
        } catch (error) {
            avisoErro()
        }
    }



    return (<div>
        <button onClick={adicionarAoCarrinho} className="w-[46.6rem] h-[14.2rem] bg-brandMarrom flex items-center rounded-[1rem] pl-[0.6rem] pr-[1.7rem] hover:opacity-80 transition-all duration-200 ">
            <p className="font-allura text-[4.6rem] text-brandAmareloInput">Adicionar ao Carrinho</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[10.5rem] h-[9.8rem] text-brandAmareloInput" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
        </button>

    </div>)
}