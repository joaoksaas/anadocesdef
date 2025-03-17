import Header from "@/components/Header";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ModalUsuario() {
    const { usuario, setUsuario } = pegarUsuario()
    const router = useRouter()
    function deslogar() {
        localStorage.removeItem("carrinho")
        let newUsuario = {}
        Object.keys(usuario).map(key => {
            newUsuario[key] = null
            localStorage.setItem(key, "")
            location.reload()
        })
        setUsuario(newUsuario)
        router.push("/")
    }

    useEffect(() => {
        console.log(usuario)
        console.log("usuario")
    },[])


    return (
        <div className={`text-[2rem] flex flex-col w-[17rem] items-center absolute left-[-5.515rem] bg-brandMarromClaro text-brandMarromClaro rounded-[6px] z-500 ${usuario?.cargo == "admin" ? "h-[18rem] bottom-[-18rem]" : " h-[6rem] bottom-[-6rem]"}`}>
            {usuario?.email ? <a href="/perfil" className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227] rounded-t-[6px]" >Meu Perfil</a> : <a href="/login" className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227] rounded-t-[6px]">Login</a>}
            {(usuario?.email && usuario?.cargo == "admin") &&  <a href="/produto/registrar" className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227]">Novo Produto</a>}
            {(usuario?.email && usuario?.cargo == "admin") &&  <a href="/relatorio" className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227]">Relatório</a>}
            {(usuario?.email && usuario?.cargo == "admin") &&  <a href="/pedidos" className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227]">Pedidos</a>}
            {(usuario?.email && usuario?.cargo == "admin") &&  <a href="/sabores/editar" className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227]">Sabores</a>}
            {usuario?.email ? <button onClick={deslogar} className="bg-brandMarrom h-full max-h-[3rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227] rounded-b-[6px]">Encerrar Sessão</button> : <a href="/cadastro" className="bg-brandMarrom h-full max-h-[6rem] text-brandAmareloInput w-full text-center hover:opacity-50 transition-all duration-200 hover:bg-[#423227] rounded-b-[6px]">Cadastre-se</a>}
        </div>
    );
}