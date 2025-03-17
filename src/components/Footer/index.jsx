import React from "react";
import LogoSvgSecundaria from "../LogoSvgSecundaria";
import { useRouter } from "next/router";

const telefone = process.env.NEXT_PUBLIC_TELEFONE


export default function Footer() {
    const router = useRouter()
    const rotaPedidoWhats = `https://api.whatsapp.com/send?phone=${telefone}`
    
    return <>
    
        <footer className="print:hidden bg-[#9e6c43] bg-opacity-50 backdrop-blur-md left-0 bottom-0 w-full flex mt-[2rem] h-[11rem] items-center justify-center shadow-t-[1px] overflow-hidden print:">

            <div name="esquerda" className=' w-[30%] h-full flex justify-center'>
                <div className="opacity-20 absolute bottom-[-7rem] left-[-3rem]">
                    <LogoSvgSecundaria />
                </div>
            </div>

            <div name="meio" className="w-full h-full mt-6 print:opacity-0">
                <div className="w-full mt-4">
                    <div className="text-center pb-1 text-[1.6rem]">
                        Aninha Doces
                    </div>
                    <div className="text-center pb-1 text-[1.6rem]">
                        Feito por Daniel Souza e João Sales
                    </div>
                    <div className="text-center text-[1.6rem]">
                        Ponta Grossa - Paraná
                    </div>
                </div>
            </div>

            <div name="direita" className='w-[30%] flex justify-center h-full pr-16 print:opacity-0'>
                <a href="https://www.instagram.com/_aninha.doces_/" className="mt-[3.45rem] mr-4 w-[3.5rem] h-[3.7rem] text-brandMarrom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.92 63.92"><path clip-rule="evenodd" d="M15.64,31.94c0-9,7.31-16.34,16.31-16.34c9.04,0,16.34,7.34,16.34,16.34c0,9.04-7.31,16.34-16.34,16.34 C22.94,48.29,15.64,40.98,15.64,31.94L15.64,31.94z M48.82,0H15.11C6.81,0,0,6.78,0,15.11v33.71c0,8.29,6.81,15.11,15.11,15.11 h33.71c8.33,0,15.11-6.81,15.11-15.11V15.11C63.92,6.78,57.14,0,48.82,0L48.82,0z M15.11,3.78h33.71c6.25,0,11.33,5.08,11.33,11.33 v33.71c0,6.25-5.08,11.33-11.33,11.33H15.11c-6.25,0-11.33-5.08-11.33-11.33V15.11C3.78,8.86,8.86,3.78,15.11,3.78L15.11,3.78z M52.17,8.54c-1.84,0-3.32,1.48-3.32,3.32c0,1.84,1.48,3.32,3.32,3.32c1.84,0,3.32-1.48,3.32-3.32C55.49,10.02,54,8.54,52.17,8.54 L52.17,8.54z M52.56,31.94c0-11.37-9.21-20.61-20.61-20.61c-11.37,0-20.61,9.25-20.61,20.61c0,11.4,9.25,20.61,20.61,20.61 C43.34,52.56,52.56,43.34,52.56,31.94L52.56,31.94z" fill-rule="evenodd" className="text-brandMarrom" /></svg></a>
                <a href={`${rotaPedidoWhats}`} className="mt-[3.4rem] mr-4 ml-2 w-[3.6rem] h-[3.5rem] text-brandMarrom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59.33 59.33" ><path d="M50.45,8.62C44.9,3.06,37.51,0,29.65,0C13.44,0,0.25,13.19,0.25,29.4c0,5.18,1.35,10.24,3.92,14.7L0,59.33 l15.59-4.09c4.29,2.34,9.13,3.58,14.05,3.58h0.01c16.2,0,29.68-13.19,29.68-29.4C59.33,21.56,56,14.18,50.45,8.62z M29.65,53.86 c-4.4,0-8.7-1.18-12.45-3.4l-0.89-0.53l-9.24,2.42l2.46-9.02l-0.58-0.93C6.5,38.51,5.22,34.02,5.22,29.4 c0-13.47,10.97-24.43,24.45-24.43c6.53,0,12.66,2.54,17.27,7.16s7.44,10.75,7.43,17.28C54.37,42.9,43.12,53.86,29.65,53.86z M43.06,35.56c-0.73-0.37-4.34-2.15-5.02-2.38c-0.68-0.25-1.17-0.37-1.66,0.37s-1.89,2.38-2.33,2.89c-0.42,0.49-0.86,0.56-1.59,0.19 c-4.32-2.16-7.15-3.85-10-8.74c-0.75-1.3,0.75-1.21,2.16-4.01c0.24-0.49,0.12-0.91-0.07-1.28s-1.66-3.99-2.26-5.46 c-0.6-1.43-1.21-1.23-1.66-1.26c-0.42-0.03-0.91-0.03-1.4-0.03c-0.49,0-1.28,0.19-1.96,0.91c-0.68,0.74-2.57,2.52-2.57,6.13 s2.64,7.11,2.99,7.6c0.37,0.49,5.18,7.91,12.56,11.1c4.66,2.01,6.49,2.19,8.82,1.84c1.42-0.21,4.34-1.77,4.95-3.5 c0.61-1.72,0.61-3.19,0.42-3.5C44.27,36.1,43.78,35.92,43.06,35.56z" className="text-brandMarrom" /></svg></a>
            </div>

        </footer>
    </>

}