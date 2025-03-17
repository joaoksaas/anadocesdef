import { avisoAlerta, avisoErro, avisoInfo, avisoSucesso } from '@/components/Aviso';
import { confirmarAcao } from '@/components/Confirmar';
import Header from '@/components/Header';
import BotaoAjuda from '@/components/Help';
import Loader from '@/components/Loader';
import TooltipIcon from '@/components/SobreInput';
import { api } from '@/services/api';
import { useState, useEffect, useRef } from 'react';


function sortSaboresPorNome(arr) {
    return arr.sort((a, b) => {
        if (a.nome < b.nome) {
            return -1;
        }
        if (a.nome > b.nome) {
            return 1;
        }
        return 0;
    });
}

export default function EditarSabores() {

    const [carregando, setCarregando] = useState(true)

    const [sabores, setSabores] = useState([]);
    const [nome, setNome] = useState('');
    const [idSendoEditado, setIdSendoEditado] = useState(null);

    useEffect(() => {
        pegarSabores();
    }, []);

    function sortSabores(saboresParaSort) {
        let newSabores = []
        if (!idSendoEditado) {
            let sortedSabores = [...saboresParaSort]
            sortedSabores = sortSaboresPorNome(sortedSabores)
            newSabores = sortedSabores
        } else {
            let sortedSabores = []
            let saboresSendoEditados = []
            saboresParaSort.map(sabor => {
                if (sabor.id != idSendoEditado) {
                    sortedSabores.push(sabor)
                } else {
                    saboresSendoEditados.push(sabor)
                }
            })
            saboresSendoEditados = sortSaboresPorNome(saboresSendoEditados)
            sortedSabores = sortSaboresPorNome(sortedSabores)
            newSabores = [...saboresSendoEditados, ...sortedSabores]
        }
        setSabores(newSabores)
    }
    useEffect(() => {
        sortSabores(sabores)
    }, [idSendoEditado])

    // Retorna todos os sabores (em formato de objeto para cada sabor)
    const pegarSabores = async () => {
        setIdSendoEditado(null)
        try {
            setCarregando(true)
            const response = await api.post("/api/sabores/listar").then(({ data }) => { return data })
            sortSabores(response)
        } catch (error) {
            avisoErro("Ocorreu um erro ao carregar os sabores :(")
        } finally {
            setIdSendoEditado(null)
            setNome("")
            setCarregando(false)
        }
    };

    // Criar um novo sabor
    const criarSabor = async (novoSabor) => {
        setIdSendoEditado(null)
        try {
            setCarregando(true)
            const criarSabor = await api.post("/api/sabores/criar-sabor", { sabor: novoSabor }).then(({ data }) => { return data })
            avisoSucesso("Sabor criado com sucesso!")
            pegarSabores()
        } catch (error) {
            setCarregando(false)
            avisoErro("Ocorreu um erro ao criar o sabor :(")
        } finally {
            setIdSendoEditado(null)
            setNome("")
        }
    };

    // Atualiza um sabor existente
    const atualizarSabor = async (sabor) => {
        setIdSendoEditado(null)
        try {
            setCarregando(true)
            const saborAtualizado = await api.post("/api/sabores/editar-sabor", { sabor }).then(({ data }) => { return data })
            avisoSucesso("Sabor atualizado com sucesso!")
            pegarSabores()
        } catch (error) {
            setCarregando(false)
            avisoErro("Ocorreu um erro ao atualizar os sabores :(")
        } finally {
            setIdSendoEditado(null)
            setNome("")
        }

    };

    // Remove um sabor do banco de dados
    const removerSabor = async (id) => {
        try {
            setCarregando(true)
            const saborRemovido = await api.post("/api/sabores/deletar-sabor", { id: id }).then(({ data }) => { return data })
            avisoSucesso("Sabor removido com sucesso!")
            pegarSabores()
        } catch (error) {
            setCarregando(false)
            avisoErro("Ocorreu um erro ao deletar o sabor :(")
        } finally {
            setIdSendoEditado(null)
            setNome("")
        }
    };

    // Maneja a edição/criação do sabor presente no formulário
    const handleSubmit = async (e) => {
        setCarregando(true)
        e.preventDefault();
        if (!nome.replace(/ /g, "")) {
            avisoErro("Nome inválido!")
            setCarregando(false)
            return
        }
        if (idSendoEditado) {
            await atualizarSabor({ id: idSendoEditado, nome });
            setIdSendoEditado(null);
        } else {
            await criarSabor({ nome });
        }
        setNome('');
        pegarSabores();
    };
    const formRef = useRef(null);
    const handleEditar = (sabor) => {
        scrollToRef(formRef)
        setIdSendoEditado(sabor.id);
        setNome(sabor.nome);
    };
    const handleRemover = async (id) => {
        await removerSabor(id);
    };


    const scrollToRef = (ref) => {
        const offset = 100; // Adjust this value as needed
        const element = ref.current;

        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <Loader carregando={carregando} />
            <Header />

            <div ref={formRef}></div>
            <div className="shadow-xl rounded-[1rem] h-fit w-full mx-auto max-w-[70rem] text-[1.5rem] flex flex-col items-center py-[2.5rem] mt-[10rem] bg-brandAmareloInput border-[4px] border-[rgba(255,255,255,0.7)]">
            <div className="w-full flex items-center ">
                    <div className="flex-grow flex justify-center ">
                        <h3 className="text-[6rem] ml-[10rem] font-bold mb-4 text-white">SABORES</h3>
                    </div>
                    <div className="ml-auto">
                        <BotaoAjuda
                            textoBotao="Ajuda"
                            conteudoAjuda={"Esta página serve para adicionar, remover ou editar os sabores do Marketplace, os sabores estão ordenados em ordem alfabéticos, e cada um dos botões fazem suas respectivas funcionalidades referentes aos sabores."}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="shadow-[0_10px_20px_rgba(0,_1,_20,_0.15)] gap-[1rem] mb-6 w-full flex items-center justify-center bg-[rgba(0,0,0,0.2)] py-[3rem]">
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value.toUpperCase())}
                        placeholder="Nome do sabor..."
                        className="w-full h-[5rem] text-[1.8rem] font-bold max-w-[30rem] border border-gray-300 px-4 py-2 rounded-md mr-2"
                    />
                    <TooltipIcon tooltipText="Sabor do produto para ser adicionado, ou editado." />
                    <button
                        type="submit"
                        className={`${idSendoEditado ? "brightness-110 font-bold text-[#359659]" : "font-bold text-red-700"} bg-brandMarromFundo h-[5rem] text-[2.5rem] max-w-[15rem] rounded-[0.5rem] hover:scale-105 ease-in-out duration-150 hover:brightness-125 border-[1px] hover:border-[rgba(255,255,255,0.6)] border-transparent w-full shadow-[0_10px_20px_rgba(0,_1,_20,_0.15)]`}
                    >
                        {idSendoEditado ? 'Atualizar' : 'Criar Sabor'}
                    </button>
                </form>
                <div className="text-[2.5rem] w-full mx-[2rem] rounded-md p-[1rem] px-[3rem]">
                    {sabores.length > 0 ? (
                        sabores.map((sabor) => {
                            let editandoEsseSabor = (idSendoEditado == sabor.id)
                            return (
                                <div
                                    key={sabor.id}
                                    className={`${(!editandoEsseSabor && !!idSendoEditado) ? "opacity-50 pointer-events-none" : ""} hover:scale-105 ease-in-out duration-100 shadow-[5px_5px_0px_0px_rgba(100,60,30)] my-[1.2rem] rounded-[0.5rem] pl-[3%] py-[0.5rem] bg-white flex justify-between items-center mb-2 border-b`}
                                >
                                    <div className="w-full max-w-[65%]">{sabor.nome}</div>
                                    <div className="w-full max-w-[30%] gap-2 flex items-center flex-col">
                                        <button
                                            onClick={() => {

                                                if (!editandoEsseSabor) {
                                                    handleEditar(sabor)
                                                } else {
                                                    setIdSendoEditado(null)
                                                    setNome("");
                                                }
                                            }

                                            }
                                            className="shadow-[0_10px_20px_rgba(0,_1,_20,_0.15)] text-[2.5rem] max-w-[15rem] rounded-[0.5rem] hover:scale-105 ease-in-out duration-150 hover:brightness-125 border-[1px] hover:border-[rgba(255,255,255,0.6)] border-transparent bg-brandMarromFundo font-bold text-brandMarromClaro w-full"
                                        >

                                            {(editandoEsseSabor && idSendoEditado) ? "Cancelar" : "Editar"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                confirmarAcao({
                                                    funcao: handleRemover,
                                                    valor: sabor.id
                                                })
                                            }}


                                            className="shadow-[0_10px_20px_rgba(0,_1,_20,_0.15)] text-[2.5rem] max-w-[15rem] rounded-[0.5rem] hover:scale-105 ease-in-out duration-150 hover:brightness-125 border-[1px] hover:border-[rgba(255,255,255,0.6)] border-transparent bg-brandMarromFundo font-bold text-red-700 w-full"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-gray-500">Nenhum sabor encontrado :.(</p>
                    )}
                </div>
            </div>
        </>
    );
};


