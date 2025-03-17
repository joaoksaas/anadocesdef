import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { avisoErro, avisoInfo, avisoSucesso } from "../Aviso";
import { floatToBrl, tracoParaBarra, formatarProduto, formatarStringParaUrl, pegarDataAtual, statusDisponiveis, transformarString, formatarSabores, brlToFloat, removerVirgulasExcetoPrimeira } from "@/utils/functions";
import Loader from "../Loader";
import TooltipIcon from "../SobreInput";
import BotaoAjuda from "../Help";


export default function Pedidos({ setLoader }) {
    const [pedidosLidos, setPedidosLidos] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const { usuario, usuarioCarregado } = pegarUsuario();
    const [idUsariosDadosLidos, setIdUsariosDadosLidos] = useState(false);
    const [idUsariosDados, setIdUsariosDados] = useState({});

    function formatString(str) {
        return str
            .toLowerCase() // Converte toda a string para minúsculas
            .split(' ') // Divide a string em palavras
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
            .join(' ');  // Junta as palavras com espaço tlgd
    }

    async function listarPedidos() {
        try {
            const response = await api.post(`/api/pedidos/listar-pedidos`).then(({ data }) => data);

            // Filtrar pedidos de acordo com o cargo do usuário
            const pedidosFiltrados = usuario.cargo === "admin"
                ? response // Admin vê todos os pedidos
                : response.filter(pedido => pedido.id_usuario === usuario.id); // Usuário comum vê apenas os próprios pedidos

            let novoPedidos = [];
            await Promise.all(
                pedidosFiltrados.map(async (pedido) => {
                    let novoPedido = { ...pedido, itens: [] };
                    let shouldPush = false;

                    await Promise.all(
                        pedido.itens.map(async itemPedidoID => {
                            shouldPush = true;
                            const itemPedido = await api.post(`/api/pedidos/item-pedido-por-id`, { id: itemPedidoID }).then(({ data }) => data);
                            const produto = await api.post(`/api/produtos/produto-pelo-id`, { id: itemPedido.id_produto }).then(({ data }) => data);
                            novoPedido.itens.push({ ...itemPedido, produto });
                        })
                    );

                    if (shouldPush) {
                        novoPedidos.push(novoPedido);
                    }
                })
            );
            setPedidos(novoPedidos);
            setTimeout(() => {
                setPedidos([]);
                setTimeout(() => {
                    setPedidos(novoPedidos);
                    setPedidosLidos(true);
                    setLoader(false);
                }, 500);
            }, 500);
        } catch (error) {
            avisoErro("Erro ao listar pedidos.");
            console.log(error);
            console.log("error");
        }
    }



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

    useEffect(() => {
        if (!pedidosLidos) {
            listarPedidos();
        }
    }, []);

    useEffect(() => {
        if (pedidosLidos && !idUsariosDadosLidos) {
            infoUsuario();
        }
    }, [pedidosLidos]);

    async function infoUsuario() {
        setIdUsariosDadosLidos(true);
        let idUsuariosBuscar = [];
        pedidos.forEach(pedido => {
            if (!idUsuariosBuscar.includes(pedido.id_usuario)) {
                idUsuariosBuscar.push(pedido.id_usuario);
            }
        });

        let novoIdUsariosDados = {};
        await Promise.all(
            idUsuariosBuscar.map(async idBuscar => {
                const dadosUsuario = await api.post("/api/usuarios/usuario-por-id", { id: idBuscar }).then(({ data }) => data);
                novoIdUsariosDados[idBuscar] = dadosUsuario;
            })
        );

        setIdUsariosDados(novoIdUsariosDados);
    }

    const [carregando, setCarregando] = useState(false)


    const [tudoSelecionado, setTudoSelecionado] = useState(false)
    const [produtosSelecionados, setProdutosSelecionados] = useState([])
    const [dataInicial, setDataInicial] = useState("")
    const [dataFinal, setDataFinal] = useState("")

    const [nome, setNome] = useState("")
    const [status, setStatus] = useState("TUDO")
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
        lerProdutos()
    }, [])



    async function salvarPrecoDaPersonalizacaoDoItemPedido(itemPedido) {
        try {
            await api.post("/api/pedidos/atualizar-preco-da-personalizacao", { id: itemPedido.id, precoDaPersonalizacao: itemPedido.precoDaPersonalizacao })
        } catch (error) {
            avisoErro("Algo deu errado ao salvar o preço da personalização do pedido.")
        }
    }
    return (
        <div className="text-[3rem] bg-brandMarromFundo w-[85%] lg:w-full lg:min-w-[100rem] xl:min-w-[150rem] ">
            <div className="w-full h-full text-[5rem] border-[1px] border-black">
                <h1>Total de pedidos: {pedidos.length}</h1>
            </div>
            <div id="menu" className="border-[1px] border-b-0 border-black print:hidden w-full h-[27rem] p-4 flex gap-4">
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




                </div>
                <div>
                    <div className="flex-col">
                        {usuario.cargo == "admin" &&
                        <>
                        <div className="flex">
                            <p>Nome:  </p>
                            <TooltipIcon tooltipText="Nome da pessoa que deseja filtrar os pedidos, se não tiver nenhum nome, serão todas as pessoas." />
                        </div>
                        <input onChange={(e) => { setNome(e.target.value) }} type="text" className="h-[3.65rem] hover:scale-105 pl-[1rem] mt-1 rounded border-[1px] border-[rgba(0,0,0)] bg-brandAmareloInput text-black"/>
                        </>
                        }
                        <div className="flex">
                            <p>Status:  </p>
                            <TooltipIcon tooltipText="Status que o pedido se encontra para fazer a filtragem." />
                        </div>
                        <div className="
                         w-full max-w-[25rem] mt-1 rounded border-[1px] border-[rgba(0,0,0)] text-brandMarrom bg-brandAmareloInput flex items-center justify-start h-[3.5rem]">
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
            {pedidos.map((pedido, i) => {
                let totaldoPedido = 0;
                let nomeNaoFormatado = idUsariosDados[pedido?.id_usuario]?.nome || pedido?.id_usuario || "-----";
                let nomeDoUsuario = nomeNaoFormatado.charAt(0).toUpperCase() + nomeNaoFormatado.slice(1);
                return (pedido.itens.length > 0 && retornarPedidos({ ...pedido, cliente: { nome: nomeNaoFormatado } })) && (
                    <div key={pedido.id} className={`flex border-[1px] border-black w-full justify-between transition-all duration-150 ease-in-out ${carregando ? "opacity-70 pointer-events-none" : ""}`}>
                        {/* Bloco de informações de usuário visível apenas para admins */}
                        {usuario.cargo === "admin" && (
                            <div className="ml-2 border-r-[1px] border-black w-[20%]">
                                <h1>Nome do Usuário:</h1>
                                <p>{formatString(nomeDoUsuario)}</p>
                                <h2>ID do Usuário:</h2>
                                <p className="break-all">{pedido.id_usuario}</p>
                            </div>
                        )}
                        <div className={`ml-2 border-r-[1px] border-black w-[60%] ${usuario.cargo === "admin" ? 'w-[60%]' : 'w-[70%]'}`}>



                            <h1 className="mx-[2.5rem]"><strong>Pedido:</strong> {pedido.id}</h1>
                            <p className="mx-[2.5rem]"><strong>Status:</strong> ‎
                                {usuario.cargo === 'admin' ? (
                                    <select
                                        id="status"
                                        name="select"
                                        className="rounded border-[1px] border-[rgba(0,0,0,0.3)] text-brandMarrom bg-brandAmareloInput"
                                        onChange={async (e) => {
                                            try {
                                                setCarregando(true)
                                                const value = e.target.value;
                                                await api.post('/api/pedidos/atualizar-status-pedido', { id: pedido.id, status: value });
                                                avisoSucesso("Status atualizado com sucesso.");
                                            } catch (error) {
                                                avisoErro("Erro ao atualizar o status.");
                                            } finally {
                                                setCarregando(false)
                                            }
                                        }} >
                                        {statusDisponiveis().map(nomeStatus => (
                                            <option value={nomeStatus} selected={pedido.status.toUpperCase() == nomeStatus.toUpperCase()}>{nomeStatus}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</span>
                                )}
                            </p>
                            <p className="mx-[2.5rem]"><strong>Data do Pedido:</strong> {!!pedido?.dataPedido ? pedido?.dataPedido : "--/--/----"}</p>

                            <p className="mx-[2.5rem] "><strong>Data de finalização: </strong>

                                {usuario.cargo === 'admin' ? (
                                    <>
                                        <input
                                            id="date"
                                            type="date"
                                            value={(pedido?.dataFinalPedido || pegarDataAtual()).split('/').reverse().join('-')}
                                            onChange={async (e) => {
                                                try {
                                                    setCarregando(true)
                                                    const novaDataFinalFormatada = e.target.value.split('-').reverse().join('/');
                                                    await api.post('/api/pedidos/atualizar-data-final-pedido', { id: pedido.id, dataFinalPedido: novaDataFinalFormatada });
                                                    let newPedidos = [...pedidos]
                                                    newPedidos[i].dataFinalPedido = novaDataFinalFormatada
                                                    setPedidos(newPedidos)
                                                    avisoSucesso("Data final atualizada com sucesso.");
                                                } catch (error) {
                                                    avisoErro("Erro ao atualizar a data final do pedido.");
                                                } finally {
                                                    setCarregando(false)
                                                }
                                            }}
                                            className={`hover:scale-105 cursor-pointer ${!pedido?.dataFinalPedido ? "bg-[#d68560] text-transparent" : "text-black"} mt-6 rounded border-[1px] border-[rgba(0,0,0,0.3)] text-brandMarrom bg-brandAmareloInput`}
                                        />
                                    </>
                                ) : (
                                    <span>{!!pedido?.dataFinalPedido ? pedido?.dataFinalPedido : "--/--/----"}</span>
                                )
                                }
                            </p>

                            {pedido.itens.map((itemPedido, index) => {
                                totaldoPedido += (itemPedido?.precoDaPersonalizacao || 0.0) + (itemPedido.quantidade * itemPedido.precoUnitario);

                                return (
                                    <div key={index} className="m-10 flex items-center justify-between gap-10">
                                        <div className={`h-full w-full`}>
                                            <p><strong>Item:</strong> <a href={`/produto/${itemPedido.nome}`} target="_blank" className="underline">{formatString(itemPedido.nome)}</a></p>
                                            {itemPedido?.sabor && <p><strong>Sabor:</strong> {formatarSabores(itemPedido.sabor)}</p>}
                                            <p><strong>Quantidade:</strong> {itemPedido.quantidade} unidade(s)</p>
                                            <p><strong>Preço Unitário:</strong> {floatToBrl(itemPedido.precoUnitario)}</p>
                                            {
                                                itemPedido.descricao && <p><strong>Custo da Personalização: </strong>
                                                    {usuario.cargo === 'admin' ?
                                                        <>R${' '}
                                                            <input
                                                                type="number"
                                                                placeholder="0,00"
                                                                className={` rounded-[0.5rem] border-[1px] text-brandMarrom text-[2.5rem] pl-2 text-left bg-brandAmareloInput border-[rgba(255,255,255,0.5)]`}
                                                                onChange={(e) => {
                                                                    let newPedidos = [...pedidos]
                                                                    let newValue = (e.target.value + "")
                                                                    newPedidos[i].itens[index].precoDaPersonalizacao = !!newValue ? parseFloat(newValue) : 0.0
                                                                    setPedidos(newPedidos)
                                                                    salvarPrecoDaPersonalizacaoDoItemPedido(newPedidos[i].itens[index])
                                                                }}
                                                                value={itemPedido?.precoDaPersonalizacao}
                                                            />
                                                        </>
                                                        :
                                                        <>
                                                            {floatToBrl(itemPedido?.precoDaPersonalizacao)}
                                                        </>
                                                    }
                                                </p>
                                            }
                                            {itemPedido.descricao && <p><strong>Personalização:</strong></p>}
                                            {itemPedido.descricao && <p className={`h-full w-full max-h-[20rem] overflow-x-hidden ${itemPedido?.descricao?.length >= 25 ? 'overflow-y-scroll border-[1px] border-black shadow-xl bg-brandAmareloInput' : ''}`}>{itemPedido.descricao}</p>}


                                        </div>
                                        <div className="mr-4 h-full w-full max-w-fit">
                                            <img className="h-[15.4rem] w-[15rem] rounded-tl-[1rem] rounded-bl-[1rem] object-cover rounded-[6px] "
                                                src={`${itemPedido?.produto?.imagem}`}
                                                alt="Foto do produto"
                                            />
                                        </div>

                                    </div>
                                );
                            })}
                        </div>


                        <div className={`ml-2 flex ${usuario.cargo === "admin" ? 'w-[20%]' : 'w-[30%]'}`}>
                            Total do Pedido: {floatToBrl(totaldoPedido)}
                        </div>

                    </div>
                );

            }).reverse()}
        </div>
    );
}