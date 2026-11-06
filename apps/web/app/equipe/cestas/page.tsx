import { AjusteTotal } from "@/components/AjusteTotal";
import { CestaForm } from "@/components/CestaForm";
import { DesfazerEntrega } from "@/components/DesfazerEntrega";
import { MolduraEquipe } from "@/components/MolduraEquipe";
import { formatarDataHora, formatarTelefone } from "@/lib/format";
import { exigirEquipe } from "@/lib/guard";
import { estoque, listarEntregas } from "@/lib/queries";

export default async function CestasPage() {
  await exigirEquipe();
  try {
    const [caixa, entregas] = await Promise.all([estoque(), listarEntregas(200)]);
    const percentual = caixa.total === 0 ? 0 : Math.round((caixa.restantes / caixa.total) * 100);
    return (
      <MolduraEquipe>
        <main className="sheet">
          <p className="kicker">Doações</p>
          <h1>Cestas básicas</h1>
          <section className="card stack">
            <p>
              <b className="numero-inline">{caixa.restantes}</b> restantes de {caixa.total}
            </p>
            <div className={caixa.restantes <= 10 ? "medidor baixo" : "medidor"} aria-hidden="true">
              <span style={{ width: `${percentual}%` }} />
            </div>
            <p className="mudo">{caixa.entregues} já entregues</p>
            <CestaForm restantes={caixa.restantes} />
            <AjusteTotal total={caixa.total} />
          </section>
          <p className="mudo">
            <a href="/api/cestas?format=csv">Baixar planilha</a>
          </p>
          <div className="stack">
            {entregas.length === 0 ? <p className="card">Nenhuma cesta entregue ainda.</p> : null}
            {entregas.map((entrega) => (
              <article className="registro" key={entrega.id}>
                <header>
                  <strong>{entrega.nome}</strong>
                  <time dateTime={entrega.criadoEm}>{formatarDataHora(entrega.criadoEm)}</time>
                </header>
                <p>
                  {entrega.quantidade} {entrega.quantidade === 1 ? "cesta" : "cestas"} · {entrega.cidade}
                </p>
                <p>{formatarTelefone(entrega.telefone)}</p>
                <DesfazerEntrega id={entrega.id} />
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
            Não foi possível ler as cestas. Tente de novo em instantes.
          </p>
        </main>
      </MolduraEquipe>
    );
  }
}
