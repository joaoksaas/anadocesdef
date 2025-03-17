import { useState } from 'react';
import RedefinirSenha from '../RedefinirSenha';

function VerifyOTP() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(false); // Adiciona estado para verificação

    const handleChange = (element, index) => {
        const value = element.value.replace(/[^0-9]/g, ''); // Remove todos os caracteres não numéricos

        setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

        if (element.nextSibling && value) {
            element.nextSibling.focus();
        }
    };

    const handlePaste = (e) => {
        const pasteData = e.clipboardData.getData('text').replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
        const pasteArray = pasteData.split('');
        if (pasteArray.length === otp.length) {
            setOtp(pasteArray);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email');
        const otpValue = otp.join('');
        const response = await fetch('/api/redefinir-senha/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: otpValue }),
        });

        const result = await response.json();
        console.log('OTP API response:', result); // Log da resposta da API
        setMessage(result.message);
        

        if (result.success) {
            setVerified(true); // Atualiza estado para verificação
            console.log('OTP verificado com sucesso'); // Adiciona log
        } else {
            console.log('Falha na verificação do OTP'); // Adiciona log para falha na verificação
        }
    };

    console.log('Verified state:', verified); // Log para verificar estado de verificação

    if (verified) {
        return <RedefinirSenha email={localStorage.getItem('email')} />;
    }

    return (
        <div className="mx-auto flex flex-col w-[100%] pb-[1rem] bg-brandMarromFundo shadow-xl rounded-[1rem]">
            <div className='mx-auto'>
            <h2 className='text-[4.8rem] '>Digite o código OTP</h2>
            </div>
            <div className='flex justify-center mt-8'>
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <label className="text-[3rem]">Código OTP:</label>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            name="otp"
                            maxLength="1"
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => handleKeyDown(e, index)}
                            onFocus={handleFocus}
                            onPaste={handlePaste}
                            style={{
                                width: "4rem",
                                height: "4rem",
                                margin: "0.5rem",
                                textAlign: "center",
                                fontSize: "2rem",
                                borderRadius: "0.25rem",
                                border: "1px solid #ccc"
                            }}
                        />
                    ))}
                </div>
                <button type="submit " className="bg-brandMarrom text-brandAmareloInput w-[10rem] h-[4rem] rounded hover:opacity-80 transition-all duration-200 text-[2rem]">Verificar</button>
            </form>
            </div>
            <div className='w-full pt-[5rem]'>
            <a href='/esqueci-senha' className=" text-brandMarromClaro w-[30.8rem] h-[8rem] rounded-[6px] text-[2rem] hover:opacity-80 transition-all duration-200">Voltar para E-mail</a>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default VerifyOTP;
