import type { Metadata } from "next";
import { Casca } from "@/components/Casca";
import { FormularioSaude } from "@/components/FormularioSaude";

export const metadata: Metadata = { title: "Saúde" };

export default function SaudePage() {
  return (
    <Casca atual="saude">
      <h1>Ficha de saúde</h1>
      <p className="lead">Anote o que a pessoa sente e por que veio. Leva menos de um minuto.</p>
      <FormularioSaude />
    </Casca>
  );
}
