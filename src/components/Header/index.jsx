"use client"
import { useEffect, useState } from "react";
import ModalUsuario from "../ModalUsuario";
import LogoSvg from "../LogoSvg";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";

export default function Header({ setBuscar, buscar }) {


    const { carrinho, setCarrinho } = pegarUsuario()

    // CUIDA DA BARRA DE BUSCA
    const [valorBarraDeBusca, setValorBarraDeBusca] = useState("")
    function handleBarraDeBusca(valor) {
        if (!!setBuscar) { setBuscar(valor) }
        setValorBarraDeBusca(valor)
    }

    const [modalUsuarioAtivo, setModalUsuarioAtivo] = useState(false)

    const [mudarFundoHeader, setMudarFundoHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setMudarFundoHeader(true);
            } else {
                setMudarFundoHeader(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!!buscar) {
            handleBarraDeBusca(buscar)
        }
    }, [buscar])

    useEffect(() => {
        console.log(carrinho)
        console.log("carrinho")
    }, [carrinho])

    return (
        <header className={`pt-[2rem] md:pt-2 py-2 md:py-1 transition-all duration-[0.4s] ease-in-out print:hidden z-[500] ${mudarFundoHeader ? 'bg-[#9e6c43] bg-opacity-50 backdrop-blur-md' : ''} w-full flex justify-center xl:justify-between items-center gap-2 md:gap-0 mb-[15px] text-[#e0c48d] fixed top-0 left-0 px-[5%]`}>

            <div className={`hidden ml-[-1.5%] pr-2 md:pr-0 md:ml-0 xs:flex items-center justify-start w-[10.3rem] xl:w-fit ${!mudarFundoHeader ? "hover:opacity-80" : "" } hover:scale-110 transition-all duration-500 ease-in-out`}>
                <a href="/..">
                    <LogoSvg properties={"w-[6rem] md:w-[10.33rem]"} />
                </a>
            </div>

            {/* BARRA DE BUSCA */}
            <div className="pr-[2.5%] md:pr-0 text-[1.5rem] md:text-[2rem] rounded-[5px] mx-[1%] md:mx-[46px] bg-brandMarrom w-full max-w-[856px] h-[57px] flex justify-between items-center print:opacity-0">
                <div className="rounded-[5px] bg-brandMarrom w-[5.7rem] h-[5.7rem] flex items-center justify-center">
                    <a href="/..">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="max-w-[3rem] md:max-w-full w-full h-full hover:opacity-80 hover:scale-110 transition-all duration-500 ease-in-out">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </a>
                </div>
                <input
                    type="search"
                    placeholder="Buscar produto"
                    className={`text-[1rem] sm:text-[1.5rem] pl-[2.5%] placeholder:text-brandAmareloInput w-full h-full bg-transparent`}
                    onChange={(e) => { handleBarraDeBusca(e.target.value) }}
                    defaultValue={valorBarraDeBusca}
                    value={valorBarraDeBusca}
                />

                <a href={`/?buscar=${valorBarraDeBusca}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[3rem] md:w-[4.2rem] md:mr-[1.1rem]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </a>
            </div>


            {/* CARRINHO */}
            <button
                className={`flex rounded-[5px] h-[5.7rem] bg-brandMarrom w-full max-w-[10%] md:w-[25.2rem] md:max-w-[25.2rem] items-center justify-center mr-[1%] md:mr-[7.1rem] text-[2rem] print:opacity-0 relative`}
                type="button"
                onClick={() => {
                    window.location.href = '/carrinho'; // Redirecionamento após executar a função
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full max-w-[3.8rem]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {carrinho?.itens?.length > 0 && <>
                    <div className="bg-brandAmareloInput w-[2rem] h-[2rem] absolute bottom-[-0.5rem] smd:hidden rounded-[50%] text-[1.2rem] flex items-center justify-center text-white">
                        {carrinho?.itens?.length}
                    </div>
                </>}

                <span className="hidden smd:block mb-1">
                    <p className="">CARRINHO</p>
                    {carrinho?.itens?.length > 0 && <>
                        <p className="text-[1.5rem] text-start mt-[-0.8rem] pl-1">{carrinho?.itens?.length} itens</p>
                    </>}
                </span>
            </button>
            {/* FOTO DE PERFIL */}
            <div className="w-full max-w-[10%] md:max-w-[5%]">

                <div
                    className={`relative flex items-center justify-center rounded-[5px] bg-brandMarrom mx-auto w-full md:max-w-[5.7rem] h-[5.7rem] text-[2rem] print:opacity-0`}>

                    <button onClick={() => { setModalUsuarioAtivo(!modalUsuarioAtivo) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full max-w-[3.8rem]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </button>
                    {modalUsuarioAtivo && <ModalUsuario />}

                </div>
            </div>

        </header>


    )
}