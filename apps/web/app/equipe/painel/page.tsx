import Link from "next/link";
import { ExportarWhatsApp } from "@/components/ExportarWhatsApp";
import { MolduraEquipe } from "@/components/MolduraEquipe";
import { Sair } from "@/components/Sair";
import { exigirEquipe } from "@/lib/guard";
import { resumo } from "@/lib/queries";

export default async function PainelPage() {
  await exigirEquipe();
  try {
    const dados = await resumo();
    return (
      <MolduraEquipe>
        <main className="sheet">
          <p className="kicker">Equipe</p>
          <h1>Painel</h1>
          <p className="lead">Horário da Bahia. Os números de hoje reiniciam à meia-noite.</p>
          <div className="numeros stack">
            <Link className="card numero" href="/equipe/decisoes">
              <b>{dados.decisoesHoje}</b>
              <span>decisões hoje</span>
              <small>{dados.decisoes} no total · ver lista</small>
            </Link>
            <Link className="card numero" href="/equipe/atendimentos">
              <b>{dados.atendimentosHoje}</b>
              <span>fichas hoje</span>
              <small>{dados.atendimentos} no total · nova ficha</small>
            </Link>
            <Link className="card numero" href="/equipe/cestas">
              <b>{dados.restantes}</b>
              <span>cestas restantes</span>
              <small>
                {dados.entregues} entregues de {dados.total}
              </small>
            </Link>
          </div>
          <div className="stack">
            <ExportarWhatsApp />
            <Sair />
          </div>
        </main>
      </MolduraEquipe>
    );
  } catch (erro) {
    console.error(erro);
    return (
      <MolduraEquipe>
        <main className="sheet">
          <p className="aviso" role="alert">
            Não foi possível ler os registros. Tente de novo em instantes.
          </p>
        </main>
      </MolduraEquipe>
    );
  }
}
