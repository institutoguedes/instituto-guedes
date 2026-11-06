import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Sql = NeonQueryFunction<false, false>;

let cliente: Sql | null = null;
let preparado: Promise<void> | null = null;

const TABELAS = [
  `CREATE TABLE IF NOT EXISTS decisoes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL,
    data_nascimento date NOT NULL,
    cidade text NOT NULL,
    whatsapp text NOT NULL,
    criado_em timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS decisoes_criado_em_idx ON decisoes (criado_em DESC)`,
  `CREATE INDEX IF NOT EXISTS decisoes_whatsapp_idx ON decisoes (whatsapp)`,
  `CREATE TABLE IF NOT EXISTS atendimentos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    area text NOT NULL CHECK (area IN ('juridico', 'psicologo', 'espiritual', 'saude')),
    tipo_chamada text NOT NULL CHECK (tipo_chamada IN ('presencial', 'online', 'whatsapp', 'ligacao')),
    nome text NOT NULL,
    telefone text NOT NULL,
    especialidade text NOT NULL,
    profissional text,
    sintomas text,
    motivo text,
    observacoes text,
    criado_em timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS atendimentos_criado_em_idx ON atendimentos (criado_em DESC)`,
  `CREATE TABLE IF NOT EXISTS cestas_config (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    total integer NOT NULL DEFAULT 50 CHECK (total >= 0),
    entregues integer NOT NULL DEFAULT 0 CHECK (entregues >= 0)
  )`,
  `INSERT INTO cestas_config (id, total, entregues)
   VALUES (1, 50, 0)
   ON CONFLICT (id) DO NOTHING`,
  `CREATE TABLE IF NOT EXISTS cestas_entregas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL,
    telefone text NOT NULL,
    cidade text NOT NULL,
    quantidade integer NOT NULL CHECK (quantidade BETWEEN 1 AND 5),
    criado_em timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS cestas_entregas_criado_em_idx ON cestas_entregas (criado_em DESC)`,
];

export function sql(): Sql {
  if (!cliente) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL não configurada");
    }
    cliente = neon(url);
  }
  return cliente;
}

export function pronto(): Promise<void> {
  if (!preparado) {
    preparado = migrar().catch((erro: unknown) => {
      preparado = null;
      throw erro;
    });
  }
  return preparado;
}

async function migrar(): Promise<void> {
  const consulta = sql();
  for (const comando of TABELAS) {
    await consulta.query(comando);
  }
}
