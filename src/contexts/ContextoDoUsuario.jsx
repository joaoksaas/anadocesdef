import { createContext, useContext, useEffect, useState } from 'react';

const ContextoDoUsuario = createContext();

export const ProvedorDoUsuario = ({ children }) => {
    const dadosDoUsuario = {
        id: null, nome: null, email: null, cargo: null, cpf: null, telefone: null
    }

    const [usuarioCarregado, setUsuarioCarregado] = useState(false)

    function setUsuario(newUsuario) {
        Object.keys(dadosDoUsuario).map(key => {
            let value = newUsuario[key]
            if (!!value) {
                localStorage.setItem(key, value);
            }
        })
        setUsuarioState(newUsuario)
    }
    const [usuario, setUsuarioState] = useState({});
    const [carrinho, setCarrinhoValue] = useState([]);
    function setCarrinho(value){
        console.log("setCarrinho: ",value)
        if(typeof value != "string"){
            localStorage.setItem('carrinho', JSON.stringify(value));
            setCarrinhoValue(value)
        }else {
            localStorage.setItem('carrinho', value);
            setCarrinhoValue(JSON.parse(value))
        }
    }

    useEffect(() => {
        console.log(usuario)
        console.log("usuario2")
    },[])

    useEffect(() => {
        if (carrinho.length > 0) {
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
        }
    }, [usuario, carrinho])

    function getFirstLoadCarrinho() {
        let newCarrinho = JSON.parse(localStorage.getItem('carrinho')) || {}
        return newCarrinho
    }
    function getFirstLoadUsuario() {
        let newUsuario = { ...dadosDoUsuario }
        const sessionEntries = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key)
            console.log(key,":",value)
            if (Object.keys(newUsuario).includes(key)) {
                newUsuario[key] = value
            }else {

            }
            sessionEntries.push({ key, value });
        }
        setUsuarioCarregado(true)
        
        return newUsuario
    }

    useEffect(() => {
        setCarrinho(getFirstLoadCarrinho())
        setUsuario(getFirstLoadUsuario())
    }, [])
    useEffect(() => {
        setCarrinho(getFirstLoadCarrinho())
        setUsuario(getFirstLoadUsuario())
    }, [usuarioCarregado])

    useEffect(()=>{
        if(!!dadosDoUsuario?.carrinho){
            setCarrinho(dadosDoUsuario.carrinho)
            localStorage.setItem('carrinho', JSON.stringify(dadosDoUsuario.carrinho));
        }
        console.log(dadosDoUsuario)
        console.log("dadosDoUsuario")
    },[dadosDoUsuario])

    return (
        <ContextoDoUsuario.Provider value={{ dadosDoUsuario, usuario, setUsuario, carrinho, setCarrinho, usuarioCarregado }}>
            {children}
        </ContextoDoUsuario.Provider>
    );
};

export const pegarUsuario = () => useContext(ContextoDoUsuario);