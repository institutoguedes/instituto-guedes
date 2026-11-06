import Link from "next/link";
import { Marca } from "@/components/Marca";

export default function NaoEncontrada() {
  return (
    <>
      <Marca compact />
      <main className="sheet">
        <h1>Página não encontrada</h1>
        <p className="lead">Esse caminho não existe na Cruzada.</p>
        <div className="stack">
          <Link className="btn" href="/">
            Voltar ao início
          </Link>
        </div>
      </main>
    </>
  );
}
