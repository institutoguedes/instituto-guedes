import type { Area, Atendimento, Chamada, Decisao, Entrega, Estoque } from "@/lib/domain";
import { pronto, sql } from "@/lib/db";
import { termoLike } from "@/lib/validators";

type Linha = Record<string, unknown>;

function texto(valor: unknown): string {
  if (valor instanceof Date) {
    return valor.toISOString();
  }
  return String(valor ?? "");
}

function textoOuNulo(valor: unknown): string | null {
  if (valor == null) {
    return null;
  }
  const convertido = texto(valor);
  return convertido.length ? convertido : null;
}

function numero(valor: unknown): number {
  return Number(valor);
}

function decisaoDe(linha: Linha): Decisao {
  return {
    id: texto(linha.id),
    nome: texto(linha.nome),
    dataNascimento: texto(linha.data_nascimento).slice(0, 10),
    cidade: texto(linha.cidade),
    whatsapp: texto(linha.whatsapp),
    criadoEm: texto(linha.criado_em),
  };
}

function atendimentoDe(linha: Linha): Atendimento {
  return {
    id: texto(linha.id),
    area: texto(linha.area) as Area,
    tipoChamada: texto(linha.tipo_chamada) as Chamada,
    nome: texto(linha.nome),
    telefone: texto(linha.telefone),
    especialidade: texto(linha.especialidade),
    profissional: textoOuNulo(linha.profissional),
    sintomas: textoOuNulo(linha.sintomas),
    motivo: textoOuNulo(linha.motivo),
    observacoes: textoOuNulo(linha.observacoes),
    criadoEm: texto(linha.criado_em),
  };
}

function entregaDe(linha: Linha): Entrega {
  return {
    id: texto(linha.id),
    nome: texto(linha.nome),
    telefone: texto(linha.telefone),
    cidade: texto(linha.cidade),
    quantidade: numero(linha.quantidade),
    criadoEm: texto(linha.criado_em),
  };
}

export async function salvarDecisao(dados: {
  nome: string;
  dataNascimento: string;
  cidade: string;
  whatsapp: string;
}): Promise<{ id: string; jaExistia: boolean }> {
  await pronto();
  const consulta = sql();
  const existentes = await consulta`
    SELECT id
    FROM decisoes
    WHERE whatsapp = ${dados.whatsapp}
      AND (criado_em AT TIME ZONE 'America/Bahia')::date = (now() AT TIME ZONE 'America/Bahia')::date
    LIMIT 1
  `;
  const anterior = existentes[0];
  if (anterior) {
    return { id: texto(anterior.id), jaExistia: true };
  }
  const inseridas = await consulta`
    INSERT INTO decisoes (nome, data_nascimento, cidade, whatsapp)
    VALUES (${dados.nome}, ${dados.dataNascimento}, ${dados.cidade}, ${dados.whatsapp})
    RETURNING id
  `;
  return { id: texto(inseridas[0]?.id), jaExistia: false };
}

export async function listarDecisoes(busca: string | null, limite: number): Promise<Decisao[]> {
  await pronto();
  const consulta = sql();
  const linhas = busca
    ? await consulta`
        SELECT id, nome, data_nascimento::text, cidade, whatsapp, criado_em
        FROM decisoes
        WHERE nome ILIKE ${termoLike(busca)} ESCAPE '\\'
           OR cidade ILIKE ${termoLike(busca)} ESCAPE '\\'
           OR whatsapp ILIKE ${termoLike(busca)} ESCAPE '\\'
        ORDER BY criado_em DESC
        LIMIT ${limite}
      `
    : await consulta`
        SELECT id, nome, data_nascimento::text, cidade, whatsapp, criado_em
        FROM decisoes
        ORDER BY criado_em DESC
        LIMIT ${limite}
      `;
  return linhas.map(decisaoDe);
}

