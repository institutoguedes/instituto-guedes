"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AREAS, CHAMADAS, dicaEspecialidade, rotuloArea, rotuloChamada, type Area, type Chamada } from "@/lib/domain";

export function AtendimentoForm() {
  const router = useRouter();
  const [area, setArea] = useState<Area | "">("");
  const [chamada, setChamada] = useState<Chamada | "">("");
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setOk(false);
    if (!area || !chamada) {
      setErro("Escolha a área e o tipo de chamada.");
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
          profissional: dados.get("profissional"),
          sintomas: dados.get("sintomas"),
          motivo: dados.get("motivo"),
          observacoes: dados.get("observacoes"),
        }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível salvar a ficha.");
        return;
      }
      evento.currentTarget.reset();
      setArea("");
      setChamada("");
      setOk(true);
      router.refresh();
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="stack" onSubmit={enviar}>
      <fieldset className="stack">
        <legend className="campo">Área do atendimento</legend>
        <div className="opcoes" role="radiogroup" aria-label="Área do atendimento">
          {AREAS.map((item) => (
            <button
              key={item}
              type="button"
              className="choice"
              aria-pressed={area === item}
              onClick={() => setArea(item)}
            >
              {rotuloArea(item)}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="stack">
        <legend className="campo">Tipo de chamada</legend>
        <div className="opcoes" role="radiogroup" aria-label="Tipo de chamada">
          {CHAMADAS.map((item) => (
            <button
              key={item}
              type="button"
              className="choice"
              aria-pressed={chamada === item}
              onClick={() => setChamada(item)}
            >
              {rotuloChamada(item)}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="campo">
        <span>Nome da pessoa</span>
        <input name="nome" autoComplete="name" required maxLength={120} />
      </label>
      <label className="campo">
        <span>Telefone</span>
        <input name="telefone" type="tel" inputMode="tel" autoComplete="tel" placeholder="71 99999-9999" required />
      </label>
      <label className="campo">
        <span>Especialidade</span>
        <input
          name="especialidade"
          required
          maxLength={80}
          placeholder={area ? dicaEspecialidade(area) : "Ex.: clínico geral"}
        />
      </label>
      <label className="campo">
        <span>Quem atendeu</span>
        <input name="profissional" maxLength={120} placeholder="Opcional" />
      </label>
      {area === "saude" ? (
        <>
          <label className="campo">
            <span>Sintomas</span>
            <textarea name="sintomas" required maxLength={2000} />
          </label>
          <label className="campo">
            <span>O que trouxe a pessoa ao evento</span>
            <textarea name="motivo" required maxLength={2000} />
          </label>
        </>
      ) : null}
      <label className="campo">
        <span>Observações</span>
        <textarea name="observacoes" maxLength={2000} placeholder="Opcional" />
      </label>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      {ok ? (
        <p className="sucesso" role="status">
          Ficha salva.
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar ficha"}
      </button>
    </form>
  );
}
