import { respostaPlanilha } from "@/lib/csv";
import { linhasRegistros } from "@/lib/exportacao";
import { barrarVisitante } from "@/lib/guard";
import { jsonErro } from "@/lib/http";
import { listarRegistrosCompletos } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const bloqueio = await barrarVisitante();
  if (bloqueio) {
    return bloqueio;
  }
  try {
    const registros = await listarRegistrosCompletos();
    return respostaPlanilha("registros-cruzada.csv", linhasRegistros(registros));
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível exportar os registros.", 500);
  }
}
