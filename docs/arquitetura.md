# Arquitetura proposta (rascunho)

> Proposta inicial para discussão. A stack será decidida pelo CTO via ADR.

## Visão: um cérebro, olhos e braços
- **Sistema central (cérebro):** cadastro único de pessoas, ministérios e histórico; multi-igreja com isolamento total entre igrejas; regras fixas em código; agenda de gatilhos; dados protegidos (LGPD).
- **Painel da liderança (olhos):** visão unificada, simples para o público 40+.
- **Assistentes por setor (braços):** conversam pelo canal que a pessoa já usa (Telegram para testes, WhatsApp oficial depois), consultam o sistema antes de perguntar, aceitam texto e áudio.

## Estrutura do monorepo
```
apps/
  web/        # Painel da liderança e autocadastro
  api/        # API do sistema central (multi-igreja)
packages/     # Código compartilhado (tipos, UI, regras de domínio)
docs/
  adr/        # Registros de decisão de arquitetura
```

## Módulos do MVP
Pessoas (visitantes/membros), Voluntários e escalas, Demandas, Estoque, Painel, Gatilhos.

## Questões em aberto
- Hospedagem e banco de dados (priorizar opções gratuitas/baixo custo).
- Custo do WhatsApp oficial por volume de mensagens.
- O que aproveitar da ferramenta atual da IBCA.
