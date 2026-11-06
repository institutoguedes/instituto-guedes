import Link from "next/link";
import { Abas, type AbaEvento } from "@/components/Abas";
import { Marca } from "@/components/Marca";

export function Casca({ atual, children }: { atual: AbaEvento; children: React.ReactNode }) {
  return (
    <div className="pagina">
      <header className="topo">
        <Marca />
        <Abas atual={atual} />
      </header>
      <main className="folha">{children}</main>
      <p className="ajuda">
        <Link href="/equipe">Baixar contatos para o WhatsApp</Link>
      </p>
    </div>
  );
}
