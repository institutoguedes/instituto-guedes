const FUSO = "America/Bahia";

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  if (!ano || !mes || !dia) {
    return iso;
  }
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(valor: string): string {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    return valor;
  }
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: FUSO,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
}

export function formatarTelefone(canonico: string): string {
  const local = canonico.startsWith("55") ? canonico.slice(2) : canonico;
  if (local.length === 11) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `+55 (${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return `+${canonico}`;
}

export function primeiroNome(nome: string): string {
  return nome.split(" ")[0] ?? nome;
}

export function mensagemAcompanhamento(nome: string): string {
  const pessoa = primeiroNome(nome);
  return `Olá, ${pessoa}! Aqui é da Cruzada Evangelística. Ficamos felizes com a sua decisão por Jesus. Queremos caminhar com você. Cristo é a verdade que liberta.`;
}

export function linkWhatsApp(canonico: string, nome: string): string {
  const texto = encodeURIComponent(mensagemAcompanhamento(nome));
  return `https://wa.me/${canonico}?text=${texto}`;
}
