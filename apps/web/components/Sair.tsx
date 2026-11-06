"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function Sair() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    await fetch("/api/sessao", { method: "DELETE" });
    router.push("/equipe");
    router.refresh();
  }

  return (
    <button className="btn btn-ghost" type="button" onClick={sair} disabled={saindo}>
      {saindo ? "Saindo..." : "Sair da equipe"}
    </button>
  );
}
