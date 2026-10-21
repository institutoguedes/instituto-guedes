# Instituto Guedes

> Tecnologia a serviço do Reino, construída de forma voluntária.
>
> "Onde dois ou três estiverem reunidos em meu nome, ali eu estou no meio deles." (Mateus 18:20)

O **Instituto Guedes** é uma iniciativa **sem fins lucrativos** e de **colaboração voluntária**, idealizada por Kauan Guedes como uma oferta a Deus. Um grupo de profissionais de tecnologia se dispôs a servir, colocando seu conhecimento a serviço de igrejas. O líder deste projeto é Deus; nós somos servos e organizadores.

## Missão

Construir, de forma aberta e voluntária, ferramentas simples que ajudem igrejas a cuidar das pessoas, em especial no acompanhamento de quem acabou de chegar ou aceitou Jesus.

## O problema

Na primeira igreja atendida, a **IBCA (Igreja Batista do Caminho das Árvores, Salvador)**, ouvimos:

- A liderança não tem uma visão única do que acontece (escalas, voluntários, estoque de cestas básicas, eventos).
- A informação fica espalhada em grupos de WhatsApp e em várias ferramentas.
- A plataforma atual é robusta demais e o público 40+ tem dificuldade de usar.
- O cadastro de visitantes e novos membros não acontece.
- Os departamentos não conversam entre si (ex.: voluntário afastado em um ministério segue servindo em outro).
- Decisões sobre eventos e campanhas são tomadas sem dados.

> "As pessoas inserem dados no sistema e ninguém os consome. Mudar de ferramenta sem mudar o processo não resolve."

Detalhes em [docs/discovery-ibca.md](docs/discovery-ibca.md).

## O que vamos construir (MVP)

**Fase 0 · Discovery de processos:** mapear com a IBCA a jornada do visitante/novo membro e as funcionalidades mais usadas da ferramenta atual.

**Fase 1 · Plataforma de gestão (os "olhos"):**
- Painel da liderança: a igreja inteira em uma tela.
- Cadastro de visitantes e membros, com autocadastro.
- Voluntários e escalas por ministério, com situação visível a todos os departamentos.
- Demandas com responsável, prazo e conclusão.
- Controle de estoque (ex.: cestas básicas).
- UX muito simples, pensada para o público 40+.

**Fase 2 · Assistentes por setor (os "braços"):** agentes com regras por ministério (visitante, louvor e escalas, estoque) que consultam o sistema antes de perguntar, são proativos sem ser invasivos e aceitam texto ou áudio. Testes primeiro no Telegram, depois no WhatsApp oficial (API da Meta).

**Fase 3 · Expansão:** automação da comunicação, dados para campanhas e eventos e atendimento a outras igrejas.

Arquitetura proposta: [docs/arquitetura.md](docs/arquitetura.md).

## Roadmap

- [ ] Sprint 1 · Fundação: primeiros fluxos de tela, repositório e quadro de tarefas, estimativa de custos, assistente de teste no Telegram
- [ ] 2ª sessão com a IBCA: jornada do visitante passo a passo
- [ ] PRD (conduzido pelo Éric)
- [ ] MVP da plataforma de gestão
- [ ] Piloto na IBCA
- [ ] Assistentes conversacionais
- [ ] Multi-igreja

Trabalhamos em sprints de 7 dias, sem reunião diária, com tudo por escrito: GitHub para o código e quadro Kanban para as tarefas.

## Equipe

| Pessoa | Papel |
|---|---|
| Kauan Guedes | Organizador e mantenedor: prioridades, parcerias e relação com as igrejas |
| Bruno | CTO: arquitetura, segurança, custos e jeito de trabalhar do time |
| Éric | Design de produto: jornada do usuário, PRD e protótipos |
| Bruna | Suporte: chamados das igrejas, treinamento e infraestrutura |
| Voluntários | Desenvolvimento em tarefas pequenas, de 2 a 3 dias |

Veja [GOVERNANCE.md](GOVERNANCE.md).

## Como contribuir

Qualquer pessoa séria e alinhada ao propósito pode contribuir.

1. Leia o [Código de Conduta](CODE_OF_CONDUCT.md) e o [guia de contribuição](CONTRIBUTING.md).
2. Abra uma issue de **Apresentação de voluntário**.
3. Escolha uma issue marcada como `boa primeira issue`.
4. Abra seu primeiro Pull Request; ele será revisado por um mantenedor.

Problemas de segurança: veja [SECURITY.md](SECURITY.md). Nunca abra issue pública para isso.

## Regras do projeto

- Servimos com excelência, humildade e transparência.
- Nenhum dado pessoal real de membros, visitantes ou crianças entra no repositório. Dados de fé, crianças e famílias assistidas são sensíveis pela LGPD.
- Nada vai para a `main` sem Pull Request revisado.
- Toda tarefa tem um dono no quadro.
- Respeitamos a rotina e o tempo de cada voluntário.

## Licença e uso por igrejas

O código é licenciado sob a **[GNU AGPL-3.0](LICENSE)**. Igrejas e ministérios podem usar, estudar, adaptar e contribuir livremente.

**Revenda e uso comercial:** se você pretende vender, revender ou oferecer este sistema como serviço pago a igrejas, **converse com o Instituto antes**, para avaliarmos se o uso está de acordo com o propósito do projeto. Veja [COMMERCIAL-USE.md](COMMERCIAL-USE.md). Esse pedido é um compromisso do projeto; juridicamente, vale o que a AGPL-3.0 determina.

## Sustentabilidade

O Instituto não tem fins lucrativos e não lucra com as igrejas. Os custos de operação (servidor, banco de dados, WhatsApp oficial/Meta e outros serviços) podem ser cobertos:

- por **patrocinadores**, que poderão ser divulgados no rodapé da plataforma; e/ou
- pela **própria igreja que usa o sistema**, que pode arcar com os custos da sua operação.

Tudo com transparência: a igreja paga apenas o custo real da sua operação, sem margem de lucro para o Instituto.