export async function salvarAtendimento(dados: {
  area: Area;
  tipoChamada: Chamada;
  nome: string;
  telefone: string;
  especialidade: string;
  profissional: string | null;
  sintomas: string | null;
  motivo: string | null;
  observacoes: string | null;
}): Promise<string> {
  await pronto();
  const inseridas = await sql()`
    INSERT INTO atendimentos (
      area, tipo_chamada, nome, telefone, especialidade, profissional, sintomas, motivo, observacoes
    )
    VALUES (
      ${dados.area},
      ${dados.tipoChamada},
      ${dados.nome},
      ${dados.telefone},
      ${dados.especialidade},
      ${dados.profissional},
      ${dados.sintomas},
      ${dados.motivo},
      ${dados.observacoes}
    )
    RETURNING id
  `;
  return texto(inseridas[0]?.id);
}

export async function listarAtendimentos(area: Area | null, limite: number): Promise<Atendimento[]> {
  await pronto();
  const consulta = sql();
  const linhas = area
    ? await consulta`
        SELECT id, area, tipo_chamada, nome, telefone, especialidade, profissional, sintomas, motivo, observacoes, criado_em
        FROM atendimentos
        WHERE area = ${area}
        ORDER BY criado_em DESC
        LIMIT ${limite}
      `
    : await consulta`
        SELECT id, area, tipo_chamada, nome, telefone, especialidade, profissional, sintomas, motivo, observacoes, criado_em
        FROM atendimentos
        ORDER BY criado_em DESC
        LIMIT ${limite}
      `;
  return linhas.map(atendimentoDe);
}

export async function estoque(): Promise<Estoque> {
  await pronto();
  const linhas = await sql()`
    SELECT total, entregues
    FROM cestas_config
    WHERE id = 1
  `;
  const linha = linhas[0];
  const total = numero(linha?.total ?? 50);
  const entregues = numero(linha?.entregues ?? 0);
  return { total, entregues, restantes: Math.max(total - entregues, 0) };
}

export async function listarEntregas(limite: number): Promise<Entrega[]> {
  await pronto();
  const linhas = await sql()`
    SELECT id, nome, telefone, cidade, quantidade, criado_em
    FROM cestas_entregas
    ORDER BY criado_em DESC
    LIMIT ${limite}
  `;
  return linhas.map(entregaDe);
}

export async function registrarEntrega(dados: {
  nome: string;
  telefone: string;
  cidade: string;
  quantidade: number;
}): Promise<{ entrega: Entrega; estoque: Estoque } | null> {
  await pronto();
  const linhas = await sql()`
    WITH upd AS (
      UPDATE cestas_config
      SET entregues = entregues + ${dados.quantidade}
      WHERE id = 1 AND entregues + ${dados.quantidade} <= total
      RETURNING total, entregues
    ),
    ins AS (
      INSERT INTO cestas_entregas (nome, telefone, cidade, quantidade)
      SELECT ${dados.nome}, ${dados.telefone}, ${dados.cidade}, ${dados.quantidade}
      FROM upd
      RETURNING id, nome, telefone, cidade, quantidade, criado_em
    )
    SELECT ins.id, ins.nome, ins.telefone, ins.cidade, ins.quantidade, ins.criado_em,
           upd.total, upd.entregues
    FROM ins
    JOIN upd ON true
  `;
  const linha = linhas[0];
  if (!linha) {
    return null;
  }
  const total = numero(linha.total);
  const entregues = numero(linha.entregues);
  return {
    entrega: entregaDe(linha),
    estoque: { total, entregues, restantes: Math.max(total - entregues, 0) },
  };
}

export async function desfazerEntrega(id: string): Promise<Estoque | null> {
  await pronto();
  const linhas = await sql()`
    WITH alvo AS (
      SELECT id, quantidade FROM cestas_entregas WHERE id = ${id}::uuid
    ),
    del AS (
      DELETE FROM cestas_entregas AS entrega
      USING alvo
      WHERE entrega.id = alvo.id
      RETURNING entrega.quantidade
    ),
    upd AS (
      UPDATE cestas_config
      SET entregues = GREATEST(entregues - (SELECT quantidade FROM del), 0)
      WHERE id = 1 AND EXISTS (SELECT 1 FROM del)
      RETURNING total, entregues
    )
    SELECT total, entregues FROM upd
  `;
  const linha = linhas[0];
  if (!linha) {
    return null;
  }
  const total = numero(linha.total);
  const entregues = numero(linha.entregues);
  return { total, entregues, restantes: Math.max(total - entregues, 0) };
}

