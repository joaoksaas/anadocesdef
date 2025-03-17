import Header from "@/components/Header";
import RecuperarSenha from "@/components/EsqueceuSenha";

export default function MudarSenha() {
    return (
        <>
            <Header />
            <div className="h-full flex items-center justify-center">
                <RecuperarSenha />
            </div>
        </>
    );
};