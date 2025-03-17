import { useRouter } from "next/router";

export default function Desautorizado() {
    const router = useRouter();
    return (
        <div className="text-brandMarrom w-[50full] h-[50full] flex flex-col items-center justify-center">
            <svg className="h-[10rem] w-[10rem]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>
            <h1 className="text-[3rem]">
                Parece que você não tem autorização para ver esta página.
            </h1>
            <div className="flex flex-col items-center justify-center gap-[2rem] py-10">
                {window.history.length > 1 &&
                    <button onClick={() => { router.back() }} className="text-[#503a0e] underline hover:text-[rgba(199,151,55,1)]">
                        voltar para a página anterior
                    </button>
                }
                <a href="/" className="text-[#503a0e] underline hover:text-[rgba(199,151,55,1)]">voltar para a página inicial</a>
            </div>

        </div>
    );
};