import { respostaPlanilha } from "@/lib/csv";
import { rotuloArea, rotuloChamada, type Area } from "@/lib/domain";
import { formatarDataHora, formatarTelefone } from "@/lib/format";
import { avisarCadastro } from "@/lib/aviso";
import { falhou, jsonErro, jsonOk, lerJson } from "@/lib/http";
import { listarAtendimentos, salvarAtendimento } from "@/lib/queries";
import {
  textoObrigatorio,
  textoOpcional,
  validarArea,
  validarChamada,
  validarEspecialidade,
  validarNome,
  validarTelefone,
} from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function areaDaUrl(valor: string | null): Area | null | Response {
  if (!valor) {
    return null;
  }
  const area = validarArea(valor);
  if (falhou(area)) {
    return jsonErro(area.erro, 400);
  }
  return area.valor;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const area = areaDaUrl(url.searchParams.get("area"));
  if (area instanceof Response) {
    return area;
  }
  try {
    const fichas = await listarAtendimentos(area, 10000);
    if (url.searchParams.get("format") === "csv") {
      const linhas = [
        [
          "area",
          "tipo_chamada",
          "nome",
          "telefone",
          "especialidade",
          "profissional",
          "sintomas",
          "motivo",
          "observacoes",
          "registrado_em",
        ],
        ...fichas.map((ficha) => [
          rotuloArea(ficha.area),
          rotuloChamada(ficha.tipoChamada),
          ficha.nome,
          formatarTelefone(ficha.telefone),
          ficha.especialidade,
          ficha.profissional ?? "",
          ficha.sintomas ?? "",
          ficha.motivo ?? "",
          ficha.observacoes ?? "",
          formatarDataHora(ficha.criadoEm),
        ]),
      ];
      return respostaPlanilha("fichas-cruzada.csv", linhas);
    }
    return jsonOk({ fichas });
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível ler as fichas.", 500);
  }
}

export async function POST(request: Request) {
  const corpo = await lerJson(request);
  if (!corpo) {
    return jsonErro("Não entendi os dados enviados.", 400);
  }
  const area = validarArea(corpo.area);
  if (falhou(area)) {
    return jsonErro(area.erro, 400);
  }
  const chamada = validarChamada(corpo.tipoChamada);
  if (falhou(chamada)) {
    return jsonErro(chamada.erro, 400);
  }
  const nome = validarNome(corpo.nome, "nome da pessoa");
  if (falhou(nome)) {
    return jsonErro(nome.erro, 400);
  }
  const telefone = validarTelefone(corpo.telefone);
  if (falhou(telefone)) {
    return jsonErro(telefone.erro, 400);
  }
  const especialidade = validarEspecialidade(corpo.especialidade);
  if (falhou(especialidade)) {
    return jsonErro(especialidade.erro, 400);
  }
  const profissional = validarNomeOpcional(corpo.profissional);
  if (falhou(profissional)) {
    return jsonErro(profissional.erro, 400);
  }
  const sintomas = area.valor === "saude" ? textoObrigatorio(corpo.sintomas, 2000, "os sintomas") : textoOpcional(corpo.sintomas, 2000, "Os sintomas");
  if (falhou(sintomas)) {
    return jsonErro(sintomas.erro, 400);
  }
  const motivo =
    area.valor === "saude"
      ? textoObrigatorio(corpo.motivo, 2000, "o que trouxe a pessoa ao evento")
      : textoOpcional(corpo.motivo, 2000, "O motivo");
  if (falhou(motivo)) {
    return jsonErro(motivo.erro, 400);
  }
  const observacoes = textoOpcional(corpo.observacoes, 2000, "As observações");
  if (falhou(observacoes)) {
    return jsonErro(observacoes.erro, 400);
  }
  try {
    const id = await salvarAtendimento({
      area: area.valor,
      tipoChamada: chamada.valor,
      nome: nome.valor,
      telefone: telefone.valor,
      especialidade: especialidade.valor,
      profissional: profissional.valor,
      sintomas: sintomas.valor,
      motivo: motivo.valor,
      observacoes: observacoes.valor,
    });
    const detalhes = [
      `Área: ${rotuloArea(area.valor)}`,
      `Chamada: ${rotuloChamada(chamada.valor)}`,
      `Especialidade: ${especialidade.valor}`,
      profissional.valor ? `Quem atendeu: ${profissional.valor}` : null,
      sintomas.valor ? `Sintomas: ${sintomas.valor}` : null,
      motivo.valor ? `Motivo: ${motivo.valor}` : null,
      observacoes.valor ? `Observações: ${observacoes.valor}` : null,
    ]
      .filter((linha) => linha != null)
      .join("\n");
    await avisarCadastro({
      origem: "Ficha",
      nome: nome.valor,
      telefone: telefone.valor,
      extra: detalhes,
    });
    return jsonOk({ id }, 201);
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível salvar a ficha.", 500);
  }
}

function validarNomeOpcional(entrada: unknown) {
  if (entrada == null || entrada === "") {
    return { ok: true as const, valor: null };
  }
  const nome = validarNome(entrada, "nome de quem atendeu");
  if (falhou(nome)) {
    return nome;
  }
  return { ok: true as const, valor: nome.valor };
}
