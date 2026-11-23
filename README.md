# doyourshit

Um plugin do Claude Code que leva um projeto da ideia ao MVP **em blocos pequenos que se fecham, um de cada vez**, com o Claude fazendo sozinho tudo o que consegue (inclusive testar as telas no navegador) e você entrando só no que é seu: decisões, aparelhos, senhas e o "sim".

Nasceu no WavBox, onde esse jeito de trabalhar levou o MVP de 37% a 62,5% em 7 dias, com 60 passos de teste fechados em 4 dias de trabalho. Aqui ele está empacotado para servir a qualquer projeto, novo ou herdado.

## Por que existe

Projeto com ajuda de IA costuma abrir dez frentes ao mesmo tempo, terminar nenhuma e não deixar claro o que foi testado de verdade. O doyourshit troca isso por um ciclo curto e repetível: abrir um bloco, testar, corrigir o que apareceu, fechar, registrar. Só então o próximo.

## O que você ganha

- **Antes de construir, saber se vale:** custo (para construir, por mês e por cliente), tempo até o MVP no ritmo medido do método, concorrentes, como fazer mais barato e onde se destacar.
- **Marca, voz e venda desde o começo:** 2 ou 3 caminhos de marca para você escolher, um guia de voz para os textos não soarem como sistema, e um plano de venda com preço, oferta e os 10 primeiros clientes.
- **Um roteiro de testes que diz quem faz cada passo:** CLAUDE ou VOCÊ. O Claude roda os dele sem perguntar; os seus chegam todos juntos, numa lista só.
- **Resultado com número, nunca "funcionou":** cada passo marcado com data e medida, e sempre o que **não** foi testado.
- **Tudo registrado:** o que você recebeu, o que mudou, o que foi testado. Nada sai do computador sem o seu "sim".
- **Vídeos curtos da marca** em Remotion, com telas reais do produto.

## Como é na prática

Ao fechar um bloco de testes, você recebe sempre o mesmo boletim:

```
T3 · Alunos, pacotes e créditos: FECHADO (7/7) em 2026-11-23 15:40

Testado pelo Claude (5): cadastro, edição, pacote, crédito, saldo: 5/5,
  tela em 1,2 s, 0 erros de console, 14 requisições ok. Prints em evidencias/T3/
Testado por você (2): pagamento com cartão de teste, aviso no celular: 2/2
Achados novos: A12 (B, corrigido e retestado), A13 (C, fica para a 1.1)
NÃO testado: Safari no iPhone (sem aparelho)
Progresso do MVP: 48% → 55% (item 3 passou de 50% para 75%)
Preciso de você: 1. decidir o A13  2. "sim" para enviar o PR
Próximo: T4 · Isolamento entre estúdios (6 passos, 1 seu)
```

Três termos que aparecem o tempo todo:

- **Bloco** (T0, T1, T2…): um pedaço do roteiro de testes, uma área do produto, com 5 a 9 passos. O T0 é sempre a base automática (lint, testes, build); o último é sempre o uso de ponta a ponta por uma pessoa de verdade.
- **Achado** (A1, A2, A3…): toda falha, dúvida ou dívida encontrada, com número, risco e situação. Um bloco só fecha quando cada achado está corrigido ou tem uma decisão.
- **"Sua vez"**: a lista dos passos que só você pode fazer naquele bloco, entregue de uma vez.

## Requisitos

