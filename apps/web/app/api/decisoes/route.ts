import { respostaArquivo, respostaPlanilha } from "@/lib/csv";
import { cartaoContatos, linhasInscritos, listaNumeros } from "@/lib/exportacao";
import { avisarCadastro } from "@/lib/aviso";
import { falhou, ipDe, jsonErro, jsonOk, lerJson } from "@/lib/http";
import { podeRegistrarDecisao } from "@/lib/limite";
import { listarDecisoes, salvarDecisao } from "@/lib/queries";
import { buscaLivre, validarCidade, validarNascimento, validarNome, validarTelefone } from "@/lib/validators";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const busca = buscaLivre(url.searchParams.get("q") ?? undefined);
  try {
    const decisoes = await listarDecisoes(busca, 100000);
    const formato = url.searchParams.get("format");
    if (formato === "csv") {
      return respostaPlanilha("inscritos-cruzada.csv", linhasInscritos(decisoes));
    }
    if (formato === "vcf") {
      const cartoes = cartaoContatos(
        decisoes.map((decisao) => ({
          nome: decisao.nome,
          telefone: decisao.whatsapp,
          nota: `Cruzada Evangelística · ${decisao.cidade} · nasc. ${decisao.dataNascimento}`,
        })),
      );
      return respostaArquivo("contatos-whatsapp-cruzada.vcf", cartoes, "text/vcard");
    }
    if (formato === "numeros") {
      return respostaArquivo("numeros-whatsapp-cruzada.txt", listaNumeros(decisoes.map((decisao) => decisao.whatsapp)), "text/plain");
    }
    return jsonOk({ decisoes, total: decisoes.length });
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível ler as decisões.", 500);
  }
}

export async function POST(request: Request) {
  if (!podeRegistrarDecisao(ipDe(request))) {
    return jsonErro("Muitos cadastros seguidos. Espere um pouco e tente de novo.", 429);
  }
  const corpo = await lerJson(request);
  if (!corpo) {
    return jsonErro("Não entendi os dados enviados.", 400);
  }
  if (typeof corpo.empresa === "string" && corpo.empresa.trim()) {
    return jsonOk({ id: "recebido" });
  }
  if (corpo.autoriza !== true) {
    return jsonErro("É preciso autorizar o contato da liderança.", 400);
  }
  const nome = validarNome(corpo.nome);
  if (falhou(nome)) {
    return jsonErro(nome.erro, 400);
  }
  const nascimento = validarNascimento(corpo.dataNascimento);
  if (falhou(nascimento)) {
    return jsonErro(nascimento.erro, 400);
  }
  const cidade = validarCidade(corpo.cidade);
  if (falhou(cidade)) {
    return jsonErro(cidade.erro, 400);
  }
  const whatsapp = validarTelefone(corpo.whatsapp);
  if (falhou(whatsapp)) {
    return jsonErro(whatsapp.erro, 400);
  }
  try {
    const salva = await salvarDecisao({
      nome: nome.valor,
      dataNascimento: nascimento.valor,
      cidade: cidade.valor,
      whatsapp: whatsapp.valor,
    });
    if (!salva.jaExistia) {
      await avisarCadastro({
        origem: "Decisão",
        nome: nome.valor,
        telefone: whatsapp.valor,
        cidade: cidade.valor,
        nascimento: nascimento.valor,
      });
    }
    return jsonOk(salva, salva.jaExistia ? 200 : 201);
  } catch (erro) {
    console.error(erro);
    return jsonErro("Não foi possível salvar agora. Tente de novo.", 500);
  }
}
