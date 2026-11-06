export const AREAS = ["juridico", "psicologo", "espiritual", "saude"] as const;
export type Area = (typeof AREAS)[number];

export const CHAMADAS = ["presencial", "online", "whatsapp", "ligacao"] as const;
export type Chamada = (typeof CHAMADAS)[number];

export type Decisao = {
  id: string;
  nome: string;
  dataNascimento: string;
  cidade: string;
  whatsapp: string;
  criadoEm: string;
};

export type Atendimento = {
  id: string;
  area: Area;
  tipoChamada: Chamada;
  nome: string;
  telefone: string;
  especialidade: string;
  profissional: string | null;
  sintomas: string | null;
  motivo: string | null;
  observacoes: string | null;
  criadoEm: string;
};

export type Entrega = {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
  quantidade: number;
  criadoEm: string;
};

export type Estoque = {
  total: number;
  entregues: number;
  restantes: number;
};

export function rotuloArea(area: Area): string {
  switch (area) {
    case "juridico":
      return "Jurídico";
    case "psicologo":
      return "Psicólogo";
    case "espiritual":
      return "Espiritual";
    case "saude":
      return "Saúde";
    default: {
      const completo: never = area;
      return completo;
    }
  }
}

export function rotuloChamada(chamada: Chamada): string {
  switch (chamada) {
    case "presencial":
      return "Presencial";
    case "online":
      return "Online";
    case "whatsapp":
      return "WhatsApp";
    case "ligacao":
      return "Ligação";
    default: {
      const completo: never = chamada;
      return completo;
    }
  }
}

export function dicaEspecialidade(area: Area): string {
  switch (area) {
    case "juridico":
      return "Ex.: direito de família";
    case "psicologo":
      return "Ex.: escuta e acolhimento";
    case "espiritual":
      return "Ex.: oração e aconselhamento";
    case "saude":
      return "Ex.: clínico geral";
    default: {
      const completo: never = area;
      return completo;
    }
  }
}
