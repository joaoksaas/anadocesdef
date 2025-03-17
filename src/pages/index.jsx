import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ProdutoPaginaPrincipal from "@/components/ProdutoPaginaPrincipal";
import Produtos from "@/components/Produtos";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [buscar, setBuscar] = useState("")

  const router = useRouter();

  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!!router?.query?.buscar) {
      setBuscar(router.query.buscar)
    }
  }, [router.query]);

  return (
    <>
        <Loader
            carregando={carregando}
        /> 
      <div className=" text-white w-full">
        <Header
          setBuscar={setBuscar}
          buscar={buscar}
        />
        <Produtos
          setCarregando={setCarregando}
          buscar={buscar}
        />
      </div>
    </>
  );
}
