"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: React.FormEvent<HTMLFormElement>) {
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
        setErro(corpo.erro ?? "Não foi possível entrar.");
        return;
      }
      router.push("/equipe/painel");
      router.refresh();
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="stack" onSubmit={entrar}>
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
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
