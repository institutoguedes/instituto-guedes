import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "cruzada_equipe";
const MAX_AGE_SECONDS = 60 * 60 * 14;

function segredo(): string {
  const valor = process.env.STAFF_SECRET;
  if (!valor || valor.length < 16) {
    throw new Error("STAFF_SECRET ausente");
  }
  return valor;
}

export function equipeConfigurada(): boolean {
  const pin = process.env.STAFF_PIN;
  const chave = process.env.STAFF_SECRET;
  return !!pin && pin.length >= 4 && !!chave && chave.length >= 16;
}

export function pinConfere(informado: string): boolean {
  const esperado = process.env.STAFF_PIN ?? "";
  if (!equipeConfigurada() || informado.length < 4) {
    return false;
  }
  const chave = segredo();
  const a = createHmac("sha256", chave).update(informado).digest();
  const b = createHmac("sha256", chave).update(esperado).digest();
  return timingSafeEqual(a, b);
}

export function criarToken(): string {
  const expira = Date.now() + MAX_AGE_SECONDS * 1000;
  const corpo = `v1.${expira}`;
  const assinatura = createHmac("sha256", segredo()).update(corpo).digest("base64url");
  return `${corpo}.${assinatura}`;
}

export function tokenValido(token: string | undefined): boolean {
  if (!token || !equipeConfigurada()) {
    return false;
  }
  const partes = token.split(".");
  if (partes.length !== 3) {
    return false;
  }
  const [versao, expira, assinatura] = partes;
  if (versao !== "v1" || !expira || !assinatura) {
    return false;
  }
  const instante = Number(expira);
  if (!Number.isFinite(instante) || instante < Date.now()) {
    return false;
  }
  const corpo = `${versao}.${expira}`;
  const esperada = createHmac("sha256", segredo()).update(corpo).digest("base64url");
  const recebida = Buffer.from(assinatura);
  const correta = Buffer.from(esperada);
  if (recebida.length !== correta.length) {
    return false;
  }
  return timingSafeEqual(recebida, correta);
}

export function opcoesCookie() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export const NOME_COOKIE = COOKIE;

export async function ehEquipe(): Promise<boolean> {
  try {
    const jar = await cookies();
    return tokenValido(jar.get(COOKIE)?.value);
  } catch {
    return false;
  }
}
