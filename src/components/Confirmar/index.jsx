import { avisoAlerta } from "../Aviso";

export async function confirmarAcao({ funcao, valor, msg, tipo }) {
  msg = msg ? msg : "Tem certeza?"
  let confirmado = confirm(msg);
  if (confirmado == true) {
    if (tipo?.toLowerCase() == "multivalue") {
      funcao(valor[0], valor[1])
    } else {
      funcao(valor)
    }
  } else {
    avisoAlerta("Ação cancelada")
  }
}