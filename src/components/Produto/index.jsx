"use client";

import { useEffect, useState } from "react";
import BotaoAdicionarAoCarrinho from "../Botoes/AdicionarAoCarrinho";
import { pegarUsuario } from "@/contexts/ContextoDoUsuario";
import { brlToFloat, floatToBrl, formatarProduto, formatarStringParaUrl, removerVirgulasExcetoPrimeira } from "@/utils/functions";
import { api } from "@/services/api";
import { avisoErro, avisoSucesso } from "../Aviso";
import { useRouter } from "next/router";
import { confirmarAcao } from "../Confirmar";
import Desautorizado from "../Desautorizado";
import TooltipIcon from "../SobreInput";

// Função para formatar a string
function formatString(str) {
    if (!str){return ""}
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default function Produto(props) {
    const [produto, setProduto] = useState(props?.produto || {})
    const { usuario, setUsuario, usuarioCarregado } = pegarUsuario()
    const [editando, setEditando] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [imagemFile, setImagemFile] = useState(null);



    const quantiaMaxima = 200

    const handleFileChange = (e) => {
        setImagemFile(e.target.files[0]); // Atualize o arquivo de imagem
    };
    
    const uploadImagemCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", imagemFile);
        formData.append("upload_preset", "produto");
    
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dxtj3kd7d/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Erro ao fazer upload para o Cloudinary:", error);
            return null;
        }
    };
    

    const [quantia, setQuantia] = useState(1);
    const handleQuantiaChange = (event) => {
        setQuantia(event.target.value);
    };
    const router = useRouter()
    async function Salvar() {
        try {
            setCarregando(true);
            let produtoFormatado = formatarProduto(produto);
    
            // Verifica se há uma nova imagem para upload
            if (imagemFile) {
                const imagemUrl = await uploadImagemCloudinary();
                if (imagemUrl) {
                    produtoFormatado.imagem = imagemUrl; // Atualize o campo de imagem
                } else {
                    avisoErro("Erro ao fazer upload da imagem.");
                    return;
                }
            }
    
            const response = await api.post("/api/produtos/editar-produto", { ...produtoFormatado });
            props?.setProdutoPagina(produto);
            avisoSucesso("Sucesso!");
            setImagemFile(null); // Limpa o arquivo de imagem
        } catch (error) {
            console.log("Erro em salvar edição de produto:", error.message);
            avisoErro("Algo deu errado.");
        } finally {
            setCarregando(false);
        }
    }
    

    const desativarProduto = async (produto, ativar = false) => {
        try {
            setCarregando(true)
            const response = await api.post(`/api/produtos/desativar-pelo-id`, { id: produto?.id, desativado: !ativar })
            avisoSucesso(`Produto ${ativar ? "ativado" : "desativado"}  com sucesso!`)
            setTimeout(() => { router.reload() }, 1000)
        } catch (error) {
            avisoErro("Ocorreu um erro ao desativar o produto, tente novamente mais tarde.")
            setCarregando(false)
        } finally {
        }
    }
    if (produto.desativado) {
        if (!usuarioCarregado) {
            <h1>CARREGANDO</h1>
        } else {
            if (usuario?.cargo != "admin") {
                return <Desautorizado />
            }
        }
    }

    const [saboresDisponiveis, setSaboresDisponiveis] = useState([]);
    const [saboresBuscados, setSaboresBuscados] = useState(false)
    const pegarSabores = async () => {
        setSaboresBuscados(true)
        const sabores = await api.post("/api/sabores/listar", { somenteNomes: true }).then(({ data }) => { return data })
        setSaboresDisponiveis(sabores)
    };
    useEffect(() => {
        if (!saboresBuscados) pegarSabores()
    }, [])

    function sortSaboresDisponiveis() {
        let saboresSorted = [...saboresDisponiveis]
        saboresSorted.sort()
        return saboresSorted
    }

    function filtrarStringsUnicas(array) {
        return Array.from(new Set(array));
    }

    useEffect(() => {
        if (produto.sabores.length > 0 && !produto.sabor) {
            setProduto({ ...produto, sabor: produto.sabores.sort()[0] })
        }
        let newSaboresSelecionados = filtrarStringsUnicas([...saboresSelecionados, ...produto?.sabores])
        setSaboresSelecionados(newSaboresSelecionados)
        console.log(newSaboresSelecionados)
        console.log("newSaboresSelecionados")
        console.log(produto)
        console.log("produto")
    }, [produto])

    const [saboresSelecionados, setSaboresSelecionados] = useState([])
    const handleSaboresChange = (event) => {
        const { value } = event.target;
        const sabor = value
        var checked = saboresSelecionados.includes(sabor)
        let newSaboresSelecionados = []
        if (!checked) {
            newSaboresSelecionados = [...saboresSelecionados]
            newSaboresSelecionados.push(sabor)
        } else saboresSelecionados.map(saborSelecionado => { if (saborSelecionado != sabor) newSaboresSelecionados.push(saborSelecionado) })
        setSaboresSelecionados(newSaboresSelecionados)
        console.log(newSaboresSelecionados)
        console.log("newSaboresSelecionados")
        var newProduto = { ...produto, sabores: newSaboresSelecionados };
        setProduto(newProduto);
    };


    return (
        <div className={`${carregando && "pointer-events-none opacity-75"} flex-col lg:flex-row bg-brandMarromFundo w-[75%] h-[690px] mx-auto flex rounded-[1rem] shadow-xl`}>
            <div className="w-full h-[50%] lg:w-[50%] lg:h-full">
                <img className="h-full w-full rounded-tl-[1rem] rounded-bl-[1rem] object-cover"
                    src={produto.imagem}
                    alt="Descrição da imagem"
                />
            </div>
            <div className="w-full h-[50%] lg:w-[50%] lg:h-full flex flex-col p-32 break-words relative rounded-[1rem]">
                {usuario.cargo == "admin" &&
                    <>
                        <button className={`transition-all duration-150 ease-in-out hover:scale-110 shadow-xl m-[1.25rem] absolute top-0 right-0 w-[6rem] rounded-[10rem] flex items-center justify-center h-[5rem] text-[2rem]  ${editando ? "bg-brandMarromClaro" : "bg-terciaria"}`} onClick={() => { if (editando) Salvar(); setEditando(!editando) }}>
                            {editando ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[3.5rem] w-[3.5rem] text-brandAmareloInput">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[3.5rem] w-[3.5rem] text-quaternaria">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            }
                        </button>
                        {editando && <>

                            {
                                produto?.desativado ? <button
                                    onClick={() => {
                                        confirmarAcao({
                                            funcao: desativarProduto,
                                            valor: [produto, true],
                                            tipo: "multivalue"
                                        })
                                    }}
                                    className={`bg-green-500 transition-all duration-150 ease-in-out hover:scale-110 shadow-xl m-[1.25rem] absolute top-0 left-0 w-[6rem] rounded-[10rem] flex items-center justify-center h-[5rem] text-[2rem]`} >

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[3.5rem] w-[3.5rem] text-quaternaria">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                                    </svg>


                                </button> : <button
                                    onClick={() => {
                                        confirmarAcao({
                                            funcao: desativarProduto,
                                            valor: produto,
                                        })
                                    }}
                                    className={`bg-red-500 transition-all duration-150 ease-in-out hover:scale-110 shadow-xl m-[1.25rem] absolute top-0 left-0 w-[6rem] rounded-[10rem] flex items-center justify-center h-[5rem] text-[2rem]`} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[3.5rem] w-[3.5rem] text-quaternaria">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>

                                </button>
                            }
                        </>
                        }

                    </>
                }
                <div className="flex">
                    <textarea
                        spellcheck="false"
                        onChange={(e) => { setProduto({ ...produto, nome: e.target.value }) }}
                        className={`resize-none overflow-hidden w-fit rounded-[0.5rem] break-words border-[1px] text-brandMarrom text-[4.4rem] text-center ${editando ? "bg-brandAmareloInput border-[rgba(255,255,255,0.5)]" : "border-transparent bg-transparent pointer-events-none"} `}
                        placeholder="Digite aqui..."
                        value={formatString(produto.nome)}
                    />
                    {editando ? <TooltipIcon tooltipText="O nome do produto." /> : ""}
                </div>

                <div className="flex">
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        className={`rounded-[0.5rem]  border-[1px] text-brandMarrom text-[2.4rem] text-left ${editando ? "bg-brandAmareloInput border-[rgba(255,255,255,0.5)]" : "border-transparent bg-transparent pointer-events-none"}`}
                        onChange={(e) => { setProduto({ ...produto, peso: e.target.value.replace(/[^0-9.,]/g, '') }) }}
                        value={(produto.peso > 0 ? produto.peso : 0) + " Gramas"}
                    />
                    {editando ? <TooltipIcon tooltipText="O peso do produto em gramas." /> : ""}
                </div>

                <div className="flex">
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        className={`rounded-[0.5rem]  border-[1px] text-brandMarrom text-[4rem] text-left ${editando ? "bg-brandAmareloInput border-[rgba(255,255,255,0.5)]" : "border-transparent bg-transparent pointer-events-none"}`}
                        onChange={(e) => { setProduto({ ...produto, preco: removerVirgulasExcetoPrimeira(e.target.value.replace(/[^0-9,]/g, '')).replace("R$ ", "") }) }}
                        value={`${!editando ? floatToBrl(typeof produto.preco == "string" ? brlToFloat(produto.preco) : produto.preco) : "R$ " + produto.preco}`}
                    />
                    {editando ? <TooltipIcon tooltipText="O preço do produto em Reais." /> : ""}
                </div>

                {editando && (
                    <div className="flex">
                        <input
                            type="file"
                            className="text-brandMarrom w-full pl-[1rem] bg-brandAmareloInput rounded-[0.5rem]  border-[1px] text-[2rem] text-left"
                            onChange={handleFileChange} // Atualizar o estado da imagem
                        />
                        <TooltipIcon tooltipText="Selecione uma imagem para fazer upload." />
                    </div>
                )}
                <p className={`${quantia <= 1 && "opacity-0 pointer-events-none"} text-brandMarrom text-[1.8rem] text-left`}>
                    {<> {quantia} un. (R$ {isNaN(parseFloat(produto.preco) * quantia) ? 0.0 : parseFloat(produto.preco) * quantia})</>}
                </p>
                <div className="pt-6 text-brandMarrom text-[2.4rem] text-left font-openSans mb-8 ">
                    <label htmlFor="quantia" className="mr-4">Quantidade:</label>
                    <select id="quantia" className="rounded border-[1px] border-[rgba(0,0,0,0.3)] text-brandMarrom bg-brandAmareloInput" value={quantia} onChange={handleQuantiaChange}>
                        {[...Array(quantiaMaxima).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>
                                {num + 1}
                            </option>
                        ))}
                    </select>
                </div>

                {(produto.sabores.length > 1 && !editando) &&
                    <div className="w-[20rem] h-[5rem] flex justify-start items-center text-[2.4rem] mb-8">
                        <p className="mr-4 w-[20rem]">Sabor:</p>
                        <select
                            name="sabores"
                            id="sabores"
                            className="rounded border-[1px] border-[rgba(0,0,0,0.3)] text-brandMarrom bg-brandAmareloInput"
                            onChange={(e) => {
                                setProduto({
                                    ...produto,
                                    sabor: e.target.value.replace(/ /g, "_")
                                });
                            }}
                        >
                            {produto.sabores
                                .slice() // cria uma cópia da lista para não modificar o original
                                .sort((a, b) => a.localeCompare(b)) // ordena alfabeticamente
                                .map((sabor) => (
                                    <option key={sabor} value={sabor}>{sabor.replace(/_/g, " ")}</option>
                                ))
                            }
                        </select>
                    </div>
                }

                {editando &&
                    <div className="mb-8 pb-2  brightness-90 shadow-md border-[1px] border-brandMarrom rounded-[0.5rem] w-full h-full">
                        <div className="border-b-[0.1rem] border-black w-full">
                            <h3 className="pl-4">SELECIONE SEUS SABORES:</h3>
                        </div>
                        <form className="flex flex-wrap max-h-64 overflow-y-scroll">
                            {sortSaboresDisponiveis().map((sabor) => (
                                <div key={sabor} className="flex items-center mb-2 mr-4"> {/* Margem entre os itens */}
                                    <label className="pl-[1rem] pr-2 cursor-pointer hover:opacity-50 ease-in-out duration-150 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="cursor-pointer"
                                            value={sabor}
                                            checked={saboresSelecionados.includes(sabor)}
                                            onChange={handleSaboresChange}
                                        />
                                        {sabor}
                                    </label>
                                </div>
                            ))}
                        </form>
                    </div>

                }




                {!editando &&
                    <BotaoAdicionarAoCarrinho usuario={usuario} produto={produto} id={produto.id} quantia={quantia} />
                }
            </div>
        </div>
    );
}
