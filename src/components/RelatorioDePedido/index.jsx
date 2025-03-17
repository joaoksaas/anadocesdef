import { barraParaTraco, floatToBrl, formatarSabores, formatString } from "@/utils/functions";
import { useEffect, useState } from "react"
import LogoSvg from "../LogoSvg";




export default function RelatorioDePedido({ produtosSelecionados, produtos, pedido, index, filtrosAtivos }) {

    let pedidoExemplo = {
        "cliente": {
            "nome": "daniel",
            "email": "daniel@gmail.com",
            "cargo": "usuario",
            "telefone": "(12)34567-8910",
            "id": "672576115f46fcf5b86eb751"
        },
        "id": "672576115f46fcf5b86eb752",
        "dataPedido": "",
        "dataFinalPedido": "",
        "status": "PENDENTE",
        "id_usuario": "672576115f46fcf5b86eb751",
        "itens": [
            {
                "id": "6725762b5f46fcf5b86eb753",
                "nome": "pudim fatia",
                "quantidade": 1,
                "descricao": "",
                "precoUnitario": 5,
                "pesoUnitario": 5,
                "id_produto": "66e8a98924f2bacc7f680322",
                "id_pedido": "672576115f46fcf5b86eb752",
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
                "id": "6725878b5f46fcf5b86eb754",
                "nome": "ovo com bombom (500g)",
                "quantidade": 1,
                "descricao": "",
                "precoUnitario": 555.77,
                "pesoUnitario": 500,
                "id_produto": "66e8d049bf785a6423a65c31",
                "id_pedido": "672576115f46fcf5b86eb752",
                "sabor": "",
                "produto": {
                    "id": "66e8d049bf785a6423a65c31",
                    "imagem": "https://raw.githubusercontent.com/joaoksaas/imagens/main/doces/ovo%20com%20bombom.jpg",
                    "nome": "ovo com bombom (500g)",
                    "preco": 555.77,
                    "peso": 500,
                    "sabores": [
                        "BRIGADEIRO",
                        "BEIJINHO",
                        "LEITE NINHO",
                        "NESQUIK",
                        "MARACUJÁ",
                        "DOCE DE LEITE"
                    ],
                    "desativado": false
                }
            }
        ]
    }

    const [totalDoPedido, setTotalDoPedido] = useState(0.0)
    useEffect(() => {
        calcularTotalDoPedido()
    })
    const calcularTotalDoPedido = () => {
        let novoTotaldoPedido = 0.0
        pedido?.itens?.map(itemPedido => {
            novoTotaldoPedido += itemPedido.quantidade * itemPedido.precoUnitario
        })
        setTotalDoPedido(novoTotaldoPedido)
        return novoTotaldoPedido
    }
    function idParaNomeProduto(id) {
        let nomeProduto = ""
        produtos.map(produto => {
            if (produto.id == id) {
                nomeProduto = produto.nome
            }
        })
        return nomeProduto
    }
    let mostrarFiltros = false
    Object.keys(filtrosAtivos).map(key => {
        let value = filtrosAtivos[key]
        if (!!value && value != "TUDO" && value.length != 0) mostrarFiltros = true
    })
    return <>

    
        {/* PÁGINA DOS PRINTS */}
        <div className={`screen:hidden pointer-events-none border ${index == 0 ? "print:border-t-2 screen:border-t mt-10" : "border-t-0"} border-b-0 border-black print:block text-[1.5rem]`}>
            <table className="min-w-full border-collapse">
                {
                    index == 0 && <>
                        <thead>
                            <tr>

                                <th className="border-b border-black p-2 bg-brandMarromFundo">
                                    Dados do Pedido
                                </th>
                                <th className="border-b border-l border-black p-2 bg-brandMarromFundo">
                                    Itens
                                </th>

                            </tr>
                        </thead>
                    </>
                }

                <tbody className="bg-brandMarromFundoClaro border-b-[1px] border-black">
                    <tr>
                        <div className="">
                            <div className="p-2">
                                Cliente: {pedido.cliente.nome?.toUpperCase() || "NÃO IDENTIFICADO"}
                            </div>
                            <div className="p-2">
                                Status: <span className={`${pedido.status == "CANCELADO" ? "text-red-400" : pedido.status == "INADIMPLENTE" ? "text-red-500 font-bold" : pedido.status == "PENDENTE" ? "text-gray-800" : pedido.status == "PAGO" ? "text-[#25a830] font-bold " : pedido.status == "ENTREGUE" ? "text-[#4235f7] font-bold" : ""}`}>{pedido.status}</span>
                            </div>
                            <div className="p-2">
                                <div className="flex">
                                    <div className="w-fit text-end pr-[2.25rem]">Data do registro:</div>
                                    {pedido.dataPedido || "--/--/----"}
                                </div>
                                <div className="flex">
                                    <div className="w-fit text-end pr-[0.5rem]">Data da conclusão:</div>
                                    {pedido.dataFinalPedido || "--/--/----"}
                                </div>
                            </div>
                            <div className="p-2">
                                Valor total: <strong>{floatToBrl(totalDoPedido)}</strong>
                            </div>

                        </div>

                        <td className={`w-[60%] border border-r-0 border-b-0 border-t-0 border-black mr-[-2rem]`}>

                            {
                                pedido.itens.map((itemPedido, ind) => {

                                    return (
                                        <>
                                            <div key={ind} className="relative py-2 pl-4">
                                                {ind > 0 && <div className="w-[100.5%] border-t border-black h-[1px] absolute top-0 left-[-0.1rem]" />}
                                                <div className="h-full mt-[2%]">
                                                    <div className="flex gap-2">
                                                        <p className="text-end">Item:</p>
                                                        {formatString(itemPedido.nome)}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <p className="text-end">Sabor:</p>
                                                        {formatString(itemPedido.sabor) || "- - - -"}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <p className="text-end">Personalização:</p>
                                                        {formatString(itemPedido.descricao) || "- - - -"}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <p className="text-end">Quantia:</p>
                                                        {itemPedido.quantidade}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <p className="text-end">Total:</p>
                                                        <div className="w-full flex items-end">

                                                            <div>
                                                                {floatToBrl(itemPedido.precoUnitario * parseFloat(itemPedido.quantidade))}
                                                            </div>
                                                            <div>
                                                                <span className="text-[1.25rem] pl-2">{"("}{floatToBrl(itemPedido.precoUnitario)} un.{")"}</span>
                                                            </div>
                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </>

}