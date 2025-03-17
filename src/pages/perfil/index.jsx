import Loader from "@/components/Loader";
import Header from "@/components/Header";
import PerfilC from "@/components/PerfilC";
import { useState } from "react";

export default function Perfil() {

    const [carregando, setCarregando] = useState(true)

    return (
        <>
            <div className="w-full">
                <Loader
                    carregando={carregando}
                />
                <Header />
                <PerfilC
                    setCarregando={setCarregando}
                />
            </div>
        </>
    );
};