import assert from "node:assert/strict";
import test from "node:test";
import { planilha } from "./csv";
import { formatarTelefone, mensagemAcompanhamento } from "./format";
import {
  termoLike,
  validarNascimento,
  validarNome,
  validarQuantidade,
  validarTelefone,
} from "./validators";

test("aceita nome com acento e recusa número", () => {
  const nome = validarNome("  Ana   Souza ");
  assert.equal(nome.ok, true);
  if (nome.ok) {
    assert.equal(nome.valor, "Ana Souza");
  }
  assert.equal(validarNome("José d'Ávila").ok, true);
  assert.equal(validarNome("12345").ok, false);
  assert.equal(validarNome("A").ok, false);
});

test("normaliza WhatsApp brasileiro", () => {
  assert.deepEqual(validarTelefone("(71) 98888-7777"), { ok: true, valor: "5571988887777" });
  assert.deepEqual(validarTelefone("+55 71 3333-4444"), { ok: true, valor: "557133334444" });
  assert.equal(validarTelefone("999887777").ok, false);
  assert.equal(validarTelefone("071999887777").ok, false);
});

test("recusa nascimento futuro e data impossível", () => {
  assert.equal(validarNascimento("2026-02-31").ok, false);
  assert.equal(validarNascimento("2099-01-01").ok, false);
  assert.equal(validarNascimento("1990-04-12").ok, true);
});

test("quantidade de cestas fica entre 1 e 5", () => {
  assert.deepEqual(validarQuantidade("2"), { ok: true, valor: 2 });
  assert.equal(validarQuantidade(0).ok, false);
  assert.equal(validarQuantidade(6).ok, false);
});

test("busca não trata % como coringa", () => {
  assert.equal(termoLike("100%"), "%100\\%%");
});

test("planilha escapa fórmula de planilha", () => {
  const csv = planilha([
    ["nome", "cidade"],
    ["=cmd", "Salvador"],
  ]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes(`"'=cmd"`));
});

test("mensagem de acompanhamento usa o primeiro nome", () => {
  assert.match(mensagemAcompanhamento("Maria das Dores"), /Olá, Maria!/);
  assert.equal(formatarTelefone("5571988887777"), "+55 (71) 98888-7777");
});
