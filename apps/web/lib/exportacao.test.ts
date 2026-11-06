import assert from "node:assert/strict";
import test from "node:test";
import type { Decisao } from "./domain";
import { cartaoContatos, linhasInscritos, listaNumeros } from "./exportacao";

const ANA: Decisao = {
  id: "1",
  nome: "Ana Souza",
  dataNascimento: "1990-04-12",
  cidade: "Salvador",
  whatsapp: "5571988887777",
  criadoEm: "2026-11-06T15:00:00.000Z",
};

test("planilha de inscritos traz número internacional e a mensagem", () => {
  const linhas = linhasInscritos([ANA]);
  assert.deepEqual(linhas[0], [
    "nome",
    "data_nascimento",
    "cidade",
    "whatsapp",
    "whatsapp_formatado",
    "mensagem",
    "registrado_em",
  ]);
  assert.equal(linhas[1]?.[3], "5571988887777");
  assert.match(linhas[1]?.[5] ?? "", /Olá, Ana!/);
  assert.equal(linhas[1]?.[1], "12/04/1990");
});

test("contatos do WhatsApp saem em vCard e não repetem o número", () => {
  const vcard = cartaoContatos([
    { nome: "Ana, Souza", telefone: "5571988887777", nota: "Salvador" },
    { nome: "Ana de novo", telefone: "+55 71 98888-7777", nota: "repetida" },
  ]);
  assert.equal(vcard.match(/BEGIN:VCARD/g)?.length, 1);
  assert.match(vcard, /FN:Ana\\, Souza/);
  assert.match(vcard, /TEL;TYPE=CELL:\+5571988887777/);
});

test("lista de números é um WhatsApp por linha, sem repetir", () => {
  assert.equal(listaNumeros(["5571988887777", "5571988887777", "557133334444"]), "5571988887777\r\n557133334444\r\n");
});
