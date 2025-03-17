"use client"
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { api } from "@/services/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { avisoErro, avisoInfo } from "../Aviso";

export default function FormularioLogin() {
    const { usuario, setUsuario } = pegarUsuario()
    const [formulario, setFormulario] = useState({ email: '', senha: '' });
    const router = useRouter()
    async function Logar() {
        localStorage.removeItem("carrinho")
        if (!formulario.email) { avisoErro("Por favor, insira um e-mail."); return }
        if (!formulario.senha) { avisoErro("Por favor, insira uma senha."); return }
        try {
            const usuarioValido = await api.post("/api/usuarios/validar-login", { ...formulario }).then(({ data }) => { return data })
        if (usuarioValido) {
            const dadosDoUsuario = await api.post("/api/usuarios/usuario-por-email", { ...formulario }).then(({ data }) => { return data })
            setUsuario({ ...dadosDoUsuario })
            router.push('/');
        } else {
            avisoErro("Usuário inválido!")
        }
        } catch (error) {
            avisoErro("Senha ou E-mail inválidos!")
        }
    }
    const handleKeyDown = (event) => {
        if (event?.code?.toLowerCase().includes("enter")) { Logar() }
    };
    return (
        <>
            <div className="scale-[70%] w-[100%] sm:scale-[85%] md:scale-[90%] lg:scale-100 sm:w-[97%] lg:w-[75%] h-[72rem] bg-brandMarromFundo mx-auto shadow-xl rounded-[1rem]">
                <div name="top" className="bg-brandMarromFundo h-[36%] w-full flex flex-col items-center justify-center pt-[8rem] rounded-[1rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[10rem]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <h1 className="text-[5rem]"><strong>LOGIN</strong></h1>
                </div>
                <div name="mid" className="bg-brandMarromFundo h-[45%] w-full flex flex-col items-center  justify-center gap-2 ">
                    <div name="email" className="p-[1rem] text-[3.2rem] w-[65%] ">
                        <p className="w-[30%]">E-mail:</p>
                        <input
                            onKeyDown={handleKeyDown}
                            required={true}
                            type="search"
                            placeholder="Digite aqui..."
                            className="text-brandMarrom w-full bg-brandAmareloInput border-[1px] rounded-[8px] placeholder:text-quaternaria  border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ email: e.target.value, senha: formulario.senha }) }}
                            value={formulario.email}
                        />
                    </div>
                    <div name="senha" className="p-[1rem] text-[3.2rem] w-[65%] ">
                        <p className="w-[30%]">Senha:</p>
                        <input
                            onKeyDown={handleKeyDown}
                            required={true}
                            type="password"
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ email: formulario.email, senha: e.target.value }) }}
                            value={formulario.senha}
                        />
                    </div>
                    <div className="pt-[6rem]">
                        <button type="button" onClick={Logar} className="bg-brandMarrom text-[#e0c48d] w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200">Entrar</button>
                    </div>
                </div>
                <div name="bot" className="bg-brandMarromFundo h-[19%] w-full flex flex-col items-center justify-center rounded-[1rem]">
                    <p className="text-[2rem]">Não possui conta? <a href="/cadastro"><strong>Cadastre-se</strong></a></p>
                    <p className="text-[2rem]">Esqueceu a senha? <a href="/esqueci-senha"><strong>Clique aqui</strong></a></p>
                </div>
            </div>
        </>
    );
};