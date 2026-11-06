import Link from "next/link";

export function Marca({ compact = false }: { compact?: boolean }) {
  return (
    <header className={compact ? "marca compact" : "marca"}>
      <Link href="/">
        <img
          src="/logo.webp"
          width={720}
          height={500}
          alt="Cruzada Evangelística. Cristo a Verdade que Liberta."
        />
      </Link>
    </header>
  );
}
