export function jsonErro(erro: string, status: number): Response {
  return Response.json({ ok: false, erro }, { status, headers: { "Cache-Control": "no-store" } });
}

export function jsonOk(dados: Record<string, unknown>, status = 200): Response {
  return Response.json({ ok: true, ...dados }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function lerJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const dados: unknown = await request.json();
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
      return null;
    }
    return dados as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function ipDe(request: Request): string {
  const encaminhado = request.headers.get("x-forwarded-for");
  if (encaminhado) {
    return encaminhado.split(",")[0]?.trim() || "local";
  }
  return request.headers.get("x-real-ip") ?? "local";
}

export function falhou(resultado: { ok: true } | { ok: false; erro: string }): resultado is { ok: false; erro: string } {
  return !resultado.ok;
}
