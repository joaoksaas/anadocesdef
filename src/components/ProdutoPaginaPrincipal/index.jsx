import { floatToBrl, floatToGramas } from "@/utils/functions";

export default function ProdutoPaginaPrincipal({ id, desativado, nome, peso, preco, imagem }) {
    return (
        <>
            <a href={`/produto/${nome}`} className={`h-[51rem] w-[100%] 2xs:w-[47%] 2lg:w-[30.6%] relative bg-brandMarromFundo shadow-xl rounded-[1rem]`}>
                {
                    desativado && <>
                    <div className="bg-transparent backdrop-saturate-50 w-full h-full top-0 left-0 absolute"/>
                        <div className="backdrop-saturate-200 flex items-center justify-center bg-red-500 w-full h-[5rem] absolute top-[2%]">
                            <h3 className="text-black text-[2.5rem] font-bold">DESATIVADO</h3>
                        </div>
                    </>
                }
                <img className="w-[100%] h-[350px] mx-auto rounded-t-[6px]"
                    src={imagem}
                    alt="Descrição da imagem"
                />
                <div>
                    <h1 className="text-[3.2rem] p-2 text-brandMarrom whitespace-nowrap overflow-hidden text-ellipsis text-transform: capitalize"><strong>{nome}</strong> </h1>
                    <h1 className="text-[1.6rem] p-2 text-brandMarrom"><strong>{peso} gramas</strong></h1>
                    <h1 className="text-[3.2rem] p-2 text-brandMarrom"><strong>{floatToBrl(preco)}</strong></h1>
                </div>
            </a>
        </>
    );
}