import { floatToBrl, formatarSabores } from "@/utils/functions";
import { useState } from "react"



function formatString(str) {
    return str
        .toLowerCase() // Converte toda a string para minúsculas
        .split(' ') // Divide a string em palavras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
        .join(' ');  // Junta as palavras com espaço tlgd
}
export default function ItemDoRelatorio({ pedido }) {


    let pedidoExemplo = {
        "id": "671ad221701807caacc72712",
        "dataPedido": "24/10/2024",
        "dataFinalPedido": "15/10/2024",
        "status": "ENTREGUE",
        "id_usuario": "670da26663a87b35ae084edb",
        "itens": [
            {
                "id": "671ad250701807caacc72715",
                "nome": "pudim fatia",
                "quantidade": 1,
                "descricao": "asdasdasdas",
                "precoUnitario": 5,
                "pesoUnitario": 5,
                "id_produto": "66e8a98924f2bacc7f680322",
                "id_pedido": "671ad221701807caacc72712",
                "sabor": "",
                "produto": {
                    "id": "66e8a98924f2bacc7f680322",
                    "imagem": "https://raw.githubusercontent.com/joaoksaas/imagens/main/doces/pudim.jpg",
                    "nome": "pudim fatia",
                    "preco": 5,
                    "peso": 5,
                    "sabores": [
                        "NENHUM SABOR"
                    ],
                    "desativado": false
                }
            },
            {
                "id": "671ad247701807caacc72713",
                "nome": "coelhinho",
                "quantidade": 1,
                "descricao": "",
                "precoUnitario": 35,
                "pesoUnitario": 250,
                "id_produto": "66e8aa8d24f2bacc7f680324",
                "id_pedido": "671ad221701807caacc72712",
                "sabor": "LEITE_NINHO",
                "produto": {
                    "id": "66e8aa8d24f2bacc7f680324",
                    "imagem": "https://raw.githubusercontent.com/joaoksaas/imagens/main/doces/coelhinho.jpg",
                    "nome": "coelhinho",
                    "preco": 35,
                    "peso": 250,
                    "sabores": [
                        "BRIGADEIRO",
                        "BEIJINHO",
                        "LEITE NINHO",
                        "NESQUIK",
                        "MARACUJÁ",
                        "DOCE DE LEITE",
                        "NINHO COM NEGRESCO",
                        "NINHO COM NUTELLA"
                    ],
                    "desativado": false
                }
            },
            {
                "id": "671ad24b701807caacc72714",
                "nome": "brigadeiro",
                "quantidade": 1,
                "descricao": "",
                "precoUnitario": 2353,
                "pesoUnitario": 500,
                "id_produto": "67070952ff73c9c1eb9fa0d5",
                "id_pedido": "671ad221701807caacc72712",
                "sabor": "",
                "produto": {
                    "id": "67070952ff73c9c1eb9fa0d5",
                    "imagem": "https://i.panelinha.com.br/i1/228-q-2859-brigadeiro.webp",
                    "nome": "brigadeiro",
                    "preco": 2353,
                    "peso": 500,
                    "sabores": [
                        "BRIGADEIRO"
                    ],
                    "desativado": false
                }
            }
        ]
    }

    let totaldoPedido = 0.0

    const titulosRelatorio = ["Nome", "Status", "Datas", "Itens", "Valor Total",]
    const fontSizes = ["text-[1.5rem]", "text-[1.25rem]", "text-[1.00rem]"]
    return <>
        {/* PÁGINA NORMAL */}
        <div className="print:hidden text-[2rem] border-t-[1px] h-[100%] border-black bg-brandMarromFundo flex">

            <div className="w-[20%] border-r-[1px] border-black">
                <div name="pedido" className="ml-2 mr-4">
                    <p className="ml-2">Nome: {pedido.cliente.nome} </p>
                    <p className="ml-2 print:opacity-0">Pedido: {pedido.id}</p>
                    <p className="ml-2">Status: {pedido.status}</p>
                    <p className="ml-2">Data Inicial: {pedido.dataPedido || "--/--/----"}</p>
                    <p className="ml-2">Data Final: {pedido.dataFinalPedido || "--/--/----"}</p>
                </div>
            </div>
            <div className="w-[60%] border-r-[1px] border-black">
                <div name="produto" className="flex flex-col ml-4 mr-4 mt-2 mb-2">
                    {
                        pedido.itens.map((itemPedido, index) => {
                            totaldoPedido += itemPedido.quantidade * itemPedido.precoUnitario;
                            return (
                                <div key={index} className={"flex items-center justify-between gap-10"}>
                                    <div className={`h-full w-full`}>
                                        <p><strong>Item:</strong> <a href={`/produto/${itemPedido.nome}`} target="_blank" className="underline">{formatString(itemPedido.nome)}</a></p>
                                        {itemPedido?.sabor && <p><strong>Sabor:</strong> {formatarSabores(itemPedido.sabor)}</p>}
                                        {itemPedido.descricao && <p><strong>Personalização:</strong></p>}
                                        {itemPedido.descricao && <p className={`h-full w-full max-h-[20rem] overflow-x-hidden ${itemPedido?.descricao?.length >= 25 ? 'overflow-y-scroll border-[1px] border-black shadow-xl bg-brandAmareloInput' : ''}`}>{itemPedido.descricao}</p>}
                                        <p><strong>Quantidade:</strong> {itemPedido.quantidade} unidade(s)</p>
                                        <p><strong>Preço Unitário:</strong> {floatToBrl(itemPedido.precoUnitario)}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div className="w-[20%] mt-2 ml-2">
                <div name="valor" className="h-full">
                    <p className="ml-2">Valor Total: {floatToBrl(totaldoPedido)}</p>
                </div>
            </div>
        </div>
    </>

}