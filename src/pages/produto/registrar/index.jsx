import CriarProduto from "@/components/CriarProduto";
import Header from "@/components/Header";
import Produto from "@/components/Produto";
import { api } from "@/services/api";
import { floatToBrl } from "@/utils/functions";

export default function RegistrarProduto() {
  return (
    <>
      <Header />
      <CriarProduto />
    </>
  );
}
