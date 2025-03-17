
import FormularioCadastro from "@/components/FormularioCadastro";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useState } from "react";

export default function Cadastro() {

    const [carregando, setCarregando] = useState(false)

    return (
        <>
            <Loader
                carregando={carregando}
            />
            <Header />
            <div className="h-ful pb-[5.7rem] items-center justify-center w-full">
                <FormularioCadastro setCarregando={setCarregando}/>
            </div>

        </>
    );
};