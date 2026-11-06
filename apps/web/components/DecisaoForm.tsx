"use client";

import { useState } from "react";

type Estado = "formulario" | "salvo" | "repetido";

export function DecisaoForm() {
  const [estado, setEstado] = useState<Estado>("formulario");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    const dados = new FormData(evento.currentTarget);
    try {
      const resposta = await fetch("/api/decisoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: dados.get("nome"),
          dataNascimento: dados.get("dataNascimento"),
          cidade: dados.get("cidade"),
          whatsapp: dados.get("whatsapp"),
          autoriza: dados.get("autoriza") === "on",
          empresa: dados.get("empresa"),
        }),
      });
      const corpo = (await resposta.json()) as { ok?: boolean; erro?: string; jaExistia?: boolean };
      if (!resposta.ok || !corpo.ok) {
        setErro(corpo.erro ?? "Não foi possível salvar. Tente de novo.");
        return;
      }
      setEstado(corpo.jaExistia ? "repetido" : "salvo");
    } catch {
      setErro("Sem conexão. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  if (estado !== "formulario") {
    return (
      <section className="card sucesso" role="status">
        <h2>{estado === "salvo" ? "Que alegria." : "Contato já registrado."}</h2>
        <p>
          {estado === "salvo"
            ? "Seu contato foi guardado. Em breve alguém da sua região vai falar com você pelo WhatsApp."
            : "Esse WhatsApp já foi registrado hoje. A liderança já tem o seu contato."}
        </p>
      </section>
    );
  }

  return (
    <form className="stack" onSubmit={enviar}>
      <label className="campo">
        <span>Nome completo</span>
        <input name="nome" autoComplete="name" required maxLength={120} />
      </label>
      <label className="campo">
        <span>Data de nascimento</span>
        <input name="dataNascimento" type="date" autoComplete="bday" required />
      </label>
      <label className="campo">
        <span>Cidade</span>
        <input name="cidade" autoComplete="address-level2" placeholder="Ex.: Salvador" required maxLength={120} />
      </label>
      <label className="campo">
        <span>WhatsApp</span>
        <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="71 99999-9999" required />
      </label>
      <label className="consent">
        <input name="autoriza" type="checkbox" required />
        <span>Autorizo uma liderança da Cruzada a entrar em contato para caminhar comigo.</span>
      </label>
      <div className="hp" aria-hidden="true">
        <label>
          Empresa
          <input name="empresa" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {erro ? (
        <p className="aviso" role="alert">
          {erro}
        </p>
      ) : null}
      <button className="btn" type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Guardar meu contato"}
      </button>
    </form>
  );
}
