import { cookies } from "next/headers";
import { NOME_COOKIE, criarToken, equipeConfigurada, opcoesCookie, pinConfere } from "@/lib/auth";
import { ipDe, jsonErro, jsonOk, lerJson } from "@/lib/http";
import { limparFalhasLogin, loginBloqueado, registrarFalhaLogin } from "@/lib/limite";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!equipeConfigurada()) {
    return jsonErro("A área da equipe ainda não foi configurada.", 503);
  }
  const ip = ipDe(request);
  if (loginBloqueado(ip)) {
    return jsonErro("Muitas tentativas. Espere alguns minutos.", 429);
  }
  const corpo = await lerJson(request);
  const pin = typeof corpo?.pin === "string" ? corpo.pin.trim() : "";
  if (!pinConfere(pin)) {
    registrarFalhaLogin(ip);
    return jsonErro("Código incorreto.", 401);
  }
  limparFalhasLogin(ip);
  const jar = await cookies();
  jar.set(NOME_COOKIE, criarToken(), opcoesCookie());
  return jsonOk({});
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(NOME_COOKIE);
  return jsonOk({});
}
