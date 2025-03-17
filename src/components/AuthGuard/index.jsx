import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { pegarUsuario } from '@/contexts/ContextoDoUsuario';
import { usePathname } from 'next/navigation';
import Header from '../Header';
import Desautorizado from '../Desautorizado';
import Loader from '../Loader';

export default function AuthGuard({ children, rotasComLogin = [], rotasComCargos = [] }) {
    const { usuario, setUsuario, usuarioCarregado } = pegarUsuario();
    const [usuarioDesautorizado, setUsuarioDesautorizado] = useState(false)
    const [autorizacaoVerificada, setAutorizacaoVerificada] = useState(false)
    const [carregando, setCarregando] = useState(true)
    useEffect(() => {
        if (usuarioCarregado) setCarregando(false)
    }, [usuarioCarregado])


    const router = useRouter();
    const currentRoute = usePathname()

    // Verifica se a rota precisa de cargo e se o usuario a tem
    const verificarCargoUsuario = () => {
        if (!usuarioCarregado) return
        const routeConfig = rotasComCargos.find(routeObj =>
            routeObj.rotas.includes(currentRoute)
        );
        if (routeConfig) {
            const { cargos } = routeConfig;
            const userIsAuthorized = usuario?.email && cargos.includes(usuario?.cargo);
            if (!userIsAuthorized) {
                if (!usuario?.email) {
                    router.push('/login')
                } else {
                    setUsuarioDesautorizado(true)
                }
            }
        }
        setAutorizacaoVerificada(true)
    }

    // Verifica se a rota precisa de login e se o usuario o tem
    const verificarSeUsuarioLogado = () => {
        if (!usuarioCarregado) return
        const rotaPrecisaDeLogin = rotasComLogin.includes(router.pathname);
        if (rotaPrecisaDeLogin && !usuario?.email) {
            router.push('/login');
        }
    }

    useEffect(() => {
        verificarCargoUsuario()
        verificarSeUsuarioLogado()
    }, [usuario, router, rotasComCargos, usuarioCarregado]);
    if (carregando || !usuarioCarregado || !autorizacaoVerificada) {
        return <><Loader carregando={true}/></>
    }
    else if (usuarioDesautorizado) {
        return (
            <>
                <Header />
                <div className="w-full min-h-[100vh] flex items-center justify-center h-full">
                    <Desautorizado />
                </div>
            </>
        )

    }
    else {
        return <>{children}</>;
    }
}