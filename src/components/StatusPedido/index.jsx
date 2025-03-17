import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { api } from "@/services/api"



export default function Pedidos() {
    const [pedidosLidos, setPedidosLidos] = useState(false)
    const [pedidos, setPedidos] = useState([])
    async function listarPedidos() {
        setPedidosLidos(true)
        const response = await api.post(`/api/pedidos/listar-pedidos`).then(({ data }) => { return data })
        let novoPedidos = []
        await Promise.all(
            response.map(async pedido => {
                let novoPedido = { ...pedido, itens: [] }
                pedido.itens.map(async itemPedidoID => {
                    console.log(itemPedidoID)
                    const itemPedido = await api.post(`/api/pedidos/item-pedido-por-id`, { id: itemPedidoID }).then(({ data }) => { return data })
                    novoPedido.itens.push(itemPedido)
                })
                novoPedidos.push(novoPedido)
            })
        )

        setPedidos(novoPedidos)

        console.log(novoPedidos)
        console.log("novoPedidos")
    }
    useEffect(() => {
        if (!pedidosLidos) {
            listarPedidos()
        }
    }, [])

    return (
        <div className="text-[3rem]">
            <Header />
            <div className="w-full h-full bg-red-500 text-[5rem] border-[1px] border-black">
                <h1 className="">Total de pedidos: {pedidos.length}</h1>
            </div>
            
            
            {pedidos.map(pedido => {
                console.log(pedido, "xD")
                return(
                    <>
                    <div className="flex border-[1px] border-black w-full">
                        <div className="bg-yellow-500 w-[30%]">
                            <h1>ID do Usuário</h1>
                            {pedido.id_usuario}
                        </div>

                        <div className="bg-gray-500 w-[40%]">
                        <h1>Pedido: </h1>
                        {pedido.itens.map(itemPedido => {
                                return<div className="bg-green-500 m-10">
                                        <p>Item: itemblablabla :D</p>
                                        <p>Descrição: {itemPedido.descricao}</p>
                                        <p>Preço: mil reais</p>
                                </div>    
                        })}
                        </div>

                        <div>
                            Total do Pedido:

                        </div>
                        
                    </div>
                    </>
                    
                )
            })}
        </div>

    );
}