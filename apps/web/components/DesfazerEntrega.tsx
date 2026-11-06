"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DesfazerEntrega({ id }: { id: string }) {
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function desfazer() {
    setEnviando(true);
    setErro(null);
    try {
      const resposta = await fetch(`/api/cestas/${id}`, { method: "DELETE" });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível desfazer.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  if (!confirmar) {
    return (
      <button className="btn btn-ghost" type="button" onClick={() => setConfirmar(true)}>
        Desfazer
      </button>
    );
  }

  return (
    <div className="stack">
      <p>Devolver esta cesta ao estoque?</p>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      <button className="btn btn-ink" type="button" onClick={desfazer} disabled={enviando}>
        {enviando ? "Desfazendo..." : "Sim, desfazer"}
      </button>
      <button className="btn btn-ghost" type="button" onClick={() => setConfirmar(false)} disabled={enviando}>
        Cancelar
      </button>
    </div>
  );
}
