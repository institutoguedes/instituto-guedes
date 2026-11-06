# Cruzada Evangelística

Site do evento, feito para o celular. A pessoa que aceitou Jesus deixa o contato. A equipe registra atendimentos e controla as cestas básicas.

## O que guarda

- **Decisão:** nome, data de nascimento, cidade e WhatsApp. Quem preenche autoriza o contato da liderança.
- **Ficha de atendimento:** jurídico, psicólogo, espiritual ou saúde; tipo de chamada (presencial, online, WhatsApp ou ligação); nome, telefone e especialidade. Na saúde, também sintomas e o que trouxe a pessoa ao evento.
- **Cestas básicas:** começam em 50. Cada entrega baixa o estoque. Dá para desfazer um lançamento errado.

Nada disso entra no Git. O banco é Postgres (Neon, região São Paulo, projeto `cruzada-evangelistica`). As tabelas são criadas sozinhas na primeira visita.

## Rodar na máquina

```bash
cp env.example .env.local
# preencha DATABASE_URL, STAFF_PIN e STAFF_SECRET
npm install
npm test
npm run dev
```

Na raiz do repositório, `npm run dev` sobe o mesmo aplicativo.

A área da equipe pede o `STAFF_PIN`. Ele não fica no código.

## Exportar para o WhatsApp

Na área da equipe, o bloco **Exportar para o WhatsApp** baixa todo mundo que ficou salvo:

- **Contatos do WhatsApp** (`.vcf`): salve no celular e os contatos aparecem no WhatsApp.
- **Planilha completa** (`.csv`): nome, nascimento, cidade, número internacional, número formatado e a mensagem pronta. Abre no Excel.
- **Lista de números** (`.txt`): um WhatsApp por linha.
- **Fichas e cestas também**: uma planilha com decisões, atendimentos e entregas.

Cada pessoa na lista de decisões também tem o botão **Enviar mensagem no WhatsApp**.

## Publicar

O aplicativo é o diretório `apps/web`. Na Hostinger (plano com Node.js), aponte o diretório do Git para `apps/web` e defina:

- `DATABASE_URL`
- `STAFF_PIN`
- `STAFF_SECRET`

Comandos: `npm run build` e `npm start`. O domínio previsto é `cruzadaevangelistica.com.br`.
