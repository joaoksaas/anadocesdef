import { useState } from "react";
import Header from "../Header";
import { avisoErro, avisoInfo, avisoSucesso } from "../Aviso";
import { formatarCPF, formatarCelular } from "@/utils/functions";




export default function FormularioCadastro({ setCarregando }) {
    const [formulario, setFormulario] = useState({ nome: '', email: '', senha: '', confsenha: '', cpf: '', telefone: '' });
    async function cadastrar() {
        if (!formulario.nome.replace(/ /g,"")) {
            avisoErro("Nome inválido!");
            return;
        }
        if (!formulario.email.replace(/ /g,"")) {
            avisoErro("E-mail inválido!");
            return;
        }
        if (!formulario.senha) {
            avisoErro("Senha inválida!");
            return;
        }
        if (formulario.senha !== formulario.confsenha) {
            avisoErro("As senhas não coincidem!");
            return;
        }
        if (formulario.cpf.length < 14) {
            avisoErro("Cpf inválido!");
            return;
        }
        if (formulario.telefone.length < 14) {
            avisoErro("Número de telefone inválido!");
            return;
        }
        try {
            setCarregando(true)
            const response = await fetch('/api/usuarios/criar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: formulario.nome,
                    email: formulario.email,
                    senha: formulario.senha,
                    cargo: "usuario",
                    cpf: formulario.cpf,
                    telefone: formulario.telefone
                })
            });

            if (response.ok) {
                const data = await response.json();
                avisoSucesso("Usuário cadastrado com sucesso!");
                setFormulario({ nome: '', email: '', senha: '', confsenha: '', cpf: '', telefone: '' });
            } else {
                avisoErro("Falha ao cadastrar o usuário. Verifique os dados.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar o usuário:", error);
            avisoErro("Erro no servidor. Tente novamente mais tarde.");
        } finally {
            setCarregando(false)
        }

    }

    return (
        <>
            <div className="w-[75%] h-[120rem] mx-auto shadow-xl rounded-[1rem]">
                <div name="top" className="bg-brandMarromFundo h-[36%] w-full flex flex-col items-center justify-center pb-[9.5rem] rounded-t-[1rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[10rem]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <h1 className="text-[5rem]"><strong>CADASTRO DE USUÁRIO</strong></h1>
                </div>
                <form onSubmit={(e)=>{e.preventDefault()}} name="mid" className="bg-brandMarromFundo h-[45%] w-full flex flex-col items-center justify-center gap-2">
                    <div name="nome" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p>Nome Completo:</p>
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ ...formulario, nome: e.target.value }) }}
                            value={formulario.nome}
                        />
                    </div>
                    <div name="email" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p>E-mail:</p>
                        <input
                            type="email"
                            required={true}
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ ...formulario, email: e.target.value }) }}
                            value={formulario.email}
                        />
                    </div>
                    <div name="senha" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p>Senha:</p>
                        <input
                            type="password"
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ ...formulario, senha: e.target.value }) }}
                            value={formulario.senha}
                        />
                    </div>
                    <div name="confirma-senha" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p>Confirmar Senha:</p>
                        <input
                            type="password"
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ ...formulario, confsenha: e.target.value }) }}
                            value={formulario.confsenha}
                        />
                    </div>
                    <div name="cpf" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p>CPF:</p>
                        <input
                            type="text"
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ ...formulario, cpf: formatarCPF(e.target.value) }) }}
                            value={formulario.cpf}
                        />
                    </div>
                    <div name="telefone" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p>Telefone:</p>
                        <input
                            type="phone"
                            placeholder="Digite aqui..."
                            className="w-full bg-brandAmareloInput rounded-[8px] placeholder:text-quaternaria border-[1px] border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ ...formulario, telefone: formatarCelular(e.target.value) }) }}
                            value={formulario.telefone}
                        />
                    </div>

                    <div className="pt-[2rem]">
                        <button onClick={cadastrar} type="submit" className="bg-brandMarrom text-[#e0c48d] w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200">Criar Cadastro</button>
                    </div>
                </form>
                <div name="bot" className="bg-brandMarromFundo h-[19%] w-full flex flex-col items-center justify-center pt-[12rem] rounded-b-[1rem]">
                    <p className="text-[2rem]">Já possui conta? <a href="/login"><strong>Login</strong></a></p>
                </div>
            </div>
        </>
    );
};
