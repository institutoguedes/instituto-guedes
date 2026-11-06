import { formatarData, formatarTelefone, linkWhatsApp } from "@/lib/format";

const DESTINO = "advogado-luciano@live.com";
const REMETENTE = "Cruzada Evangelística <cruzada@kauanguedes.com>";

export async function avisarCadastro(dados: {
  origem: string;
  nome: string;
  telefone: string;
  cidade?: string | null;
  nascimento?: string | null;
  extra?: string | null;
}): Promise<boolean> {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) {
    console.error("RESEND_API_KEY ausente; o cadastro ficou salvo, o aviso não saiu.");
    return false;
  }

  const telefone = formatarTelefone(dados.telefone);
  const linhas = [
    `Novo contato na Cruzada Evangelística (${dados.origem}).`,
    "",
    `Nome: ${dados.nome}`,
    dados.cidade ? `Cidade: ${dados.cidade}` : null,
    dados.nascimento ? `Nascimento: ${formatarData(dados.nascimento)}` : null,
    `WhatsApp: ${telefone}`,
    `Abrir conversa: ${linkWhatsApp(dados.telefone, dados.nome)}`,
    dados.extra ? "" : null,
    dados.extra,
    "",
    "O cadastro também está salvo no banco do site.",
  ].filter((linha) => linha != null);

  try {
    const resposta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMETENTE,
        to: [DESTINO],
        subject: `Cruzada: ${dados.origem} — ${dados.nome}`,
        text: linhas.join("\n"),
      }),
    });
    if (!resposta.ok) {
      console.error("Falha ao avisar por e-mail", resposta.status, await resposta.text());
      return false;
    }
    return true;
  } catch (erro) {
    console.error(erro);
    return false;
  }
}
