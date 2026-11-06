"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CestaForm({ restantes }: { restantes: number }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (restantes <= 0) {
    return (
      <p className="aviso" role="status">
        As cestas disponíveis já foram entregues.
      </p>
    );
  }

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    try {
      const resposta = await fetch("/api/cestas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.get("nome"),
          telefone: dados.get("telefone"),
          cidade: dados.get("cidade"),
          quantidade: Number(dados.get("quantidade")),
        }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível registrar a entrega.");
        return;
      }
      evento.currentTarget.reset();
      router.refresh();
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="stack" onSubmit={enviar}>
      <label className="campo">
        <span>Nome de quem recebe</span>
        <input name="nome" autoComplete="name" required maxLength={120} />
      </label>
      <label className="campo">
        <span>Telefone</span>
        <input name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" required />
      </label>
      <label className="campo">
        <span>Cidade</span>
        <input name="cidade" autoComplete="address-level2" required maxLength={120} />
      </label>
      <label className="campo">
        <span>Quantidade</span>
        <select name="quantidade" defaultValue="1">
          <option value="1">1 cesta</option>
          <option value="2">2 cestas</option>
          <option value="3">3 cestas</option>
          <option value="4">4 cestas</option>
          <option value="5">5 cestas</option>
        </select>
      </label>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={enviando}>
        {enviando ? "Registrando..." : "Registrar entrega"}
      </button>
    </form>
  );
}
