import type { Metadata } from "next";
import { Casca } from "@/components/Casca";
import { FormularioAtendimento } from "@/components/FormularioAtendimento";

export const metadata: Metadata = { title: "Atendimento Online" };

export default function AtendimentoPage() {
  return (
    <Casca atual="atendimento">
      <h1>Atendimento</h1>
      <p className="lead">Escolha jurídico, psicólogo ou espiritual. Depois o nome e o telefone.</p>
      <FormularioAtendimento />
    </Casca>
  );
}
