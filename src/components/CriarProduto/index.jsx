import { api } from "@/services/api";
import { floatToBrl, formatarProduto, ordernarArrayAlfabeticamente } from "@/utils/functions";
import { useEffect, useState } from "react";
import { avisoErro, avisoSucesso } from "../Aviso";
import BotaoAjuda from "../Help";
import TooltipIcon from "../SobreInput";

export default function CriarProduto() {
    let valoresProdutoBase = {
        nome: "",
        imagem: "",
        preco: 0,
        peso: 0,
        sabores: [],
    };
    const [produto, setProduto] = useState({ ...valoresProdutoBase });

    const [imagemFile, setImagemFile] = useState(null);

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

    const uploadImagemCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", imagemFile); // Certifique-se de que 'imagemFile' contém o arquivo
        formData.append("upload_preset", "produto"); // Certifique-se de que o 'upload_preset' está correto

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dxtj3kd7d/image/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            return data.secure_url; // URL segura da imagem
        } catch (error) {
            console.error("Erro ao fazer upload para o Cloudinary:", error);
            return null;
        }
    };


    const registrar = async () => {
        try {
            let produtoFormatado = formatarProduto(produto);

            // Se a imagem foi selecionada, faça o upload
            if (imagemFile) {
                const imagemUrl = await uploadImagemCloudinary();
                if (imagemUrl) {
                    produtoFormatado.imagem = imagemUrl; // Defina a URL da imagem no produto
                } else {
                    avisoErro("Erro ao fazer upload da imagem.");
                    return;
                }
            }

            // Envie os dados do produto para a API do backend
            const response = await api.post("/api/produtos/criar-produto", { ...produtoFormatado }).then(({ data }) => data);
            avisoSucesso();
            setProduto({ ...valoresProdutoBase });
            setImagemFile(null); // Limpa o arquivo de imagem
        } catch (error) {
            avisoErro();
            console.log("Erro em CriarProduto:", error.message);
        }
    };

    function sortSaboresDisponiveis() {
        let saboresSorted = [...saboresDisponiveis]
        saboresSorted.sort()
        return saboresSorted
    }

    const handleFileChange = (e) => {
        setImagemFile(e.target.files[0]);
    };

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
        <>
            <div className="px-[5%] bg-brandMarromFundo text-black rounded-[1rem] w-[75%] shadow-xl mx-auto text-[2.5rem] h-full py-[2%] flex flex-col justify-center items-center">
                <div className="w-full flex items-center ">
                    <div className="flex-grow flex justify-center ">
                        <h3 className="text-[5rem] ml-[10rem]">Novo Produto</h3>
                    </div>
                    <div className="ml-auto">
                        <BotaoAjuda
                            textoBotao="Ajuda"
                            conteudoAjuda={"Esta página serve para adicionar novos produtos ao Marketplace, todos os campos são referentes às informações do produto, e no caso da URL, seria o endereço de uma imagem postada em algum lugar, como por exemplo no próprio GitHub."}
                        />
                    </div>
                </div>
                <div className="w-full h-[10rem] flex justify-start items-center  brightness-90 shadow-md border-[1px] my-[2rem] px-[2rem] rounded-[0.5rem]  border-brandMarrom">
                    <p className="mr-4 w-[25rem]">Nome:</p>
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        className="text-brandMarrom w-full pl-[1rem] bg-brandAmareloInput border-[1px] rounded-[8px] placeholder:text-quaternaria  border-black placeholder:opacity-50"
                        onChange={(e) => {
                            setProduto({ ...produto, nome: e.target.value });
                        }}
                        value={produto.nome}
                    />
                    <div>
                        <TooltipIcon tooltipText="Nome do Produto para ser adicionado." />
                    </div>
                </div>
                <div className="w-full h-[10rem] flex justify-start items-center brightness-90 shadow-md border-[1px] my-[2rem] px-[2rem] rounded-[0.5rem] border-brandMarrom">
                    <p className="mr-4 w-[25rem]">Imagem:</p>
                    <input
                        type="file"
                        className="text-brandMarrom w-full pl-[1rem] bg-brandAmareloInput border-[1px] rounded-[8px] placeholder:text-quaternaria border-black placeholder:opacity-50"
                        onChange={handleFileChange}
                    />
                    <TooltipIcon tooltipText="Selecione uma imagem para fazer upload." />
                </div>
                <div className="w-full h-[10rem] flex justify-start items-center  brightness-90 shadow-md border-[1px] my-[2rem] px-[2rem] rounded-[0.5rem]  border-brandMarrom">
                    <p className="mr-4 w-[25rem]">Preço (R$):</p>
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        className="text-brandMarrom w-full pl-[1rem] bg-brandAmareloInput border-[1px] rounded-[8px] placeholder:text-quaternaria  border-black placeholder:opacity-50"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                            setProduto({
                                ...produto,
                                preco: e.target.value.replace(/[^0-9,]/g, "").replace(/(,.*),/g, "$1"),
                            });
                        }}
                        value={produto.preco}
                    />
                    <div>
                        <TooltipIcon tooltipText="Preço em reais do produto, separar com virgula (,) reais dos centavos." />
                    </div>
                </div>
                <div className="w-full h-[10rem] flex justify-start items-center brightness-90 shadow-md border-[1px] my-[2rem] px-[2rem] rounded-[0.5rem]  border-brandMarrom">
                    <p className="w-[25rem]">Peso (gramas):</p>
                    <input
                        type="text"
                        placeholder="Digite aqui..."
                        className="text-brandMarrom w-full pl-[1rem] bg-brandAmareloInput border-[1px] rounded-[8px] placeholder:text-quaternaria border-black placeholder:opacity-50"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                            setProduto({
                                ...produto,
                                peso: e.target.value.replace(/[^0-9,]/g, "").replace(/(,.*),/g, "$1"),
                            });
                        }}
                        value={(produto.peso)}
                    />
                    <div>
                        <TooltipIcon tooltipText="Peso do produto em gramas." />
                    </div>
                </div>

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




                <button
                    onClick={registrar}
                    className="w-[25rem] h-[7rem] bg-brandMarrom text-brandAmareloInput rounded-[6px] text-[2.6rem] hover:opacity-80 transition-all duration-200"
                >
                    <p>REGISTRAR</p>
                </button>

            </div>

        </>
    );
}