| O quê | Para quê | Obrigatório? |
| --- | --- | --- |
| [Claude Code](https://claude.com/claude-code) | Roda o plugin | Sim |
| `gh` logado numa conta com acesso a este repositório | Instalar (o repositório é privado), issues e PRs | Sim |
| Git | Worktrees, base e registro | Sim |
| Node.js 20 ou mais novo | Fábrica de vídeo (Remotion) | Só para vídeo |
| Plugin ECC (traz o Chrome DevTools e o agente `e2e-runner`) | Testes de tela sem abrir o seu navegador | Recomendado |
| Extensão Claude in Chrome | Testes que precisam dos seus logins | Opcional |
| App Claude para desktop (computer-use) | O Claude tirar print da sua tela durante um teste | Opcional |
| Skill `recado-whatsapp` (não vem no kit) | Avisos pelo WhatsApp quando você está longe | Opcional |
| Skill impeccable (`npx skills add pbakaus/impeccable`) | Revisão de textos mais completa | Opcional |

## Instalar

```bash
claude plugin marketplace add matheuspappin/doyourshit
```

```bash
claude plugin install doyourshit@matheus
```

Abra uma sessão nova do Claude Code: os comandos `/doyourshit:…` já aparecem.

## Começar a usar

1. Abra o Claude Code na pasta do projeto (vazia, para um projeto novo, ou com o código, para um herdado).
2. Digite `/doyourshit:guia`.
3. O guia diz em que fase o projeto está e qual é o próximo passo, e conduz uma pergunta por vez. Ele olha quais documentos já existem, então dá para parar e voltar quando quiser.

Num projeto herdado, ele primeiro marca o que você recebeu e roda os testes que já existem, para mostrar o estado real em minutos.

## As fases e quem entra em cada uma

| Fase | Quem entra | O que sai |
| --- | --- | --- |
| 0. Ideia | `/doyourshit:guia` (5 perguntas) | Para quem é, a promessa, como paga, como medir |
| 0b. Viabilidade, marca e voz | `/doyourshit:viabilidade` com o agente `pesquisa-mercado`, depois o agente `marca` e `/doyourshit:textos` | `docs/VIABILIDADE.md`, `docs/CONCORRENCIA.md`, `docs/MARCA.md`, `docs/VOZ.md` |
| 1. Base | `/doyourshit:novo-projeto` | `AGENTS.md`, `CLAUDE.md`, `docs/KIT.md`, `docs/CUSTOS.md`, templates de issue e PR, pasta do registro |
| 2. MVP | `/doyourshit:guia` | `docs/MVP.md`: o que entra agora, o que fica para depois, progresso |
| 3. Roteiro | `/doyourshit:guia` | `docs/testes/ROTEIRO.md`: blocos, passos CLAUDE/VOCÊ, placar, achados |
| 4. Blocos | `/doyourshit:bloco`, com o agente `testador` e `/doyourshit:testar-navegador` | Um bloco fechado por vez, com boletim |
| 5. Ponta a ponta | `/doyourshit:bloco`; antes dele, o agente `vendas`, `/doyourshit:textos` e `/doyourshit:video` | O ciclo inteiro feito por uma pessoa de verdade; oferta, textos revisados e vídeos |
| 6. Lançamento e depois | `/doyourshit:guia` e `/doyourshit:documentar` | Lista técnica, README, um roteiro por versão |

O detalhe de cada fase, as regras e o porquê estão no [METODO.md](METODO.md).

## Comandos

| Comando | Faz | Diga, por exemplo |
| --- | --- | --- |
| `/doyourshit:guia` | Diz a fase e o próximo passo | "onde estamos?", "projeto novo" |
| `/doyourshit:viabilidade` | Custo, tempo e mercado antes de construir | "vale a pena?", "quanto custa?" |
| `/doyourshit:novo-projeto` | Monta a base do projeto | "aplica o método aqui" |
| `/doyourshit:bloco` | Abre, testa, fecha e manda o boletim de um bloco | "próximo bloco", "testei", "como está?" |
| `/doyourshit:testar-navegador` | O Claude testa telas sozinho | "testa essa tela" |
| `/doyourshit:registro` | Diário, recebido × feito, preparo do envio | "registra", "prepara o envio" |
| `/doyourshit:textos` | Define a voz e revisa textos | "o texto está estranho" |
| `/doyourshit:documentar` | Escreve o README e os docs a partir do estado real | "escreve o README" |
| `/doyourshit:video` | Vídeos curtos da marca | "quero um vídeo como este" |
| `/doyourshit:comecar` | Issue ou achado → ramo e worktree | "vamos corrigir o A7" |
| `/doyourshit:relatar` | Achado → issue no GitHub | "vira issue" |
| `/doyourshit:novidades` | O que mudou desde a última vez | "me atualiza" |
| `/doyourshit:treinamento` | Treino de quem entra no projeto | "sou novo aqui" |

| Agente | Faz |
| --- | --- |
| `testador` | Roda baterias de teste e devolve só os números, sem editar nada |
| `pesquisa-mercado` | Concorrentes, preços, reclamações, como fazer mais barato e como se destacar |
| `marca` | Posicionamento, nome, voz, cores, fontes e logo, em 2 ou 3 caminhos |
| `vendas` | Oferta, preço, fundadores, primeiros clientes, canais, funil e textos de abordagem |
| `video-diretor`, `video-gerador`, `video-montador`, `video-revisor` | Roteiro, gerações pagas, montagem e revisão dos vídeos |

## Custos, autorizações e limites

- **O que pede o seu "sim", naquele momento:** commit, push, PR, issue e comentário; escrever em produção ou em conta real; correção grande ou que muda o produto; qualquer gasto.
- **O que pode gerar cobrança:** só as gerações de vídeo no Higgsfield (cobradas em dólar, por geração). O Claude estima antes, mostra o valor e só gera com o seu "sim" e um limite.
- **Pagamento** fica em modo de teste até o dono do projeto liberar a venda.
- **O que o Claude nunca faz:** pedir ou digitar senha e 2FA, usar cartão de verdade, cadastrar cartão em serviço, mandar mensagem ou publicar em seu nome sem o "sim".
- O plugin escreve em **português do Brasil**.

## Por dentro

| Caminho | O quê |
| --- | --- |
| `.claude-plugin/` | Manifesto do plugin e do marketplace `matheus` |
| `METODO.md` | O método completo |
| `skills/<nome>/SKILL.md` | Uma pasta por comando |
| `skills/novo-projeto/modelos/` | Os arquivos que cada projeto recebe na base |
| `skills/registro/comparar.sh` | Compara o recebido com o feito (só lê o git) |
| `skills/video/molde/` | O molde de vídeo em Remotion, copiado para o projeto na primeira vez |
| `agents/` | Os agentes |

Cada projeto guarda o que é só dele no `docs/KIT.md` (repositório, dono, comandos de teste, ambiente, ritmo medido); as skills leem dali e nada fica fixo nelas.

## Atualizar e contribuir

- **Pegar a versão nova:** `claude plugin marketplace update matheus` e abra uma sessão nova.
- **Mudar o método:** edite o `METODO.md` e a skill correspondente, suba a versão em `.claude-plugin/plugin.json`, rode `claude plugin validate .` e abra um PR.
- **Versão atual:** 0.3.0.

## Créditos

- O método, o registro, a viabilidade e a fábrica de vídeo: Matheus Pappin, a partir do trabalho no WavBox.
- `comecar`, `relatar`, `novidades`, `treinamento` e o padrão do teste em outra máquina: adaptados das skills que o Figuerah criou para a equipe do WavBox.
- A revisão de textos segue o método do modo clarify da skill [impeccable](https://github.com/pbakaus/impeccable), de Paul Bakaus, que não vem copiada aqui.

Uso privado; todos os direitos reservados.
