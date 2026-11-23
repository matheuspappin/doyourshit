---
name: guia
description: O guia do Matheus para qualquer projeto, da ideia ao MVP e depois. Descobre em que fase o projeto está (ideia, base, MVP, roteiro, blocos, ponta a ponta, lançamento), diz o próximo passo, quem faz (VOCÊ ou CLAUDE) e conduz uma pergunta por vez. Use quando ele disser "guia", "por onde começo", "projeto novo", "peguei um projeto", "onde estamos", "o que falta para o MVP", "qual o próximo passo", ou abrir o Claude numa pasta sem docs/KIT.md.
---

# Guia: da ideia ao MVP em círculos que se fecham

Responda em português do Brasil, em linguagem simples, **uma pergunta por vez**. O Matheus decide; você propõe com uma recomendação. O método completo está no `METODO.md` do plugin (duas pastas acima desta skill).

## 1. Descobrir a fase

Leia, se existirem: `docs/KIT.md`, `AGENTS.md`, `docs/MVP.md`, `docs/testes/ROTEIRO.md`, o `REGISTRO.md` da pasta do registro (o caminho está no `docs/KIT.md`) e `git log --oneline -10`.

| Fase | Sinal de que está nela | Próximo passo |
| --- | --- | --- |
| 0. Ideia | Pasta vazia ou sem `docs/KIT.md` e sem código | Perguntas da seção 2 |
| 0b. Viabilidade, marca e venda | Falta um destes: `docs/VIABILIDADE.md`, `docs/CONCORRENCIA.md`, `docs/MARCA.md`, `docs/VOZ.md` | O primeiro que faltar, na ordem da seção 2 (o `docs/VENDAS.md` pode esperar a fase 6) |
| 1. Base | Sem `docs/KIT.md` (projeto novo ou herdado) | `/doyourshit:novo-projeto` |
| 2. MVP | `docs/MVP.md` ausente ou com "Entra agora" vazio | Seção 3 |
| 3. Roteiro | `docs/testes/ROTEIRO.md` ausente ou sem blocos | Seção 4 |
| 4. Blocos | Roteiro com placar e blocos abertos | `/doyourshit:bloco` no primeiro bloco não fechado |
| 5. Ponta a ponta | Todos os blocos fechados menos o último | `/doyourshit:bloco` no bloco de ponta a ponta |
| 6. Lançamento | Ponta a ponta fechado | Seção 5 |

Diga em 3 a 5 linhas: a fase, o progresso do MVP (se houver), o que bloqueia, e o próximo passo com quem faz. Depois pergunte se segue.

## 2. Ideia (fase 0)

Uma pergunta por vez, e anote as respostas para o `docs/MVP.md`:

1. Para quem é? Uma pessoa concreta, não "todo mundo".
2. Qual a promessa, numa frase? O ciclo que ela completa do começo ao fim.
3. Como a pessoa paga, se paga? (A recorrência é o coração do negócio quando há cobrança.)
4. Como medir se deu certo? De 2 a 4 números.
5. O que já existe (código, protótipo, concorrente)?

Depois das respostas, ainda na ideia e **antes de construir**:

1. **Viabilidade** (`/doyourshit:viabilidade`): custo (construir, por mês, por cliente), tempo até o MVP no ritmo do método, e o agente `pesquisa-mercado` em paralelo (concorrentes, como fazer mais barato, como se destacar). Sai o `docs/VIABILIDADE.md` com o veredito.
2. **Marca** (agente `marca`): 2 ou 3 caminhos de posicionamento, nome, voz, cores, fontes e logo; o Matheus escolhe e sai o `docs/MARCA.md`.
3. **Voz** (`/doyourshit:textos`, modo 1): o `docs/VOZ.md`, para o projeto não nascer com texto de sistema.
4. **Vendas** (agente `vendas`): oferta, preço, os 10 primeiros clientes e os canais (`docs/VENDAS.md`). Pode ficar para antes do lançamento, mas o preço e a oferta ajudam a cortar o MVP.

Os agentes rodam em paralelo quando não dependem um do outro (mercado e o rascunho de custo juntos; marca depois do mercado). Cada um termina com uma pergunta para o Matheus decidir.

Projeto herdado: primeiro o `/doyourshit:novo-projeto` no modo "herdado" (base e T0, para saber o estado real). Logo depois do T0, volte para cá e faça a fase 0b a partir do que o código já faz: o veredito da viabilidade, a marca e a voz que ainda não existirem. Marca e voz já existentes (um site, um logo) entram como o caminho "atual", ao lado das alternativas.

