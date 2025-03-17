import React, { useState } from 'react';
import { avisoAlerta, avisoErro, avisoSucesso } from '../Aviso';

const RedefinirSenha = ({ email }) => {
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senhaNova !== confirmarSenha) {
      setMessage('As senhas não coincidem.');
      avisoErro('As senhas não coincidem.')
      return;
    }

    const response = await fetch('/api/redefinir-senha/atualizar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senhaNova }),
    });

    const result = await response.json();
    setMessage(result.message);
  };

  return (
    <div className="mx-auto flex flex-col w-[100%] pb-[1rem] bg-brandMarromFundo shadow-xl rounded-[1rem] ">
      <div className='mx-auto'>
        <h2 className='text-[4.8rem] '>Redefinir Senha</h2>
      </div>

      <div className='flex mt-8 h-full w-full '>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className='flex justify-between'>
            <label className="text-[3rem]">
              Nova Senha:
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-[250px] text-[2rem]"
              type="password"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              required
            />
          </div>
          
          <div className='flex '>
            <label className="text-[3rem]">
              Confirmar Nova Senha:
            </label>
            <input
              className="border border-gray-300 p-2 rounded w-[250px] text-[2rem]"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>
          
          <div className='flex justify-center'>
            <button 
              type="submit" 
              className="bg-brandMarrom text-brandAmareloInput w-[16rem] h-[4rem] rounded hover:opacity-80 transition-all duration-200 text-[2rem]"
            >
              Redefinir Senha
            </button>
          </div>
        </form>
      </div>

      {message && <p className="mt-4 text-center text-[4rem]">{message}</p>}

      <a href='../login' className=" text-brandMarromClaro w-[30.8rem] h-[8rem] rounded-[6px] text-[2rem] hover:opacity-80 transition-all duration-200" >Ir para login</a>
    </div>
  );
};

export default RedefinirSenha;
