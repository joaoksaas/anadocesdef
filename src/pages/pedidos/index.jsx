import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { api } from "@/services/api"
import Pedidos from "@/components/Pedidos";
import Loader from "@/components/Loader";



export default function PaginaPedidos() {

    const [carregando, setCarregando] = useState(true)
    
    return (
        <>
            <Header />
            <Loader carregando={carregando} />
            <div className="h-full flex items-center justify-center">
                <Pedidos setLoader={setCarregando} />
            </div>
        </>
    );
}