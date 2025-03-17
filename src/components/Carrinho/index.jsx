import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { api } from "@/services/api";
import { floatToBrl, formatarSabores } from "@/utils/functions";
import { useEffect, useState } from "react";
import { avisoSucesso } from "../Aviso";
import { confirmarAcao } from "../Confirmar";

export default function CarrinhoC({ usuario, produtos, setProdutos, fecharPedido, montarCarrinho }) {


    const [total, setTotal] = useState(0)
    function calcularTotal() {
        let novoTotal = 0
        produtos.map(produto => {
            novoTotal += produto.preco * parseFloat(produto.quantidade)
        })
        setTotal(novoTotal)
    }
    useEffect(() => {
        calcularTotal()
    }, [produtos])

    function formatString(str) {
        return str
            .toLowerCase() // Converte toda a string para minúsculas
            .split(' ') // Divide a string em palavras
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
            .join(' ');  // Junta as palavras com espaço tlgd
    }

    async function mudarQuantidade({ produto, index, quantidade }) {
        if (quantidade < 0) quantidade = 0 // Impede números negativos na quantidade (existe uma tratativa na API também)
        if (quantidade == produto.quantidade) return // Retonar caso não tenha sido alterado o valor (evita chamadas desnecessárias ao banco)
        // Atualiza a listagem de pedidos/produtos no front
        let newProdutos = []
        produtos.map((produto, i) => {
            if (i == index) produto.quantidade = quantidade
            newProdutos.push(produto)
        })
        setProdutos(newProdutos)
        // Atualiza o pedido no banco
        await api.post("/api/pedidos/mudar-quantidade-pedido", { id_pedido: produto.id_pedido, quantidade: quantidade }).then(({ data }) => { return data })
    }
    async function removerProduto({ index }) {
        const produtoAtual = produtos[index] // Define o produto atual a ser removido (deve estar na primeira linha antes de tudo)
        // Atualiza a listagem de pedidos/produtos no front
        let newProdutos = produtos.filter((item, i) => { return i != index })
        setProdutos(newProdutos)
        // Remove o valor do carrinho para forçar o reload em outras páginas 
        localStorage.removeItem("carrinho")
        // Remove o pedido no banco
        await api.post("/api/pedidos/remover-pedido", { id_usuario: usuario.id, id_pedido: produtoAtual.id_pedido }).then(({ data }) => { return data })
        // Remonta o carrinho
        montarCarrinho(true)
    }

    useEffect(() => {
        localStorage.removeItem("carrinho")
    }, [])

    return (
        <>
            <div className="mx-auto lg:flex w-full 2xs:w-full 3lg:w-[90%] h-[69rem] bg-brandMarromFundo border-[1px] border-black">
                <div className=" h-[100%] lg:w-[60%] w-full">
                    <div className=" 3lg:h-[12%] border-b-[1px] border-black text-[3.2rem] ml-2">Carrinho</div>
                    <div className=" h-[88%] overflow-x-hidden overflow-y-scroll flex flex-col pt-[1rem]">
                        {produtos.map((produto, i) => {
                            return (
                                <>
                                    <div className="border-b-[1px] relative border-black w-full mb-4 pt-[2rem] pb-1">
                                        <div className="flex flex-wrap lg:flex-nowrap">
                                            <div className="w-[48%] 3lg:w-1/3 m-1 flex-grow pb-[0.4rem] mt-[-2rem]">
                                                <img
                                                    className="max-h-fit w-full rounded-3xl"
                                                    src={produto?.imagem}
                                                    alt="Descrição da imagem"
                                                />
                                            </div>

                                            <div className="w-[48%] 3lg:w-2/3 flex flex-col">
                                                <div className="w-full h-auto flex flex-col items-start justify-start min-h-[17rem] m-1 relative">
                                                    <button
                                                        onClick={() => {
                                                            confirmarAcao({ funcao: removerProduto, valor: { index: i } });
                                                        }}
                                                        className="absolute top-[-3rem] right-[1rem] bg-red-500 text-white text-[2rem] w-[3rem] h-[3rem] rounded-full"
                                                    >
                                                        X
                                                    </button>
                                                    <a href={`/produto/${produto?.nome}`}>
                                                        <p className="2xs:text-[2.4rem] text-[1.8rem] pl-5 underline">{formatString(produto?.nome)}</p>
                                                    </a>
                                                    {!!produto?.sabor && (
                                                        <p className="text-[1.2rem] 2xs:text-[1.6rem] pl-5">
                                                            Sabor: {formatarSabores(produto?.sabor)}
                                                        </p>
                                                    )}
                                                    <p className="text-[1.2rem] 2xs:text-[1.6rem] pl-5">Peso: {produto?.peso} gramas</p>
                                                    <div className="flex items-center">
                                                        <p className="text-[1.2rem] 2xs:text-[1.6rem] pl-5">Quantia: </p>

                                                        <button
                                                            onClick={() => {
                                                                mudarQuantidade({
                                                                    produto,
                                                                    index: i,
                                                                    quantidade: Math.max(1, parseInt(produto.quantidade, 10) - 1),
                                                                });
                                                            }}
                                                            className="bg-brandMarrom text-brandAmareloInput text-[1.5rem] w-[2rem] h-[2rem] hover:opacity-80 transition-all duration-200"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            className="text-[1.2rem] 2xs:text-[1.6rem] pl-2 w-[5rem] mx-2 border border-black rounded"
                                                            value={produto.quantidade}
                                                            min="1"
                                                            onChange={(e) => {
                                                                const quantidade = e.target.value === '' ? 1 : Math.max(1, parseFloat(e.target.value));
                                                                mudarQuantidade({ produto, index: i, quantidade });
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => {
                                                                mudarQuantidade({
                                                                    produto,
                                                                    index: i,
                                                                    quantidade: parseInt(produto.quantidade, 10) + 1,
                                                                });
                                                            }}
                                                            className="bg-brandMarrom text-brandAmareloInput text-[1.5rem] w-[2rem] h-[2rem] hover:opacity-80 transition-all duration-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <p className="text-[1.2rem] 2xs:text-[1.6rem] pl-5">
                                                        Preço Unitário: {floatToBrl(produto?.preco)}
                                                    </p>
                                                </div>

                                                <div className="w-full h-[16rem] flex flex-col m-1">
                                                    <p className=" text-[1.8rem] 2xs:text-[2.4rem] pl-5">Personalização do Pedido</p>
                                                    <textarea
                                                        className="h-full text-[1.6rem] resize-none bg-brandAmareloInput border-[1px] border-black mb-1 mr-4"
                                                        onChange={(e) => {
                                                            produtos[i].descricao = e.target.value;
                                                        }}
                                                    >
                                                        {produto.descricao}
                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
                <div className=" h-auto 3lg:w-[40%] lg:border-l-[1px] border-black ">
                    <div className="w-full flex justify-between">
                        <p className="text-[4.4rem] pl-7">Total: </p>
                        <p className="text-[4.4rem] pr-9"><strong>{floatToBrl(total)}</strong></p>
                    </div>
                    <button
                        onClick={fecharPedido}
                        className=" text-center w-[90%] mx-auto text-[3rem] text-brandAmareloInput rounded-[1rem] bg-brandMarrom p-6 border-[1px] border-black flex hover:opacity-80 transition-all duration-200">Fechar pedido e ir para WhatsApp
                    </button>
                </div>

            </div>
        </>
    );
}

