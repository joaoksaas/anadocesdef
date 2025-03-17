import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario"; // Importa o contexto do usuário

export default function Pedido() {
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
                telefone: data.telefone
            });
        } catch (error) {
            console.log("Erro em ler Usuario:", error.message);
        } finally {
            console.log("fim!");
        }
    }

    console.log(usuario)

    useEffect(() => {
        if (usuario?.email) lerUsuario(usuario.email)
    }, [usuarioCarregado]);

    return (
        <>
            <div className="mx-auto flex w-[75%] h-[690px] bg-brandMarromFundo shadow-xl rounded-[1rem]">
                <div className="w-[50%]">
                    <h1 className="text-[4.8rem] pt-32 text-center">Seu Perfil</h1>
                    <img className="w-[324px] h[324px] mx-auto pt-16"
                        src="https://cdn.discordapp.com/attachments/610637336757272715/1276308985317687316/ibagem.png"
                        alt="Descrição da imagem"
                    />
                    <h1 className="text-[3.2rem] text-center pt-2">{usuario.nome}</h1>
                </div>
                <div className="w-[50%]">
                    <h1 className="text-[4.8rem] pt-32 text-center">Suas Informações</h1>
                    <p className="text-[3.6rem]">Nome: {usuario.nome}</p>
                    <p className="text-[3.6rem]">Email: {usuario.email}</p>
                    <p className="text-[3.6rem]">CPF: {usuario.cpf}</p>
                    <p className="text-[3.6rem]">Telefone: {usuario.telefone}</p>

                    <a href="" className="text-brandMarromClaro w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200">Mudar Senha</a>
                </div>
            </div>
        </>
    );
}