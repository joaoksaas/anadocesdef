import FormularioLogin from "@/components/FormularioLogin";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

export default function Login() {

    const [carregando, setCarregando] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setCarregando(false)
        }, 500)
    }, [])

    return (
        <>
            <Header />
            <Loader carregando={carregando} />
            <div className="h-full flex items-center justify-center w-full">
                <FormularioLogin />
            </div>
        </>
    );
};