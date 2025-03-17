import Header from "@/components/Header";
import Relatorio from "@/components/Relatorio";
import RelatorioDePedido from "@/components/RelatorioDePedido";
import { api } from "@/services/api"
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";


export default function RelatorioP() {
    const [pedidosLidos, setPedidosLidos] = useState(false)
    const [pedidos, setPedidos] = useState([])
    const [carregando, setCarregando] = useState(true)


    async function lerPedidos() {
        setPedidosLidos(true)
        const response = await api.post(`/api/pedidos/listar-pedidos-completamente`).then(({ data }) => { return data })
        setPedidos(response)
        setCarregando(false)
    }
    useEffect(() => {
        if (!pedidosLidos) {
            lerPedidos()
        }
    }, [])
    const [filtrosAtivos, setFiltrosAtivos] = useState({})

    const [produtos, setProdutosState] = useState([])
    const [produtosSelecionados, setProdutosSelecionadosState] = useState([])


    return <>
        <div className="bg-slate-700 w-full h-full">
            <Loader
                carregando={carregando}
            />
            <Header />
            <Relatorio filtrosAtivos={filtrosAtivos} setProdutosSelecionadosState={setProdutosSelecionadosState} setProdutosState={setProdutosState} pedidos={pedidos} setFiltrosAtivos={setFiltrosAtivos} />
        </div>
    </>
}