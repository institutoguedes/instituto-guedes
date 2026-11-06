import Link from "next/link";
import { ExportarWhatsApp } from "@/components/ExportarWhatsApp";
import { MolduraEquipe } from "@/components/MolduraEquipe";
import { formatarData, formatarDataHora, formatarTelefone, linkWhatsApp } from "@/lib/format";
import { listarDecisoes } from "@/lib/queries";
import { buscaLivre } from "@/lib/validators";

export default async function DecisoesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const busca = buscaLivre(q);

  try {
    const decisoes = await listarDecisoes(busca, 200);
    return (
      <MolduraEquipe>
        <main className="sheet">
          <p className="kicker">Acompanhamento</p>
          <h1>Decisões</h1>
          <p className="lead">Toque em enviar para abrir o WhatsApp de uma pessoa, ou baixe a lista inteira.</p>
          <ExportarWhatsApp />
          <form className="busca stack" action="/equipe/decisoes">
            <label className="campo">
              <span>Buscar</span>
              <input name="q" defaultValue={busca ?? ""} placeholder="Nome, cidade ou telefone" />
            </label>
            <button className="btn btn-ink" type="submit">
              Buscar
            </button>
          </form>
          <div className="stack">
            {decisoes.length === 0 ? <p className="card">Nenhuma decisão registrada ainda.</p> : null}
            {decisoes.map((decisao) => (
              <article className="registro" key={decisao.id}>
                <header>
                  <strong>{decisao.nome}</strong>
                  <time dateTime={decisao.criadoEm}>{formatarDataHora(decisao.criadoEm)}</time>
                </header>
                <p>
                  {decisao.cidade} · nascimento {formatarData(decisao.dataNascimento)}
                </p>
                <p>{formatarTelefone(decisao.whatsapp)}</p>
                <a className="btn" href={linkWhatsApp(decisao.whatsapp, decisao.nome)} target="_blank" rel="noreferrer">
                  Enviar mensagem no WhatsApp
                </a>
              </article>
            ))}
          </div>
          <p className="mudo">
            <Link href="/equipe/painel">Voltar ao painel</Link>
          </p>
        </main>
      </MolduraEquipe>
    );
  } catch (erro) {
    console.error(erro);
    return (
      <MolduraEquipe>
        <main className="sheet">
          <p className="aviso" role="alert">
            Não foi possível ler as decisões. Tente de novo em instantes.
          </p>
        </main>
      </MolduraEquipe>
    );
  }
}
