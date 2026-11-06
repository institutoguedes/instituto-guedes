import { redirect } from "next/navigation";
import { ehEquipe } from "@/lib/auth";
import { jsonErro } from "@/lib/http";

export async function exigirEquipe(): Promise<void> {
  if (!(await ehEquipe())) {
    redirect("/equipe");
  }
}

export async function barrarVisitante(): Promise<Response | null> {
  if (!(await ehEquipe())) {
    return jsonErro("Entre com o código da equipe.", 401);
  }
  return null;
}
