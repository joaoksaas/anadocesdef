// src/pages/_app.js
import "../styles/globals.css";
import { Allura, Open_Sans, Quicksand } from "@next/font/google";
import { ProvedorDoUsuario, usarUsuario } from "@/contexts/ContextoDoUsuario";
import Footer from "@/components/Footer";
import Head from "next/head";
import AuthGuard from "@/components/AuthGuard";
import Aviso from "@/components/Aviso";

const allura = Allura({
  subsets: ["latin"],
  weight: "400", // Regular weight
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: "300", // Light weight
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: "400", // Regular weight
});


const rotasComLogin = ['/perfil', '/carrinho', '/mudar-senha', '/pedidos'];
const rotasComCargos = [
  {
    rotas: ["/produto/registrar", "/relatorio", "/sabores/editar" ],
    cargos: ["admin","dev"]
  }
]



function MyApp({ Component, pageProps }) {
  return (
    <ProvedorDoUsuario>
      <Aviso/>
      <AuthGuard rotasComLogin={rotasComLogin} rotasComCargos={rotasComCargos}>
        <Head>
          <link rel="icon" href="/AD_fundo4.svg" type="image/svg+xml" />
          <title>Aninha Doces</title>
        </Head>
        <div
          className={`${allura.className} ${openSans.className} ${quicksand.className} px-[0.15%] sm:px-[1%] md:px-[1.5%] lg:px-[5%] overflow-auto flex items-start justify-center h-full mt-[15rem] min-h-screen w-full`}
        >
          <Component {...pageProps} />
        </div>
        <Footer />
      </AuthGuard>
    </ProvedorDoUsuario>
  );
}

export default MyApp;
