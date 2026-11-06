import type { Metadata } from "next";
import { Casca } from "@/components/Casca";
import { CestaForm } from "@/components/CestaForm";
import type { Estoque } from "@/lib/domain";
import { estoque } from "@/lib/queries";

export const metadata: Metadata = { title: "Cestas Básicas" };
export const dynamic = "force-dynamic";

const VAZIO: Estoque = { total: 50, entregues: 0, restantes: 50 };

export default async function CestasPage() {
  let caixa = VAZIO;
  try {
    caixa = await estoque();
  } catch (erro) {
    console.error(erro);
  }

  return (
    <Casca atual="cestas">
      <h1>Cestas básicas</h1>
      <p className="lead">
        {caixa.restantes} restantes de {caixa.total}. Cada entrega diminui esse número sozinha.
      </p>
      <CestaForm restantes={caixa.restantes} />
    </Casca>
  );
}
