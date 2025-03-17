import { useState } from 'react';

const BotaoAjuda = ({ textoBotao, conteudoAjuda }) => {
    const [showModal, setShowModal] = useState(false); // Controle do modal
    const [modalContent, setModalContent] = useState(""); // ConteÃºdo do modal

    const mostrarAjuda = (conteudo) => {
        setModalContent(conteudo);
        setShowModal(true);
    };

    const fecharModal = () => {
        setShowModal(false);
        setModalContent("");
    };

    return (
        <div className='w-[10rem]'>
            <button
                onClick={() => mostrarAjuda(conteudoAjuda)}
                className="text-center w-full h-[full] mx-auto text-[2rem] text-brandAmareloInput rounded-[1rem] bg-brandMarrom p-6 border-[1px] border-black flex hover:opacity-80 transition-all duration-200 "
            >
                {textoBotao}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[600]">
                    <div className="relative bg-brandMarromFundo w-[40rem] h-[70rem] p-8 border border-gray-300  rounded-[1rem] shadow-lg">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={fecharModal}
                        >
                            &times;
                        </button>
                        <p>{modalContent}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotaoAjuda;