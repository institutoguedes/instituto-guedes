"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LiberarCelular() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function liberar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    try {
      const resposta = await fetch("/api/sessao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: dados.get("pin") }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível liberar este celular.");
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
    <form className="stack" onSubmit={liberar}>
      <p className="lead">Esta aba é da equipe. O código libera este celular até o fim do dia. Não precisa digitar de novo.</p>
      <label className="campo">
        <span>Código da equipe</span>
        <input name="pin" type="password" inputMode="numeric" autoComplete="current-password" required />
      </label>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={enviando}>
        {enviando ? "Liberando..." : "Liberar este celular"}
      </button>
    </form>
  );
}
