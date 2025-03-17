import { useState } from 'react';
import VerifyOTP from '../VerifyOTP';

function PasswordResetRequest({ setCarregando }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Estado para controlar a renderização de VerifyOTP

  const handleSubmit = async (e) => {
    setCarregando(true)
    try{
      e.preventDefault();

      // Armazenar email no localStorage para usar depois
      localStorage.setItem('email', email);
  
      const response = await fetch('/api/redefinir-senha/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
      setMessage(result.message);
  
      if (result.success) {
        setOtpSent(true); // Atualizar estado para renderizar VerifyOTP
      }
    }
    finally{
      setCarregando(false)
    }
    

  };

  if (otpSent) {
    return <VerifyOTP />;
  }

  return (
    <div className="mx-auto flex flex-col w-[100%] pb-[1rem] bg-brandMarromFundo shadow-xl rounded-[1rem]">
      <div className=' mx-auto'> 
        <h2 className='text-[4.8rem] '>Recuperar Senha</h2>
      </div>
      
      <div className='flex justify-center mt-8'>
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          {/* Label e input alinhados */}
          <label className="text-[3rem]">
            Email:
          </label>
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-[250px] text-[2rem]" // Definindo tamanho do input
          />
          
          {/* Botão */}
          <button type="submit" className="bg-brandMarrom text-brandAmareloInput w-[10rem] h-[4rem] rounded hover:opacity-80 transition-all duration-200 text-[2rem]">
            Enviar
          </button>
        </form>
      </div>
      
      {message && <p className="text-red-500 mt-4 text-center">{message}</p>}
    </div>
  );
}

export default PasswordResetRequest;
