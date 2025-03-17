import { useEffect, useState } from "react"
import { pegarUsuario } from "@/contexts/ContextoDoUsuario"
import ItemDoRelatorio from "./ItemDoRelatorio"
import { api } from "@/services/api"
import { formatString, statusDisponiveis, tracoParaBarra, transformarString } from "@/utils/functions"
import TooltipIcon from "../SobreInput"
import BotaoAjuda from "../Help"
import RelatorioDePedido from "../RelatorioDePedido"
import { avisoInfo } from "../Aviso"
import LogoSvg from "../LogoSvg"


export default function Relatorio({ filtrosAtivos, setProdutosSelecionadosState, pedidos, setFiltrosAtivos, setProdutosState }) {
    const { usuario, setUsuario, usuarioCarregado } = pegarUsuario();

    const [tudoSelecionado, setTudoSelecionado] = useState(false)
    const [produtosSelecionados, setProdutosSelecionados] = useState([])

    async function lerProdutos() {
        try {
            const response = await api.post("/api/produtos/listar", { mostrarDesativados: usuario?.cargo && usuario?.cargo != "usuario" }).then(({ data }) => { return data })
            setProdutos(response.reverse())
        } catch (error) {
            console.log("Erro em lerProdutos: ", error.message)
        } finally {
            console.log("fim!")
        }
    }

    const [produtos, setProdutos] = useState([])
    useEffect(() => {
        setProdutosState(produtos)
    }, [produtos])
    useEffect(() => {
        setProdutosSelecionadosState(produtosSelecionados)
    }, [produtosSelecionados])
    useEffect(() => {
        lerProdutos()
    }, [])

    const [dataInicial, setDataInicial] = useState("")
    const [dataFinal, setDataFinal] = useState("")


    function verificarDataAntes(date1, date2) {
        date2 = tracoParaBarra(date2)
        try {
            date2 = tracoParaBarra(date2)
            const [day1, month1, year1] = date1.split("/").map(Number);
            const [day2, month2, year2] = date2.split("/").map(Number);
            const formattedDate1 = new Date(year1, month1 - 1, day1);
            const formattedDate2 = new Date(year2, month2 - 1, day2);
            return formattedDate1 >= formattedDate2;
        } catch (error) {
            console.log("Erro ao verificar filtro de data inicial")
            return true
        }
    }

    function verificarDataDepois(date1, date2) {
        try {
            date2 = tracoParaBarra(date2)
            const [day1, month1, year1] = date1.split("/").map(Number);
            const [day2, month2, year2] = date2.split("/").map(Number);
            const formattedDate1 = new Date(year1, month1 - 1, day1);
            const formattedDate2 = new Date(year2, month2 - 1, day2);
            return formattedDate1 <= formattedDate2;
        } catch (error) {
            console.log("Erro ao verificar filtro de data final")
            return true
        }
    }


    function verificarNome(nomePedido, nome) {
        nomePedido = transformarString(nomePedido || "").replace(/ /g, "")
        nome = transformarString(nome || "").replace(/ /g, "")
        return nomePedido.includes(nome)
    }

    function verificarStatus(statusPedido, status) {
        return statusPedido.toUpperCase() == status.toUpperCase()
    }



    function verificarProdutos(itens, produtosSelecionados) {
        let verificacaoDeProdutosValida = false
        itens.map(item => {
            if (produtosSelecionados?.includes(item.id_produto)) verificacaoDeProdutosValida = true; return
        })
        return verificacaoDeProdutosValida
    }

    function retornarPedidos(pedido) {

        let dataInicialValida = !dataInicial ? true : verificarDataAntes(pedido?.dataPedido, dataInicial)
        let dataFinalValida = !dataFinal ? true : verificarDataDepois(pedido?.dataPedido, dataFinal)

        let pertenceAoNomes = !nome ? true : verificarNome(pedido?.cliente?.nome, nome)

        let pertenceAosProdutos = produtosSelecionados.length == 0 ? true : verificarProdutos(pedido.itens, produtosSelecionados)

        let pertenceAoStatus = (!status || status == "TUDO") ? true : verificarStatus(pedido.status, status)

        let deveRetornar = dataInicialValida && dataFinalValida && pertenceAoNomes && pertenceAosProdutos && pertenceAoStatus

        return deveRetornar

    }

    const [nome, setNome] = useState("")
    const [status, setStatus] = useState("TUDO")

    useEffect(() => {
        updateFiltrosAtivos()
    }, [nome, pedidos, status, dataInicial, dataInicial, produtosSelecionados])
    function updateFiltrosAtivos() {
        setFiltrosAtivos({
            "nome": nome,
            "status": status,
            "dataInicial": dataInicial,
            "dataFinal": dataFinal,
            "produtosSelecionados": produtosSelecionados,
        })
    }

    function pegarPedidosFiltrados() {
        let pedidosFiltrados = []
        pedidos.map((pedido, index) => {
            if (retornarPedidos(pedido)) {
                pedidosFiltrados.push(pedido)
            }
        })
        return pedidosFiltrados

    }
    const [mostrarFiltros, setMostrarFiltros] = useState(false)
    useEffect(() => {
        let newMostrarFiltros = false
        Object.keys(filtrosAtivos).map(key => {
            let value = filtrosAtivos[key]
            if (!!value && value != "TUDO" && value.length != 0) newMostrarFiltros = true
        })
        setMostrarFiltros(newMostrarFiltros)
    }, [filtrosAtivos])
    function idParaNomeProduto(id) {
        let nomeProduto = ""
        produtos.map(produto => {
            if (produto.id == id) {
                nomeProduto = produto.nome
            }
        })
        return nomeProduto
    }

    return (
        <>
            {/* PARTE DO PRINT */}
            <div className="screen:hidden z-[700] bg-black-500 bottom-0 left-0 w-full h-full">''
                <>
                    <header className="items-center justify-start">
                        <div className="flex">
                            <div className="w-full mb-15 mt-10 flex items-center justify-start max-w-fit">
                                <LogoSvg />
                            </div>
                            <h1 className="w-full mb-15 mt-10 flex items-center justify-center text-left text-[5rem] max-w-fit pl-[15%]">Aninha Doces</h1>
                        </div>
                        <div className="pointer-events-none bottom-0 left-0 w-full h-fit flex items-start justify-center flex-col">
                            {
                                mostrarFiltros && <>
                                    <h1 className="text-[5rem]">Filtros:</h1>
                                </>
                            }
                            {Object.keys(filtrosAtivos).map(key => {
                                let value = filtrosAtivos[key]
                                let mostrar = !!value && value != "TUDO" && value.length != 0
                                if (key == "produtosSelecionados") {
                                    let newValue = ""
                                    produtosSelecionados.map((produtoId) => { newValue += idParaNomeProduto(produtoId) + ", " })
                                    newValue = newValue.trim()
                                    newValue = newValue.slice(0, -1)
                                    value = newValue
                                    key = "Produtos"
                                }
                                if (key == "dataInicial" || key == "dataFinal") {
                                    let newValue = ""
                                    value.split("-").reverse().map((date, i) => {
                                        newValue += date
                                        if (i < 2) newValue += "/"
                                    })
                                    value = newValue
                                }
                                return mostrar && (<>
                                    <div className="w-full max-w-[40rem] text-[2rem] h-full max-h-fit border-[1px] border-black">
                                        {key}: {value}
                                    </div>

                                </>)
                            })}

                        </div>
                    </header>
                </>
                {pegarPedidosFiltrados().map((pedido, index) => {
                    return <>
                        <RelatorioDePedido produtosSelecionados={produtosSelecionados} produtos={produtos} pedido={pedido} filtrosAtivos={filtrosAtivos} index={index} />
                    </>
                })
                }
            </div>
            <div className="text-[2rem] screen:border-[1px] border-black rounded-[6px] bg-brandMarromFundo ">
                <div id="menu" className="print:hidden w-full h-[27rem] p-4 flex gap-4">
                    <div className="flex-col">
                        <div>
                            <div className="flex">
                                <p>Data Iní­cio:  </p>
                                <TooltipIcon tooltipText="Data do início da filtragem." />
                            </div>

                            <div className="mt-1 rounded border-[1px] border-[rgba(0,0,0)] text-brandMarrom bg-brandAmareloInput flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        setDataInicial("")
                                    }}
                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`hover:opacity-80 hover:scale-125 hover:text-red-500 transition-all ease-in-out w-10 h-10 ml-2 ${!dataInicial ? "opacity-0 pointer-events-none" : ""}`}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg></button>
                                <input onChange={(e) => { setDataInicial(e.target.value) }} value={dataInicial} id="dataInicio" type="date" className="mt-1 text-brandMarrom bg-brandAmareloInput"></input>
                            </div>
                        </div>
                        <div>
                            <div className="flex">
                                <p>Data Final:  </p>
                                <TooltipIcon tooltipText="Data do final da filtragem." />
                            </div>
                            <div className="mt-1 rounded border-[1px] border-[rgba(0,0,0)] text-brandMarrom bg-brandAmareloInput flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        setDataFinal("")
                                    }}
                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`hover:opacity-80 hover:scale-125 hover:text-red-500 transition-all ease-in-out w-10 h-10 ml-2 ${!dataFinal ? "opacity-0 pointer-events-none" : ""}`}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg></button>
                                <input onChange={(e) => { setDataFinal(e.target.value) }} value={dataFinal} id="dataFim" type="date" className="cursor-pointer text-brandMarrom bg-brandAmareloInput"></input>
                            </div>
                        </div>

                        <div className="mt-6 ml-2">
                            <button
                                onClick={() => window.print()}
                                className="hover:scale-105 rounded border-[1px] border-[rgba(0,0,0)] bg-brandMarrom text-brandAmareloInput flex items-center justify-center print:opacity-0">
                                <p className="mr-2 ml-2">Gerar PDF</p>
                            </button>
                        </div>


                    </div>
                    <div>
                        <div className="flex-col">
                            <div className="flex">
                                <p>Nome:  </p>
                                <TooltipIcon tooltipText="Nome da pessoa que deseja filtrar os pedidos, se não tiver nenhum nome, serão todas as pessoas." />
                            </div>
                            <input onChange={(e) => { setNome(e.target.value) }} type="text" className="h-[3.65rem] hover:scale-105 pl-[1rem] mt-1 rounded border-[1px] border-[rgba(0,0,0)] bg-brandAmareloInput text-black"></input>

                            <div className="flex">
                                <p>Status:  </p>
                                <TooltipIcon tooltipText="Status que o pedido se encontra para fazer a filtragem." />
                            </div>
                            <div className="
                         w-full max-w-[15rem] mt-1 rounded border-[1px] border-[rgba(0,0,0)] text-brandMarrom bg-brandAmareloInput flex items-center justify-start h-[3.5rem]">
                                <button
                                    onClick={() => {
                                        setStatus("TUDO")
                                    }}
                                ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`hover:opacity-80 hover:scale-125 hover:text-red-500 transition-all ease-in-out w-10 h-10 ml-2 ${status == "TUDO" ? "opacity-0 pointer-events-none" : ""}`}>
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg></button>
                                <select onChange={(e) => { setStatus(e.target.value) }} name="status" id="" value={status} className="hover:scale-105 cursor-pointer w-full border-[rgba(0,0,0)] bg-transparent text-black">
                                    <option value={"TUDO"}>Todos</option>
                                    {statusDisponiveis().map(status => {
                                        return <>
                                            <option value={status}>{formatString(status)}</option>
                                        </>
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-auto border-[1px] border-black">
                        <div className="flex">
                            <p>Produtos:  </p>
                            <TooltipIcon tooltipText="Seleciona os produtos que vão aparecer nos pedidos." />
                        </div>

                        <div className="flex flex-col ">
                            <div>

                                <input
                                    type="checkbox"
                                    onChange={() => {
                                        setTudoSelecionado(!tudoSelecionado)
                                        let novoProdutosSelecionados = produtos.map(produto => { return produto.id })
                                        setProdutosSelecionados(novoProdutosSelecionados)
                                    }}
                                    checked={tudoSelecionado}
                                    className="hover:scale-105 cursor-pointer mt-1 rounded text-black"
                                />
                                <label>Selecionar Tudo</label>
                            </div>

                            {
                                produtos.map(produto => {
                                    let selecionado = produtosSelecionados.includes(produto.id)
                                    return <>
                                        <div>
                                            <input
                                                type="checkbox"
                                                checked={selecionado}
                                                value={produto.id}
                                                onChange={() => {
                                                    setTudoSelecionado(false)
                                                    let novoProdutosSelecionados = [...produtosSelecionados]
                                                    if (selecionado) {
                                                        novoProdutosSelecionados = novoProdutosSelecionados.filter(item => { return item != produto.id })
                                                    } else {
                                                        novoProdutosSelecionados.push(produto.id)
                                                    }
                                                    setProdutosSelecionados(novoProdutosSelecionados)
                                                }}
                                                className="hover:scale-105 cursor-pointer mt-1 rounded text-black"
                                            />
                                            <label>{produto.nome}</label>
                                        </div>
                                    </>
                                })
                            }
                        </div>

                    </div>
                    <div className="ml-auto">
                        <BotaoAjuda
                            textoBotao="Ajuda"
                            conteudoAjuda={"Esta página serve para buscar pedidos com seus respectivos filtros e emitir relatório juntamente com os filtros da página."}
                        />
                    </div>

                </div>
                {
                    pedidos.map(pedido => {

                        return retornarPedidos(pedido) && <>
                            <ItemDoRelatorio pedido={pedido} />
                        </>
                    })
                }
            </div>
        </>
    )
}