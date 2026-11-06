import { AREAS, CHAMADAS, type Area, type Chamada } from "./domain";

export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

const HOJE = "America/Bahia";

export function hojeBahia(agora = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: HOJE }).format(agora);
}

export function validarNome(entrada: unknown, rotulo = "nome"): Resultado<string> {
  if (typeof entrada !== "string") {
    return { ok: false, erro: `Informe o ${rotulo}.` };
  }
  const nome = entrada.trim().replace(/\s+/g, " ");
  if (nome.length < 3 || nome.length > 120) {
    return { ok: false, erro: `O ${rotulo} precisa ter entre 3 e 120 letras.` };
  }
  if (!/^[\p{L}][\p{L}\s'.’-]+$/u.test(nome)) {
    return { ok: false, erro: `Use apenas letras no ${rotulo}.` };
  }
  return { ok: true, valor: nome };
}

export function validarCidade(entrada: unknown): Resultado<string> {
  const resultado = validarNome(entrada, "cidade");
  if (!resultado.ok) {
    return {
      ok: false,
      erro: resultado.erro
        .replace("O cidade", "A cidade")
        .replace("o cidade", "a cidade")
        .replace("no cidade", "na cidade"),
    };
  }
  return resultado;
}

export function validarNascimento(entrada: unknown, agora = new Date()): Resultado<string> {
  if (typeof entrada !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entrada)) {
    return { ok: false, erro: "Informe a data de nascimento." };
  }
  const [ano, mes, dia] = entrada.split("-").map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  const existe =
    data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
  if (!existe) {
    return { ok: false, erro: "Data de nascimento inválida." };
  }
  const hoje = hojeBahia(agora);
  if (entrada > hoje) {
    return { ok: false, erro: "A data de nascimento não pode ser no futuro." };
  }
  const limite = Number(hoje.slice(0, 4)) - 120;
  if (ano < limite) {
    return { ok: false, erro: "Confira a data de nascimento." };
  }
  return { ok: true, valor: entrada };
}

export function validarTelefone(entrada: unknown): Resultado<string> {
  if (typeof entrada !== "string") {
    return { ok: false, erro: "Informe o telefone com DDD." };
  }
  let digitos = entrada.replace(/\D/g, "");
  if (digitos.startsWith("55") && (digitos.length === 12 || digitos.length === 13)) {
    digitos = digitos.slice(2);
  }
  if (digitos.length !== 10 && digitos.length !== 11) {
    return { ok: false, erro: "Informe o telefone com DDD. Ex.: 71 99999-9999." };
  }
  if (digitos.startsWith("0")) {
    return { ok: false, erro: "O DDD não começa com zero." };
  }
  return { ok: true, valor: `55${digitos}` };
}

export function validarArea(entrada: unknown): Resultado<Area> {
  if (typeof entrada === "string" && (AREAS as readonly string[]).includes(entrada)) {
    return { ok: true, valor: entrada as Area };
  }
  return { ok: false, erro: "Escolha a área: jurídico, psicólogo, espiritual ou saúde." };
}

export function validarChamada(entrada: unknown): Resultado<Chamada> {
  if (typeof entrada === "string" && (CHAMADAS as readonly string[]).includes(entrada)) {
    return { ok: true, valor: entrada as Chamada };
  }
  return { ok: false, erro: "Escolha o tipo de chamada." };
}

export function validarEspecialidade(entrada: unknown): Resultado<string> {
  if (typeof entrada !== "string") {
    return { ok: false, erro: "Informe a especialidade." };
  }
  const texto = entrada.trim().replace(/\s+/g, " ");
  if (texto.length < 2 || texto.length > 80) {
    return { ok: false, erro: "A especialidade precisa ter entre 2 e 80 caracteres." };
  }
  if (!/^[\p{L}0-9][\p{L}0-9\s'./+-]*$/u.test(texto)) {
    return { ok: false, erro: "Revise o texto da especialidade." };
  }
  return { ok: true, valor: texto };
}

export function textoOpcional(entrada: unknown, maximo: number, rotulo: string): Resultado<string | null> {
  if (entrada == null || entrada === "") {
    return { ok: true, valor: null };
  }
  if (typeof entrada !== "string") {
    return { ok: false, erro: `${rotulo} inválido.` };
  }
  const texto = entrada.trim();
  if (!texto) {
    return { ok: true, valor: null };
  }
  if (texto.length > maximo) {
    return { ok: false, erro: `${rotulo} pode ter no máximo ${maximo} caracteres.` };
  }
  return { ok: true, valor: texto };
}

export function textoObrigatorio(entrada: unknown, maximo: number, rotulo: string): Resultado<string> {
  const resultado = textoOpcional(entrada, maximo, rotulo);
  if (!resultado.ok) {
    return resultado;
  }
  if (!resultado.valor) {
    return { ok: false, erro: `Informe ${rotulo}.` };
  }
  return { ok: true, valor: resultado.valor };
}

export function validarQuantidade(entrada: unknown): Resultado<number> {
  const numero = typeof entrada === "number" ? entrada : Number(entrada);
  if (!Number.isInteger(numero) || numero < 1 || numero > 5) {
    return { ok: false, erro: "A quantidade deve ser de 1 a 5 cestas." };
  }
  return { ok: true, valor: numero };
}

export function validarTotalCestas(entrada: unknown): Resultado<number> {
  const numero = typeof entrada === "number" ? entrada : Number(entrada);
  if (!Number.isInteger(numero) || numero < 0 || numero > 500) {
    return { ok: false, erro: "O total de cestas deve ficar entre 0 e 500." };
  }
  return { ok: true, valor: numero };
}

export function buscaLivre(entrada: string | undefined): string | null {
  if (!entrada) {
    return null;
  }
  const texto = entrada.trim().slice(0, 80);
  return texto.length ? texto : null;
}

export function termoLike(texto: string): string {
  return `%${texto.replace(/[\\%_]/g, (caractere) => `\\${caractere}`)}%`;
}
