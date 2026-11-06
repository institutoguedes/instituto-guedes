import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Casca } from "@/components/Casca";
import { DecisaoForm } from "@/components/DecisaoForm";

export const metadata: Metadata = {
  title: { absolute: "Aceitei Jesus — Cruzada Evangelística" },
  description:
    "Você aceitou Jesus na Cruzada Evangelística? Deixe seu contato para ser acompanhado por líderes da sua região.",
};

export default async function Inicio({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba } = await searchParams;
  if (aba === "saude") {
    redirect("/saude");
  }
  if (aba === "atendimento") {
    redirect("/atendimento");
  }
  if (aba === "cestas") {
    redirect("/cestas");
  }

  return (
    <Casca atual="decisao">
      <h1>Aceitei Jesus hoje</h1>
      <p className="lead">Deixe seus dados para ser acompanhado por líderes e igrejas da sua região.</p>
      <DecisaoForm />
    </Casca>
  );
}