export async function ajustarTotalCestas(total: number): Promise<Estoque | null> {
  await pronto();
  const linhas = await sql()`
    UPDATE cestas_config
    SET total = ${total}
    WHERE id = 1 AND ${total} >= entregues
    RETURNING total, entregues
  `;
  const linha = linhas[0];
  if (!linha) {
    return null;
  }
  const entregues = numero(linha.entregues);
  return { total: numero(linha.total), entregues, restantes: Math.max(total - entregues, 0) };
}

export async function listarRegistrosCompletos(): Promise<
  {
    origem: string;
    nome: string;
    telefone: string;
    cidade: string;
    dataNascimento: string;
    detalhe: string;
    criadoEm: string;
  }[]
> {
  await pronto();
  const linhas = await sql()`
    SELECT origem, nome, telefone, cidade, data_nascimento, detalhe, criado_em
    FROM (
      SELECT
        'Decisão'::text AS origem,
        nome,
        whatsapp AS telefone,
        cidade,
        data_nascimento::text AS data_nascimento,
        ''::text AS detalhe,
        criado_em
      FROM decisoes
      UNION ALL
      SELECT
        'Ficha'::text,
        nome,
        telefone,
        ''::text,
        ''::text,
        concat_ws(' · ', area, tipo_chamada, especialidade, profissional, sintomas, motivo, observacoes),
        criado_em
      FROM atendimentos
      UNION ALL
      SELECT
        'Cesta'::text,
        nome,
        telefone,
        cidade,
        ''::text,
        concat(quantidade::text, ' cesta(s)'),
        criado_em
      FROM cestas_entregas
    ) AS registros
    ORDER BY criado_em DESC
    LIMIT 100000
  `;
  return linhas.map((linha) => ({
    origem: texto(linha.origem),
    nome: texto(linha.nome),
    telefone: texto(linha.telefone),
    cidade: texto(linha.cidade),
    dataNascimento: texto(linha.data_nascimento).slice(0, 10),
    detalhe: texto(linha.detalhe),
    criadoEm: texto(linha.criado_em),
  }));
}

export type Resumo = Estoque & {
  decisoes: number;
  decisoesHoje: number;
  atendimentos: number;
  atendimentosHoje: number;
};

export async function resumo(): Promise<Resumo> {
  await pronto();
  const linhas = await sql()`
    SELECT
      (SELECT count(*)::int FROM decisoes) AS decisoes,
      (SELECT count(*)::int FROM decisoes
        WHERE (criado_em AT TIME ZONE 'America/Bahia')::date = (now() AT TIME ZONE 'America/Bahia')::date) AS decisoes_hoje,
      (SELECT count(*)::int FROM atendimentos) AS atendimentos,
      (SELECT count(*)::int FROM atendimentos
        WHERE (criado_em AT TIME ZONE 'America/Bahia')::date = (now() AT TIME ZONE 'America/Bahia')::date) AS atendimentos_hoje,
      total,
      entregues
    FROM cestas_config
    WHERE id = 1
  `;
  const linha = linhas[0];
  const total = numero(linha?.total ?? 50);
  const entregues = numero(linha?.entregues ?? 0);
  return {
    decisoes: numero(linha?.decisoes ?? 0),
    decisoesHoje: numero(linha?.decisoes_hoje ?? 0),
    atendimentos: numero(linha?.atendimentos ?? 0),
    atendimentosHoje: numero(linha?.atendimentos_hoje ?? 0),
    total,
    entregues,
    restantes: Math.max(total - entregues, 0),
  };
}
