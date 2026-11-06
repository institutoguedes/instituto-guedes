"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/equipe/painel", rotulo: "Início" },
  { href: "/equipe/decisoes", rotulo: "Decisões" },
  { href: "/equipe/atendimentos", rotulo: "Fichas" },
  { href: "/equipe/cestas", rotulo: "Cestas" },
];

export function StaffDock() {
  const caminho = usePathname();
  return (
    <nav className="dock" aria-label="Equipe">
      {ITENS.map((item) => {
        const ativo = caminho === item.href;
        return (
          <Link key={item.href} href={item.href} aria-current={ativo ? "page" : undefined}>
            {item.rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
