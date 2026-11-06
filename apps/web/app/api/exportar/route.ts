import { respostaPlanilha } from "@/lib/csv";
import { linhasRegistros } from "@/lib/exportacao";
import { jsonErro } from "@/lib/http";
import { listarRegistrosCompletos } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const registros = await listarRegistrosCompletos();
    return respostaPlanilha("registros-cruzada.csv", linhasRegistros(registros));
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível exportar os registros.", 500);
  }
}
