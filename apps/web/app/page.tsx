import type { Metadata } from "next";
import Link from "next/link";
import { Marca } from "@/components/Marca";

export const metadata: Metadata = {
  title: "Cruzada Evangelística",
};

export default function Inicio() {
  return (
    <>
      <Marca />
      <main className="sheet">
        <p className="kicker">Hoje</p>
        <h1>Você aceitou Jesus?</h1>
        <p className="lead">
          Deixe seu nome, cidade e WhatsApp. Uma liderança da sua região vai caminhar com você.
        </p>
        <div className="stack">
          <Link className="btn" href="/decisao">
            Quero ser acompanhado
          </Link>
          <Link className="btn btn-ghost" href="/equipe">
            Área da equipe
          </Link>
        </div>
      </main>
      <footer className="rodape">
        Seus dados ficam guardados só para o acompanhamento da Cruzada Evangelística. Cristo a Verdade que
        Liberta.
      </footer>
    </>
  );
}
