import { respostaPlanilha } from "@/lib/csv";
import { formatarDataHora, formatarTelefone } from "@/lib/format";
import { barrarVisitante } from "@/lib/guard";
import { falhou, jsonErro, jsonOk, lerJson } from "@/lib/http";
import { ajustarTotalCestas, estoque, listarEntregas, registrarEntrega } from "@/lib/queries";
import { validarCidade, validarNome, validarQuantidade, validarTelefone, validarTotalCestas } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const bloqueio = await barrarVisitante();
  if (bloqueio) {
    return bloqueio;
  }
  const url = new URL(request.url);
  try {
    const [caixa, entregas] = await Promise.all([estoque(), listarEntregas(10000)]);
    if (url.searchParams.get("format") === "csv") {
      const linhas = [
        ["nome", "telefone", "cidade", "quantidade", "registrado_em"],
        ...entregas.map((entrega) => [
          entrega.nome,
          formatarTelefone(entrega.telefone),
          entrega.cidade,
          String(entrega.quantidade),
          formatarDataHora(entrega.criadoEm),
        ]),
      ];
      return respostaPlanilha("cestas-cruzada.csv", linhas);
    }
    return jsonOk({ estoque: caixa, entregas });
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível ler as cestas.", 500);
  }
}

export async function POST(request: Request) {
  const bloqueio = await barrarVisitante();
  if (bloqueio) {
    return bloqueio;
  }
  const corpo = await lerJson(request);
  if (!corpo) {
    return jsonErro("Não entendi os dados enviados.", 400);
  }
  const nome = validarNome(corpo.nome, "nome de quem recebe");
  if (falhou(nome)) {
    return jsonErro(nome.erro, 400);
  }
  const telefone = validarTelefone(corpo.telefone);
  if (falhou(telefone)) {
    return jsonErro(telefone.erro, 400);
  }
  const cidade = validarCidade(corpo.cidade);
  if (falhou(cidade)) {
    return jsonErro(cidade.erro, 400);
  }
  const quantidade = validarQuantidade(corpo.quantidade);
  if (falhou(quantidade)) {
    return jsonErro(quantidade.erro, 400);
  }
  try {
    const registro = await registrarEntrega({
      nome: nome.valor,
      telefone: telefone.valor,
      cidade: cidade.valor,
      quantidade: quantidade.valor,
    });
    if (!registro) {
      const caixa = await estoque();
      return jsonErro(
        caixa.restantes === 0
          ? "As cestas disponíveis já foram entregues."
          : `Só restam ${caixa.restantes} cestas.`,
        409,
      );
    }
    return jsonOk({ entrega: registro.entrega, estoque: registro.estoque }, 201);
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível registrar a entrega.", 500);
  }
}

export async function PATCH(request: Request) {
  const bloqueio = await barrarVisitante();
  if (bloqueio) {
    return bloqueio;
  }
  const corpo = await lerJson(request);
  if (!corpo) {
    return jsonErro("Não entendi os dados enviados.", 400);
  }
  const total = validarTotalCestas(corpo.total);
  if (falhou(total)) {
    return jsonErro(total.erro, 400);
  }
  try {
    const caixa = await ajustarTotalCestas(total.valor);
    if (!caixa) {
      return jsonErro("O total não pode ficar menor do que as cestas já entregues.", 409);
    }
    return jsonOk({ estoque: caixa });
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível ajustar o total.", 500);
  }
}
