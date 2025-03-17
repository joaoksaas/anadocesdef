import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PasswordResetRequest from "@/components/PasswordResetRequest";
import { useState } from "react";
import Loader from "@/components/Loader";


export default function Teste() {
    const [logado, setLogado] = useState(false)
    const [carregando, setCarregando] = useState(false)

    return (
        
        <div>
            <Loader 
                carregando={carregando}
            />
            <Header />
            <div className="h-ful pb-[5.7rem] items-center justify-center ">
            <PasswordResetRequest setCarregando={setCarregando}/>
            </div>
        </div>
        
    );
}