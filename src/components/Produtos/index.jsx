"use client"
import { useEffect, useState } from "react"
import { api } from "@/services/api"
import { pegarUsuario } from "@/contexts/ContextoDoUsuario"
import ProdutoPaginaPrincipal from "../ProdutoPaginaPrincipal"
import { ordenarPorId, ordernarDesativadosParaBaixoOuCima, ordernarPorNome, transformarString } from "@/utils/functions"

export default function Produtos({ buscar, setCarregando }) {
    const { usuario, setUsuario, usuarioCarregado } = pegarUsuario();
    const [produtos, setProdutos] = useState([])
    const [produtosOrdenados, setProdutosOrdenados] = useState([])
    useEffect(() => {
        setProdutosOrdenados(pegarProdutosFiltrados(produtos))
    }, [produtos])

    async function lerProdutos() {
        try {
            const response = await api.post("/api/produtos/listar", { mostrarDesativados: usuario?.cargo && usuario?.cargo != "usuario" }).then(({ data }) => { return data })
            setProdutos(response.reverse())
        } catch (error) {
            console.log("Erro em lerProdutos: ", error.message)
        } finally {
            console.log("fim!")
            setCarregando(false)
        }
    }
    useEffect(() => {
        if (usuarioCarregado) {
            lerProdutos()
        }
    }, [usuarioCarregado])



    const [tipoFiltro, setTipoFiltro] = useState("Recentes")
    const tiposDeFiltro = ["Alfabético A-Z", "Alfabético Z-A", "Recentes"]

    function pegarProdutosFiltrados(produtos) {
        let produtosFiltrados = [...produtos]
        if (tipoFiltro == "Alfabético A-Z") {
            produtosFiltrados = ordernarPorNome(produtosFiltrados)
        }
        if (tipoFiltro == "Alfabético Z-A") {
            produtosFiltrados = ordernarPorNome(produtosFiltrados).reverse()
        }
        if (tipoFiltro == "Recentes") {
            produtosFiltrados = produtos
        }

        // Manda os produtos desativados para baixo ou cima
        const mandarParaCima = false // => Opcional, mas está aqui para servir de exemplo :)
        produtosFiltrados = ordernarDesativadosParaBaixoOuCima(produtosFiltrados,mandarParaCima)

        return produtosFiltrados
    }

    const handleSelectFiltro = (novoFiltro) => {
        if (tiposDeFiltro.includes(novoFiltro)) {
            setTipoFiltro(novoFiltro)
        }
    }

    function verificarBuscar(produto) {
        let retornar = false

        console.log(buscar)
        let buscarFormatado = transformarString(buscar)
        if (!buscarFormatado) return true
        if (transformarString(produto.nome).includes(buscarFormatado)) {
            retornar = true
        }

        return retornar;


    }

    return (
        <div className="bg-[] w-full h-full">
            {/* CABEÇALHO */}
            <div className="text-[1.3rem] h-[3.6rem] rounded-[1rem] 2xs:text-[2rem] bg-brandMarrom 2xs:h-[5.6rem] w-full 2xs:rounded-[1rem] flex items-center justify-between pl-[1.8rem] pr-[1.4rem]">
                <h3 className="text-brandAmareloInput">PRODUTOS</h3>
                {/* SELECT DE BUSCA */}
                <div
                    className="w-[full] max-w-[45.6rem] rounded-[0.4rem] 2xs:h-[3.7rem] text-[#422811] placeholder:text-black flex items-center gap-[5px] justify-center 2xs:rounded-xl bg-[#d6b981]"
                >
                    <h4> Ordenar por</h4>
                    <select
                        name="filtro"
                        id={``}
                        className="bg-transparent"
                        value={tipoFiltro}
                        onChange={(e) => handleSelectFiltro(e.target.value)}
                    >
                        {tiposDeFiltro.map(tipoFiltro => (
                            <option value={tipoFiltro}>{tipoFiltro}</option>
                        ))}
                    </select>
                </div>

            </div>
            <div className="gap-x-[4%] gap-y-24 flex-wrap items-center flex justify-start pt-[5rem] ">
                {pegarProdutosFiltrados(produtos).map(produto => {
                    let retornar = verificarBuscar(produto)
                    return retornar && (
                        <ProdutoPaginaPrincipal desativado={produto.desativado} id={produto.id}
                            imagem={produto.imagem} preco={produto.preco} peso={produto.peso} nome={(produto.nome)} />
                    )
                })}
            </div>
        </div>
    )
}



