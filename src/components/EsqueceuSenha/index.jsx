"use client";
import { useState } from "react";
import { avisoErro, avisoSucesso } from "../Aviso";

export default function RecuperarSenha() {
    const [formulario, setFormulario] = useState({ email: '' });

    const enviarEmail = async () => {
        const res = await fetch('/api/enviar-email/enviar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formulario.email })
        });
        if (res.ok) {
            avisoSucesso("Email enviado!");
            console.log(email)
        } else {
            avisoErro("Erro ao enviar o email.");
            console.log(formulario.email)
        }
    };

    return (
        <>
            <div className="w-[75%] h-[72rem] bg-brandMarromFundo mx-auto shadow-xl rounded-[1rem]">
                <div name="top" className="bg-brandMarromFundo h-[36%] w-full flex flex-col items-center justify-center pt-[8rem] rounded-[1rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[10rem]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <h1 className="text-[5rem]"><strong>Digite seu e-mail para recuperar sua senha.</strong></h1>
                </div>
                <div name="mid" className="bg-brandMarromFundo h-[45%] w-full flex flex-col items-center justify-center gap-2">
                    <div name="email" className="p-[1rem] text-[3.2rem] w-[65%]">
                        <p className="w-[30%]">E-mail:</p>
                        <input
                            type="search"
                            placeholder="Digite aqui..."
                            className="text-brandMarrom w-full bg-brandAmareloInput border-[1px] rounded-[8px] placeholder:text-quaternaria border-black pl-1 placeholder:opacity-50"
                            onChange={(e) => { setFormulario({ email: e.target.value }) }}
                            value={formulario.email}
                        />
                    </div>
                    <div>
                    <button type="button" onClick={enviarEmail} className="bg-brandMarrom text-brandMarromClaro w-[30.8rem] h-[8rem] rounded-[6px] text-[3.8rem] hover:opacity-80 transition-all duration-200">Mudar Senha</button>
                    </div>
                </div>
            </div>
        </>
    );
}
