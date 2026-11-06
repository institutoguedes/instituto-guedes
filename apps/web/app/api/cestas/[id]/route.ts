import { barrarVisitante } from "@/lib/guard";
import { jsonErro, jsonOk } from "@/lib/http";
import { desfazerEntrega } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(_request: Request, contexto: { params: Promise<{ id: string }> }) {
  const bloqueio = await barrarVisitante();
  if (bloqueio) {
    return bloqueio;
  }
  const { id } = await contexto.params;
  if (!UUID.test(id)) {
    return jsonErro("Entrega não encontrada.", 404);
  }
  try {
    const caixa = await desfazerEntrega(id);
    if (!caixa) {
      return jsonErro("Entrega não encontrada.", 404);
    }
    return jsonOk({ estoque: caixa });
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível desfazer a entrega.", 500);
  }
}
