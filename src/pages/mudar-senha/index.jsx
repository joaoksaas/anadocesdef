import Header from "@/components/Header";
import TrocarSenha from "@/components/MudarSenha";

export default function MudarSenha() {
    return (
        <>
            <Header />
            <div className="h-full flex items-center justify-center">
                <TrocarSenha />
            </div>
        </>
    );
};