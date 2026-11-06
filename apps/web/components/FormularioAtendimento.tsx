"use client";

import { useState } from "react";
import { CHAMADAS, rotuloChamada, type Area, type Chamada } from "@/lib/domain";

const AREAS_ONLINE = ["juridico", "psicologo", "espiritual"] as const;

function rotulo(area: (typeof AREAS_ONLINE)[number]): string {
  switch (area) {
    case "juridico":
      return "Jurídico";
    case "psicologo":
      return "Psicólogo";
    case "espiritual":
      return "Espiritual";
    default: {
      const completo: never = area;
      return completo;
    }
  }
}

export function FormularioAtendimento() {
  const [area, setArea] = useState<Area | "">("");
  const [chamada, setChamada] = useState<Chamada | "">("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    if (!area || !chamada) {
      setErro("Escolha o tipo de atendimento e como foi a chamada.");
      return;
    }
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    try {
      const resposta = await fetch("/api/atendimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area,
          tipoChamada: chamada,
          nome: dados.get("nome"),
          telefone: dados.get("telefone"),
          especialidade: dados.get("especialidade"),
        }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível salvar.");
        return;
      }
      setSalvo(true);
      setArea("");
      setChamada("");
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  if (salvo) {
    return (
      <section className="sucesso stack" role="status">
        <h2>Atendimento salvo</h2>
        <p>Pode chamar a próxima pessoa.</p>
        <button className="btn" type="button" onClick={() => setSalvo(false)}>
          Registrar outra pessoa
        </button>
      </section>
    );
  }

  return (
    <form className="stack" onSubmit={enviar}>
      <p className="campo">Qual atendimento?</p>
      <div className="stack" role="radiogroup" aria-label="Qual atendimento">
        {AREAS_ONLINE.map((item) => (
          <button key={item} type="button" className="choice" aria-pressed={area === item} onClick={() => setArea(item)}>
            {rotulo(item)}
          </button>
        ))}
      </div>
      <p className="campo">Como foi a chamada?</p>
      <div className="opcoes" role="radiogroup" aria-label="Como foi a chamada">
        {CHAMADAS.map((item) => (
          <button key={item} type="button" className="choice" aria-pressed={chamada === item} onClick={() => setChamada(item)}>
            {rotuloChamada(item)}
          </button>
        ))}
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
        <span>Especialidade</span>
        <input name="especialidade" required maxLength={80} placeholder="Ex.: direito de família" />
      </label>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar atendimento"}
      </button>
    </form>
  );
}
