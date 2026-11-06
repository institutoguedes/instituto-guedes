import Link from "next/link";
import { AtendimentoForm } from "@/components/AtendimentoForm";
import { MolduraEquipe } from "@/components/MolduraEquipe";
import { AREAS, rotuloArea, rotuloChamada, type Area } from "@/lib/domain";
import { formatarDataHora, formatarTelefone } from "@/lib/format";
import { exigirEquipe } from "@/lib/guard";
import { listarAtendimentos } from "@/lib/queries";
import { validarArea } from "@/lib/validators";

export default async function AtendimentosPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  await exigirEquipe();
  const { area: areaParam } = await searchParams;
  const areaInformada = validarArea(areaParam);
  const area: Area | null = areaInformada.ok ? areaInformada.valor : null;

  try {
    const fichas = await listarAtendimentos(area, 200);
    return (
      <MolduraEquipe>
        <main className="sheet">
          <p className="kicker">Atendimento</p>
          <h1>Nova ficha</h1>
          <p className="lead">Jurídico, psicólogo, espiritual ou saúde. No celular da equipe, no momento do atendimento.</p>
          <AtendimentoForm />
          <h2>Registradas</h2>
          <nav className="filtros" aria-label="Filtrar por área">
            <Link href="/equipe/atendimentos" aria-current={area ? undefined : "page"}>
              Todas
            </Link>
            {AREAS.map((item) => (
              <Link key={item} href={`/equipe/atendimentos?area=${item}`} aria-current={area === item ? "page" : undefined}>
                {rotuloArea(item)}
              </Link>
            ))}
          </nav>
          <p className="mudo">
            <a href="/api/atendimentos?format=csv">Baixar planilha</a>
          </p>
          <div className="stack">
            {fichas.length === 0 ? <p className="card">Nenhuma ficha nesta lista.</p> : null}
            {fichas.map((ficha) => (
              <article className="registro" key={ficha.id}>
                <header>
                  <strong>{ficha.nome}</strong>
                  <time dateTime={ficha.criadoEm}>{formatarDataHora(ficha.criadoEm)}</time>
                </header>
                <p>
                  <span className="selo">{rotuloArea(ficha.area)}</span> {rotuloChamada(ficha.tipoChamada)}
                </p>
                <p>
                  {ficha.especialidade}
                  {ficha.profissional ? ` · ${ficha.profissional}` : ""}
                </p>
                <p>{formatarTelefone(ficha.telefone)}</p>
                {ficha.sintomas ? <p>Sintomas: {ficha.sintomas}</p> : null}
                {ficha.motivo ? <p>Veio ao evento porque: {ficha.motivo}</p> : null}
                {ficha.observacoes ? <p>{ficha.observacoes}</p> : null}
              </article>
            ))}
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
            Não foi possível ler as fichas. Tente de novo em instantes.
          </p>
        </main>
      </MolduraEquipe>
    );
  }
}
