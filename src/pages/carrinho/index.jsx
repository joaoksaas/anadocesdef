import { avisoErro, avisoSucesso } from "@/components/Aviso";
import CarrinhoC from "@/components/Carrinho";
import Header from "@/components/Header";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { api } from "@/services/api";
import { pegarDataAtual } from "@/utils/functions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

const telefone = process.env.NEXT_PUBLIC_TELEFONE
export default function Carrinho() {
    const router = useRouter()
    async function fecharPedido() {
        if (produtos.length == 0) {
            avisoErro("Carrinho Vazio", 1300)
            return
        }
        let dataPedido = pegarDataAtual()
        const pedidoFechado = await api.post("/api/pedidos/fechar-pedido", { email: usuario.email, produtos: produtos, dataPedido: dataPedido }).then(({ data }) => { return data })
        avisoSucesso("Pedido fechado!")
        console.log(pedidoFechado)
        console.log("pedidoFechado")
        const rotaPedidoWhats = `https://api.whatsapp.com/send?phone=${telefone}`
        router.push(rotaPedidoWhats)
    }

    const { usuario, setCarrinho, carrinho } = pegarUsuario()
    const [produtosBuscados, setProdutosBuscados] = useState(false)
    async function montarCarrinho(forcarMontagem = false) {
        if ((produtosBuscados || !usuario?.email) && !forcarMontagem) return
        setProdutosBuscados(true)
        const carrinhoMontado = await api.post("/api/carrinho/montar-carrinho", { email: usuario.email }).then(({ data }) => { return data })
        if (!!carrinhoMontado) {
            setCarrinho(carrinhoMontado)
            localStorage.setItem('carrinho', JSON.stringify(carrinhoMontado))
        }
        setProdutos(carrinhoMontado?.itens || [])
        setCarrinho({ ...carrinho, itens: carrinhoMontado?.itens || [] })
        setCarregando(false)
    }

    const [produtos, setProdutos] = useState([])

    useEffect(() => {
        if (!produtosBuscados) montarCarrinho()
    }, [])

    const [carregando, setCarregando] = useState(true)

    return (
        <>
            <Loader
                carregando={carregando}
            />
            <Header />
            <CarrinhoC produtos={produtos} usuario={usuario} setProdutos={setProdutos} fecharPedido={fecharPedido} montarCarrinho={montarCarrinho}/>
        </>
    );
}