import type { Metadata } from "next";
import { DecisaoForm } from "@/components/DecisaoForm";
import { Marca } from "@/components/Marca";

export const metadata: Metadata = { title: "Quero ser acompanhado" };

export default function DecisaoPage() {
  return (
    <>
      <Marca compact />
      <main className="sheet">
        <p className="kicker">Decisão</p>
        <h1>Seu contato</h1>
        <p className="lead">Preencha com calma. Uma liderança da sua cidade vai continuar essa conversa.</p>
        <DecisaoForm />
      </main>
    </>
  );
}
