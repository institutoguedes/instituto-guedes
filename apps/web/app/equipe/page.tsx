import { redirect } from "next/navigation";
import { ehEquipe } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { Marca } from "@/components/Marca";

export default async function EquipePage() {
  if (await ehEquipe()) {
    redirect("/equipe/painel");
  }

  return (
    <>
      <Marca compact />
      <main className="sheet">
        <p className="kicker">Equipe</p>
        <h1>Entrar</h1>
        <p className="lead">Fichas, decisões e cestas ficam nesta área. Peça o código a quem organiza a cruzada.</p>
        <LoginForm />
      </main>
    </>
  );
}
