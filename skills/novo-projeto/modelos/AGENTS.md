# {{PROJETO}}: guia para agentes

Leia este arquivo antes de qualquer tarefa. O projeto segue o método **doyourshit** (plugin do Claude Code): da ideia ao MVP em blocos que se fecham.

## O que é

{{FRASE}}

## Mapa

| Caminho | O que é |
| --- | --- |
| `docs/KIT.md` | Configuração do projeto: repositório, dono, registro, comandos, ambiente, avisos |
| `docs/MVP.md` | O que é o MVP, o que entra agora, o progresso |
| `docs/testes/ROTEIRO.md` | O roteiro de testes: blocos T0…Tn, placar e achados |
| `docs/CUSTOS.md` | Custo zero, risco A/B/C, onde roda cada teste, hotfix |
| `CHANGELOG.md` | O que mudou, com data e hora |
| `.github/` | Templates de issue (bug, usabilidade, feature) e de PR |

## Como trabalhamos

- **Blocos que se fecham:** abrir → passos do Claude → "sua vez" → achados A1… → corrigir → retestar → fechar → boletim → registro → envio. Um bloco por vez (`/doyourshit:bloco`).
- **O Claude faz tudo o que consegue sozinho**, inclusive testar telas no navegador. A pessoa entra no que é físico, pessoal ou decisão.
- **Pede "sim" antes de:** commit, push, PR, issue, comentário; escrever em produção; correção grande; qualquer gasto.
- **Número medido ou não aconteceu**, sempre com o que **não** foi testado.
- **Trabalho em worktree** (`/doyourshit:comecar`), nunca trocando de ramo na pasta principal.

## Regras comuns

- **Idioma:** português do Brasil em tudo (respostas, código, interface, commits).
- **Segredos só em `.env`**, que nunca entra no git.
- **Sem dependência nova** sem necessidade clara.
- **Custo zero** até a venda abrir (`docs/CUSTOS.md`).
- **A memória do Claude fica só na máquina de cada um:** o que outra pessoa precisa saber vai para `docs/`, para o `CHANGELOG.md` ou para o PR.
- **Modelo do tamanho da tarefa:** Haiku para busca e resumo; Sonnet para quase tudo; Opus só para arquitetura, plano e revisão final, dizendo por quê.

## Comandos

Ver `docs/KIT.md` › "Comandos de teste".
