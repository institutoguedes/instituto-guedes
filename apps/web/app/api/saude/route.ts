import { pronto, sql } from "@/lib/db";
import { jsonErro, jsonOk } from "@/lib/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await pronto();
    await sql()`SELECT 1`;
    return jsonOk({});
  } catch (erro) {
    console.error(erro);
    return jsonErro("Banco indisponível.", 503);
  }
}
