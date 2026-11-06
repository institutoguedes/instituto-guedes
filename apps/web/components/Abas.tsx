import Link from "next/link";

const ABAS = [
  { id: "decisao", href: "/", rotulo: "Aceitei Jesus" },
  { id: "saude", href: "/?aba=saude", rotulo: "Saúde" },
  { id: "atendimento", href: "/?aba=atendimento", rotulo: "Atendimento Online" },
  { id: "cestas", href: "/?aba=cestas", rotulo: "Cestas Básicas" },
] as const;

export type AbaEvento = (typeof ABAS)[number]["id"];

export function abaEvento(valor: string | undefined): AbaEvento {
  switch (valor) {
    case "saude":
    case "atendimento":
    case "cestas":
      return valor;
    default:
      return "decisao";
  }
}

export function Abas({ atual }: { atual: AbaEvento }) {
  return (
    <nav className="abas" aria-label="O que você vai registrar">
      {ABAS.map((aba) => (
        <Link key={aba.id} href={aba.href} aria-current={atual === aba.id ? "page" : undefined}>
          {aba.rotulo}
        </Link>
      ))}
    </nav>
  );
}