## 3. MVP (fase 2)

Monte o `docs/MVP.md` a partir do modelo (`skills/novo-projeto/modelos/docs/MVP.md`), usando o que a fase 0b decidiu: o diferencial do `docs/CONCORRENCIA.md` entra no "Entra agora"; o que o mercado já faz bem e não diferencia vai para "Fica para depois"; o caminho mais barato do `docs/VIABILIDADE.md` vira princípio; o preço e a oferta, se já existirem, dizem o que precisa estar pronto para cobrar.

- **Princípios:** simples, mas não básico; uma solução por problema; custo zero até a venda abrir; mais os do projeto.
- **As 3 perguntas** para uma feature entrar agora: fecha o ciclo da promessa? Dá para manter com a equipe e o custo atuais? Sem ela, a pessoa deixaria de pagar ou de usar?
- **Entra agora:** de 5 a 10 itens, cada um com peso (1, 2 ou 3) e estágio (0, 10, 25, 50, 75, 90 ou 100%).
- **Fica para depois:** versões 1.1, 1.2…, uma por vez.
- **Duplicações a tirar:** duas telas, dois caminhos ou dois provedores para a mesma coisa.

Mostre o rascunho e peça o "sim" antes de passar ao roteiro. Se o projeto tem outro dono, o MVP é uma **proposta** até o dono aprovar: escreva isso no topo.

## 4. Roteiro (fase 3)

Monte o `docs/testes/ROTEIRO.md` a partir do modelo:

- **Etapas** (de 3 a 5), cada uma com objetivo e "sai quando". O padrão: validar o que existe → dinheiro → fechar as lacunas → ponta a ponta.
- **Blocos T0…Tn:** T0 é sempre a base automática (lint, testes, build, auditorias que o projeto já tem), e o último é sempre a ponta a ponta com uma pessoa de verdade. Um bloco por área do produto, com 5 a 9 passos.
- **Cada passo:** `ID | Quem | Faz | Esperado | Resultado`. **Quem** é VOCÊ ou CLAUDE (regra na seção 6).
- **Ambiente de teste** (o que roda onde e quem cuida) e **contas de teste** (papel e o que precisa).
- **Placar** no topo e a tabela de **Achados** no fim.

## 5. Lançamento e depois (fase 6)

Comece a preparar o lançamento quando o roteiro chegar à etapa de ponta a ponta, não depois:

1. **Vendas** (agente `vendas`): se ainda não existe, o `docs/VENDAS.md`; se existe, atualize com o que os blocos mostraram (preço, o que funciona de verdade, provas com números).
2. **Textos** (`/doyourshit:textos`, modo 2): revisão de todas as telas que a pessoa da ponta a ponta vai ver, da página de venda e dos e-mails.
3. **Vídeo** (`/doyourshit:video`): de 1 a 3 vídeos curtos (15 a 20 s) para os canais do `docs/VENDAS.md`, com telas reais do produto já testado.
4. **Lista técnica:** domínio e HTTPS, backup, termos e privacidade, pagamento fora do modo de teste (só com o "sim" do dono, porque passa a gerar cobrança), monitoramento de erros e um plano de hotfix.

Depois do lançamento, um roteiro novo por versão (1.1, 1.2…), no mesmo formato, e a viabilidade refeita com os números reais (clientes, custo por mês, ritmo).

## 6. Quem faz o quê

| CLAUDE faz sozinho | VOCÊ faz (o Claude não consegue ou não deve) |
| --- | --- |
| Rodar comandos, testes, build e auditorias; ler log, banco e erros | Login com senha ou 2FA, código por SMS ou e-mail |
| Escrever código, testes, docs e o registro | Cartão de teste no checkout, quando a tela pede a pessoa |
| Testar telas no navegador (`/doyourshit:testar-navegador`): abrir, clicar, preencher, print, console, rede | Outra pessoa, outro computador, celular, Mac, aparelho físico |
| Tirar print da sua tela durante um teste no seu PC (computer-use) | Decisões de produto, preço, escopo, aprovar o MVP e o plano |
| Montar commit, PR e issue | Dizer "sim" para commit, push, PR, issue, comentário e qualquer gasto |

Se um passo VOCÊ puder virar CLAUDE com um script ou com o navegador, proponha.

## Regras

- Comando que o Matheus roda vai rotulado com o lugar (por exemplo, "No seu Windows (PowerShell)"); o que roda na máquina do Claude, o Claude roda.
- Ao relatar, números medidos e o que não foi testado.
- Mudou de fase: uma entrada no registro (`/doyourshit:registro`).
