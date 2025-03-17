import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Como usar: chamar as funcoes de avisos, que você ira utilizar , dentro da sua pagina
// ex: import {avisoClear, avisoInfo} from "src/components/aviso.jsx"

// Dentro do return do front declarar o container do aviso
// ex: return( <> <Aviso> <SuaPagina> </>)

// Agora caso queira chamar um aviso, precisará somente chamar a sua função equivalente e passar uma mensagem opcional de exibição
// ex: avisoErro("Mensagem de aviso!");
// ex: avisoErro();

export async function avisoClear(mensagem, time, autoClose) {
  time = time ? parseInt(time) : 4000
  if (typeof mensagem === "number") {
    time = parseInt(mensagem)
    mensagem = undefined
  }
  toast(mensagem ? mensagem : "Aviso!", {
    position: "top-right",
    autoClose: autoClose != undefined ? autoClose : time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  });
}

export async function avisoInfo(mensagem, time, autoClose) {
  time = time ? parseInt(time) : 4000
  if (typeof mensagem === "number") {
    time = parseInt(mensagem)
    mensagem = undefined
  }
  console.log("avisoInfo: ",toast)
  toast.info(mensagem ? mensagem : "Info!", {
    position: "top-right",
    autoClose: autoClose != undefined ? autoClose : time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored"
  });
}

export async function avisoSucesso(mensagem, time, autoClose) {
  time = time ? parseInt(time) : 4000
  if (typeof mensagem === "number") {
    time = parseInt(mensagem)
    mensagem = undefined
  }

  toast.success(mensagem ? mensagem : "Sucesso!", {
    position: "top-right",
    autoClose: autoClose != undefined ? autoClose : time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored"
  });
}

export async function avisoErro(mensagem, time, autoClose) {
  time = time ? parseInt(time) : 4000
  if (typeof mensagem === "number") {
    time = parseInt(mensagem)
    mensagem = undefined
  }
  toast.error(mensagem ? mensagem : "Algo deu errado!", {
    position: "top-right",
    autoClose: autoClose != undefined ? autoClose : time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  });
}

export async function avisoAlerta(mensagem, time, autoClose) {
  time = time ? parseInt(time) : 4000
  if (typeof mensagem === "number") {
    time = parseInt(mensagem)
    mensagem = undefined
  }
  toast.warn(mensagem ? mensagem : "Alerta!", {
    position: "top-right",
    autoClose: autoClose != undefined ? autoClose : time,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
  });
}

export default function Aviso() {
  return <ToastContainer />;
}
