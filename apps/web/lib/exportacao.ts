import type { Decisao } from "./domain";
import { formatarData, formatarDataHora, formatarTelefone, mensagemAcompanhamento } from "./format";

export type RegistroCompleto = {
  origem: string;
  nome: string;
  telefone: string;
  cidade: string;
  dataNascimento: string;
  detalhe: string;
  criadoEm: string;
};

function escaparVcard(valor: string): string {
  return valor.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function linhasInscritos(decisoes: Decisao[]): string[][] {
  return [
    ["nome", "data_nascimento", "cidade", "whatsapp", "whatsapp_formatado", "mensagem", "registrado_em"],
    ...decisoes.map((decisao) => [
      decisao.nome,
      formatarData(decisao.dataNascimento),
      decisao.cidade,
      decisao.whatsapp,
      formatarTelefone(decisao.whatsapp),
      mensagemAcompanhamento(decisao.nome),
      formatarDataHora(decisao.criadoEm),
    ]),
  ];
}

export function linhasRegistros(registros: RegistroCompleto[]): string[][] {
  return [
    ["origem", "nome", "whatsapp", "whatsapp_formatado", "cidade", "data_nascimento", "detalhe", "mensagem", "registrado_em"],
    ...registros.map((registro) => [
      registro.origem,
      registro.nome,
      registro.telefone,
      formatarTelefone(registro.telefone),
      registro.cidade,
      registro.dataNascimento ? formatarData(registro.dataNascimento) : "",
      registro.detalhe,
      registro.origem === "Decisão" ? mensagemAcompanhamento(registro.nome) : "",
      formatarDataHora(registro.criadoEm),
    ]),
  ];
}

export function listaNumeros(telefones: string[]): string {
  const unicos = [...new Set(telefones.map((telefone) => telefone.replace(/\D/g, "")).filter(Boolean))];
  return `${unicos.join("\r\n")}\r\n`;
}

export function cartaoContatos(contatos: { nome: string; telefone: string; nota: string }[]): string {
  const vistos = new Set<string>();
  const cartoes: string[] = [];
  for (const contato of contatos) {
    const numero = contato.telefone.replace(/\D/g, "");
    if (!numero || vistos.has(numero)) {
      continue;
    }
    vistos.add(numero);
    cartoes.push(
      [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${escaparVcard(contato.nome)}`,
        `TEL;TYPE=CELL:+${numero}`,
        `NOTE:${escaparVcard(contato.nota)}`,
        "END:VCARD",
      ].join("\r\n"),
    );
  }
  return `${cartoes.join("\r\n")}\r\n`;
}
