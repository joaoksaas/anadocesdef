import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario"; // Importa o contexto do usuário
import { formatString } from "@/utils/functions";
import Loader from "../Loader";

export default function PerfilC({ setCarregando }) {
    const { usuario, setUsuario, usuarioCarregado } = pegarUsuario();
    async function lerUsuario(email) {
        try {
            const response = await api.post("/api/usuarios/usuario-por-email", {
                email: email
            });
            const data = response.data;
            console.log("Dados recebidos:", data);
            setUsuario({
                nome: data.nome,
                email: data.email,
                cpf: data.cpf,
                telefone: data.telefone,
                cargo: data.cargo
            });
        } catch (error) {
            console.log("Erro em ler Usuario:", error.message);
        } finally {
            console.log("fim!");
            setCarregando(false)
        }
    }

    useEffect(() => {
        if (usuario?.email) lerUsuario(usuario.email)
    }, [usuarioCarregado]);

    return (
        <>
            <div className="mx-auto flex w-[75%] h-[690px] bg-brandMarromFundo shadow-xl rounded-[1rem]">
                <div className="w-[50%]">
                    <h1 className="text-[4.8rem] pt-32 text-center">Seu Perfil</h1>
                    <img className="w-[324px] h[324px] mx-auto pt-16"
                        src="https://raw.githubusercontent.com/joaoksaas/imagens/main/icons/avatar.png"
                        alt="Descrição da imagem"
                    />
                    <h1 className="text-[3.2rem] text-center pt-2">{formatString(usuario.nome)}</h1>
                </div>
                <div className="w-[50%]">
                    <h1 className="text-[4.8rem] pt-32 text-center">Suas Informações</h1>
                    <p className="text-[3.6rem]">Nome: {formatString(usuario.nome)}</p>
                    <p className="text-[3.6rem]">Email: {usuario.email}</p>
                    <p className="text-[3.6rem]">CPF: {usuario.cpf}</p>
                    <p className="text-[3.6rem]">Telefone: {usuario.telefone}</p>

                    <a href="/pedidos" className="text-brandMarromClaro w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200"><p>Pedidos</p></a>

                    <a href="/mudar-senha" className="text-brandMarromClaro w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200">Mudar Senha</a>

                </div>
            </div>
        </>
    );
}