"use client";

import { useState } from "react";

type Chamada = "presencial" | "online";

export function FormularioSaude() {
  const [chamada, setChamada] = useState<Chamada>("presencial");
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    try {
      const resposta = await fetch("/api/atendimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: "saude",
          tipoChamada: chamada,
          nome: dados.get("nome"),
          telefone: dados.get("telefone"),
          especialidade: dados.get("especialidade"),
          sintomas: dados.get("sintomas"),
          motivo: dados.get("motivo"),
        }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível salvar a ficha.");
        return;
      }
      setSalvo(true);
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  if (salvo) {
    return (
      <section className="sucesso stack" role="status">
        <h2>Ficha de saúde salva</h2>
        <p>Pode chamar a próxima pessoa.</p>
        <button className="btn" type="button" onClick={() => setSalvo(false)}>
          Registrar outra pessoa
        </button>
      </section>
    );
  }

  return (
    <form className="stack" onSubmit={enviar}>
      <div className="opcoes" role="radiogroup" aria-label="Onde está a pessoa">
        <button type="button" className="choice" aria-pressed={chamada === "presencial"} onClick={() => setChamada("presencial")}>
          Presencial
        </button>
        <button type="button" className="choice" aria-pressed={chamada === "online"} onClick={() => setChamada("online")}>
          Online
        </button>
      </div>
      <label className="campo">
        <span>Nome da pessoa</span>
        <input name="nome" autoComplete="name" required maxLength={120} />
      </label>
      <label className="campo">
        <span>WhatsApp (com DDD)</span>
        <input name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 99999-9999" required />
      </label>
      <label className="campo">
        <span>O que a pessoa está sentindo</span>
        <textarea name="sintomas" required maxLength={2000} placeholder="Ex.: dor de cabeça, pressão alta" />
      </label>
      <label className="campo">
        <span>O que trouxe a pessoa até aqui</span>
        <textarea name="motivo" required maxLength={2000} placeholder="Ex.: veio buscar oração e um cuidado" />
      </label>
      <label className="campo">
        <span>Especialidade de quem atendeu</span>
        <input name="especialidade" required maxLength={80} placeholder="Ex.: clínico geral" defaultValue="Clínico geral" />
      </label>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar ficha de saúde"}
      </button>
    </form>
  );
}
