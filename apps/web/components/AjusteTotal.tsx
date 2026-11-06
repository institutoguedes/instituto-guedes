"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AjusteTotal({ total }: { total: number }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    try {
      const resposta = await fetch("/api/cestas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total: Number(dados.get("total")) }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível ajustar o total.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <details>
      <summary>Ajustar o total recebido</summary>
      <form className="stack" onSubmit={salvar}>
        <label className="campo">
          <span>Total de cestas</span>
          <input name="total" type="number" min={0} max={500} defaultValue={total} required />
        </label>
        {erro ? (
          <p className="aviso" role="alert">
            {erro}
          </p>
        ) : null}
        <button className="btn btn-ghost" type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : "Atualizar total"}
        </button>
      </form>
    </details>
  );
}
