import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { useState } from "react";
import { avisoErro, avisoSucesso } from "../Aviso";

export default function TrocarSenha() {
    const { usuario } = pegarUsuario();
    const [formulario, setFormulario] = useState({
        senhaAtual: '',
        senhaNova: '',
        confirmacaoSenha: ''
    });

    async function Enviar() {

        if (formulario.senhaNova !== formulario.confirmacaoSenha) {
            avisoErro("As senhas não coincidem!");
            return;
        }

        try {
            const response = await fetch('/api/usuarios/validar-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email, senha: formulario.senhaAtual })
            });

            const isValidPassword = await response.json();

            if (isValidPassword) {
                const responseUpdate = await fetch('/api/usuarios/atualizar-senha', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: usuario.email, senhaNova: formulario.senhaNova })
                });

                if (responseUpdate.ok) {
                    avisoSucesso("Senha atualizada com sucesso!");
                } else {
                    avisoErro("Erro ao atualizar a senha.");
                }
            } else {
                avisoErro("Senha atual incorreta!");
            }
        } catch (error) {
            console.error("Erro ao enviar requisição:", error);
        }
    }

    return (
        <div className="bg-brandMarromFundo w-[100%] h-[full] p-4">
            <div className="flex items-center p-[1rem] text-[3.2rem] w-full">
                <p className="w-[30%]">Senha atual:</p>
                <input
                    type="password"
                    placeholder="Digite aqui..."
                    className="w-[70%] bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                    onChange={(e) => setFormulario({ ...formulario, senhaAtual: e.target.value })}
                    value={formulario.senhaAtual}
                />
            </div>

            <div className="flex items-center p-[1rem] text-[3.2rem] w-full">
                <p className="w-[30%]">Nova senha:</p>
                <input
                    type="password"
                    placeholder="Digite aqui..."
                    className="w-[70%] bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                    onChange={(e) => setFormulario({ ...formulario, senhaNova: e.target.value })}
                    value={formulario.senhaNova}
                />
            </div>

            <div className="flex items-center p-[1rem] text-[3.2rem] w-full">
                <p className="w-[30%]">Confirmar Senha:</p>
                <input
                    type="password"
                    placeholder="Digite aqui..."
                    className="w-[70%] bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                    onChange={(e) => setFormulario({ ...formulario, confirmacaoSenha: e.target.value })}
                    value={formulario.confirmacaoSenha}
                />
            </div>
            
            <div className="flex items-center mt-[10rem] text-[3.2rem] w-full">
                <button
                    type="button"
                    onClick={Enviar}
                    className="bg-brandMarrom text-brandAmareloInput w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200"
                >
                    Mudar Senha
                </button>
            </div>
        </div>
    );
}
