import type { Metadata } from "next";
import Link from "next/link";
import { Abas, abaEvento } from "@/components/Abas";
import { CestaForm } from "@/components/CestaForm";
import { DecisaoForm } from "@/components/DecisaoForm";
import { FormularioAtendimento } from "@/components/FormularioAtendimento";
import { FormularioSaude } from "@/components/FormularioSaude";
import { LiberarCelular } from "@/components/LiberarCelular";
import { Marca } from "@/components/Marca";
import { ehEquipe } from "@/lib/auth";
import type { Estoque } from "@/lib/domain";
import { estoque } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Cruzada Evangelística",
};

export const dynamic = "force-dynamic";

const VAZIO: Estoque = { total: 50, entregues: 0, restantes: 50 };

export default async function Inicio({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba: abaParam } = await searchParams;
  const aba = abaEvento(abaParam);
  const equipe = await ehEquipe();
  let caixa = VAZIO;
  if (aba === "cestas") {
    try {
      caixa = await estoque();
    } catch (erro) {
      console.error(erro);
    }
  }

  return (
    <>
      <Marca />
      <Abas atual={aba} />
      <main className="folha">
        {aba === "decisao" ? (
          <>
            <h1>Aceitei Jesus hoje</h1>
            <p className="lead">Deixe seus dados para ser acompanhado por líderes e igrejas da sua região.</p>
            <DecisaoForm />
          </>
        ) : null}
        {aba === "saude" ? (
          <>
            <h1>Ficha de saúde</h1>
            <p className="lead">Anote o que a pessoa sente e por que veio. Leva menos de um minuto.</p>
            {equipe ? <FormularioSaude /> : <LiberarCelular />}
          </>
        ) : null}
        {aba === "atendimento" ? (
          <>
            <h1>Atendimento</h1>
            <p className="lead">Escolha jurídico, psicólogo ou espiritual. Depois o nome e o telefone.</p>
            {equipe ? <FormularioAtendimento /> : <LiberarCelular />}
          </>
        ) : null}
        {aba === "cestas" ? (
          <>
            <h1>Cestas básicas</h1>
            <p className="lead">
              {caixa.restantes} restantes de {caixa.total}. Cada entrega diminui esse número sozinha.
            </p>
            {equipe ? <CestaForm restantes={caixa.restantes} /> : <LiberarCelular />}
          </>
        ) : null}
      </main>
      <p className="ajuda">
        <Link href="/equipe">Equipe: ver listas e baixar para o WhatsApp</Link>
      </p>
    </>
  );
}
