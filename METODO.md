# O método: da ideia ao MVP em blocos que se fecham

> **Estado:** rascunho para o Matheus aprovar (2026-11-23). Base: o que ele usou no **WavBox** (`docs/MVP.md`, `docs/testes/MVP.md`, a skill `registro`, `docs/CUSTOS.md` e as skills da equipe). O AKAAI CORE não seguia este padrão e não serve de referência. Depois do "ok", este documento vira as skills do kit (seção 9).

## 1. A ideia

Um projeto anda em **círculos pequenos que se fecham**, um de cada vez: abre-se um bloco, testa-se, corrige-se o que apareceu, fecha-se, registra-se e só então vem o próximo. Nada de dez frentes abertas.

Três coisas sustentam isso:

1. **O Claude faz tudo o que consegue fazer sozinho**, inclusive testar telas no navegador. O Matheus só entra no que é físico, pessoal ou decisão.
2. **O Matheus sempre sabe o que foi testado**, com números, sem ter que perguntar e sem ser interrompido à toa.
3. **Tudo fica escrito**: o que foi recebido, o que foi feito, o que foi testado e o que **não** foi testado.

## 2. As fases de um projeto

| Fase | O que sai | Sai quando |
| --- | --- | --- |
| **0. Ideia** | Para quem é, a promessa numa frase, como a pessoa paga, como medir | O Matheus responde as 5 perguntas |
| **0b. Viabilidade, marca e venda** | `docs/VIABILIDADE.md` (custo para construir, por mês e por cliente; tempo até o MVP no ritmo do método; veredito), `docs/CONCORRENCIA.md` (quem já faz, como fazer mais barato, como se destacar), `docs/MARCA.md` (2 ou 3 caminhos; o escolhido vira regra), `docs/VOZ.md` (tom, glossário, proibidos) e `docs/VENDAS.md` (oferta, preço, primeiros clientes) | O Matheus decide se vale, escolhe a marca e aprova o preço |
| **1. Base** | `AGENTS.md`, `CLAUDE.md`, `docs/KIT.md` (o que muda de projeto para projeto), `docs/CUSTOS.md`, templates de issue e de PR, pasta do registro e a **base** (o que foi recebido) | O T0 roda |
| **2. MVP** | `docs/MVP.md`: princípios, as 3 perguntas, o que entra agora (com peso e estágio), o que fica para depois, duplicações a tirar, progresso | O Matheus (ou o dono) aprova |
| **3. Roteiro** | `docs/testes/ROTEIRO.md`: etapas, blocos T0…Tn, cada passo com **quem faz**, ambiente, contas de teste, placar, achados | O Matheus aprova |
| **4. Blocos** | Cada bloco aberto, testado, corrigido, fechado e registrado | Todos os blocos fechados, menos o último |
| **5. Ponta a ponta** | O ciclo inteiro feito por uma pessoa de verdade, sozinha | Ela fez tudo e (se for o caso) pagou |
| **6. Lançamento e depois** | Lista de lançamento; depois, um roteiro por versão (1.1, 1.2…) | — |

Projeto **herdado** (que já existe): marca-se a base do que foi recebido, roda-se o T0 com os testes que o projeto já tem, e o MVP e o roteiro saem do que o código já faz.

**As 3 perguntas** para uma feature entrar no MVP: fecha o ciclo da promessa? Dá para manter com a equipe e o custo de hoje? Sem ela, a pessoa deixaria de pagar ou de usar? Precisa de três "sim".

**Progresso do MVP:** cada item de "Entra agora" tem um peso (1, 2 ou 3, pelo tamanho do que falta) e um estágio: 0% nada; 10% só a especificação; 25% planejado; 50% parte do código; 75% pronto e testado localmente; 90% revisado e no ramo principal; 100% no ar e validado com gente de verdade. O progresso é a média ponderada, sempre com data e evidência.

### Quem entra quando

O `/doyourshit:guia` olha quais arquivos existem e chama a peça certa; você não precisa lembrar a ordem.

| Momento | Quem entra | Dispara quando | Sai |
| --- | --- | --- | --- |
| Ideia | `/doyourshit:guia` (5 perguntas) | Pasta sem `docs/KIT.md` | Respostas para o MVP |
| Viabilidade | `/doyourshit:viabilidade` + agente `pesquisa-mercado` (juntos) | Falta `docs/VIABILIDADE.md` | Custo, tempo, mercado e veredito |
| Marca | Agente `marca` | Falta `docs/MARCA.md` (depois do mercado) | 2 ou 3 caminhos → você escolhe |
| Voz | `/doyourshit:textos` (modo 1) | Falta `docs/VOZ.md` (depois da marca) | Tom, glossário, proibidos |
| Base | `/doyourshit:novo-projeto` | Falta `docs/KIT.md` | Base, registro e, no herdado, o T0 |
| MVP e roteiro | `/doyourshit:guia` | Falta `docs/MVP.md` ou o roteiro | Escopo cortado pelo diferencial e pelo preço |
| Cada bloco | `/doyourshit:bloco` + agente `testador` + `/doyourshit:testar-navegador` | Roteiro com bloco aberto | Boletim, achados, ritmo medido |
| Bloco com tela | + `/doyourshit:textos` (modo 2) e conferência da marca | O bloco mostra tela ou texto para quem usa | Achados de texto e visual (risco B) |
| Antes da ponta a ponta | Agente `vendas`, `/doyourshit:textos` (modo 2), `/doyourshit:video` | Fechou o último bloco antes da ponta a ponta | Oferta e canais, textos revisados, vídeos curtos |
| Lançamento | `/doyourshit:guia` (fase 6) | Ponta a ponta fechada | Lista técnica; depois, roteiro por versão |
| Todo dia | `/doyourshit:registro`, `/doyourshit:comecar`, `/doyourshit:relatar`, `/doyourshit:novidades` | Mudança, issue, achado, volta ao trabalho | Diário, worktree, issue, resumo |
| Gente nova | `/doyourshit:treinamento` | Alguém entra no projeto | Treino com o progresso salvo |

Projeto herdado: base e T0 primeiro (para saber o estado real); a viabilidade, a marca e a voz vêm logo em seguida, a partir do que já existe.

## 3. O bloco: o círculo que se fecha

```
abrir → o Claude roda os passos dele → a sua vez (passos VOCÊ, todos juntos)
      → achados A1, A2… → corrigir → retestar → fechar → boletim → registro → envio (com "sim")
```

- **Blocos T0…Tn.** O T0 é sempre a base automática (lint, testes, build, auditorias). O último é sempre a ponta a ponta. Os do meio, um por área do produto, com 5 a 9 passos cada.
- **Cada passo:** `ID | Quem | Faz | Esperado | Resultado`.
- **Resultado:** `[x] 2026-11-23 · 348/348, 34 s` quando passou; `[!] 2026-11-23 · o que falhou (A7)` quando falhou; `[-] motivo` quando não se aplica. Nunca `[x]` sem conferência do Claude ou relato do Matheus.
- **Achados:** cada falha, dúvida ou dívida vira A1, A2, A3…, com numeração contínua no projeto inteiro, com o passo de origem, o risco e a situação ("aberto", "corrigido no ramo X e retestado em <data>", "decisão de <quem> em <data>", "fica para a 1.1").
- **Risco:** **A** = dinheiro, login, dados, segurança ou contrato entre partes (só sai testado); **B** = interface, texto, lógica sem contrato (pode ir ao ar e ser conferido lá, com hotfix); **C** = ferramenta, teste ou documentação, sem efeito para quem usa.
- **Fecha quando:** todos os passos estão `[x]` ou `[-]`, e todo achado do bloco está corrigido ou tem decisão.
- **Uma correção nunca fecha sozinha:** o Claude roda de novo o passo que falhou **e** o T0.

## 4. Quem faz o quê

**Regra:** se o Claude consegue fazer, ele faz, sem perguntar. Antes de escrever um passo como VOCÊ, o Claude tenta transformá-lo em CLAUDE (um script, um teste automático, o navegador ou um print da tela).

| CLAUDE, sozinho e sem perguntar | VOCÊ |
| --- | --- |
| Rodar comandos, testes, build e auditorias | Senha, 2FA e código por SMS ou e-mail |
| Subir e derrubar o ambiente de teste; ler log, banco e erros | Cartão de teste quando a tela exige uma pessoa |
| Testar telas no navegador (seção 5) | Outra pessoa, outro computador, celular, Mac ou aparelho físico |
| Tirar print da sua tela durante um teste no seu PC | Ouvir, ver e sentir (som, latência percebida, "ficou bonito?") |
| Escrever código, testes, documentação e o registro | Decisões de produto, preço e escopo; aprovar o MVP e o roteiro |
| Corrigir achado pequeno com causa clara, no ramo do bloco | O "sim" para commit, push, PR, issue, comentário e qualquer gasto |

**O que o Claude pergunta antes** (o resto ele faz):

1. Qualquer coisa que gere cobrança em dinheiro.
2. Commit, push, PR, issue e comentário: o "sim" vale para aquele pedido, não para o próximo.
3. Escrever em produção ou em conta real (só leitura, ou uma conta marcada `[TESTE]`).
4. Correção grande ou que muda o produto: corrigir agora, adiar ou levar ao dono?
5. Decisão de produto.

## 5. Os testes que o Claude faz no navegador

| Situação | Ferramenta |
| --- | --- |
| Fluxo que vai se repetir (cadastro, compra, login com conta de teste) | **Playwright**: vira teste automático e passa a rodar no T0 |
| Tela do app rodando na máquina do Claude | **Chrome DevTools**, sem tela: clica, preenche, tira print, lê console e rede, mede desempenho |
| Precisa dos seus logins (Google, Stripe de teste, painéis) ou do site no ar | **O seu Chrome**, pela extensão Claude in Chrome |
| App nativo, instalador, DAW, o que só aparece na sua tela | **Computer-use**: o Claude tira o print, você não precisa mandar |

Em cada tela o Claude confere o esperado **com evidência** (texto na tela, linha no banco, requisição com o status certo, console sem erro), mede (tempo, erros, status) e testa também o que quebra: campo vazio, valor inválido, voltar, recarregar no meio, tela de celular. Os prints ficam em `<pasta do registro>/evidencias/<bloco>/`.

**Limites:** senha e 2FA são sempre suas, e o Claude nunca as pede nem as escreve. Dinheiro, só em modo de teste. No seu Chrome, antes de agir numa conta real (enviar, publicar, apagar), o Claude diz o que vai fazer e espera o "sim".

## 6. Como você fica sabendo dos testes

O objetivo é você saber **tudo** o que foi testado sem precisar perguntar e sem ser interrompido por coisa pequena.

### 6.1 Quando o Claude fala com você

| Momento | O que você recebe | Formato |
| --- | --- | --- |
| **Ao abrir um bloco** | O que vai ser testado, quantos passos são do Claude e quantos seus, e quanto tempo leva | 3 linhas |
| **Durante os passos do Claude** | Nada, a não ser que aconteça algo da linha de baixo | — |
| **Na hora, interrompendo** | Achado de risco A, bloqueio que só você resolve, ou algo que poderia apagar ou cobrar | 1 aviso curto + o que precisa de você |
| **"Sua vez"** | Todos os seus passos juntos, numa lista para fazer de uma vez, cada um com onde clicar e o que deve aparecer | Lista numerada |
| **Ao fechar o bloco** | O **boletim** (6.2) | Sempre igual |
| **Longe do computador** | Bloco fechado, bloqueado, ou "sua vez", pelo WhatsApp (skill `recado-whatsapp`) | 1 mensagem |
| **Quando você quiser** | "Como está?" mostra o placar, os achados abertos e o progresso | Até 10 linhas |

### 6.2 O boletim do bloco

Sempre no mesmo formato, para você bater o olho:

```
T3 · Alunos, pacotes e créditos: FECHADO (7/7) em 2026-11-23 15:40

Testado pelo Claude (5): cadastro, edição, pacote, crédito, saldo: 5/5,
  tela em 1,2 s, 0 erros de console, 14 requisições ok. Prints em evidencias/T3/
Testado por você (2): pagamento com cartão de teste, aviso no celular: 2/2
Achados novos: A12 (B, corrigido e retestado), A13 (C, fica para a 1.1)
NÃO testado: Safari no iPhone (sem aparelho)
Progresso do MVP: 48% → 55% (item 3 passou de 50% para 75%)
Preciso de você: nada | 1. decidir o A13  2. "sim" para enviar o PR
Próximo: T4 · Isolamento entre estúdios (6 passos, 1 seu)
```

### 6.3 Onde fica tudo escrito

| O quê | Onde | Para quem |
| --- | --- | --- |
| Placar, passos, resultados e achados | `docs/testes/ROTEIRO.md` | Equipe (vai para o GitHub) |
| Progresso do MVP | `docs/MVP.md` | Equipe |
| Diário de cada mudança e de cada teste | `<pasta do registro>/REGISTRO.md` | Só você (local) |
| Recebido × feito | `BASE.md` e `COMPARACAO.md` na pasta do registro | Só você |
| Prints e saídas | `<pasta do registro>/evidencias/` | Só você |

## 7. A conversa fluida

- **O Claude não pergunta o que ele mesmo pode conferir.** Ele lê o log, o banco e a tela. Quando você disser "testei", ele confere o rastro antes de marcar.
- **Uma pergunta por vez**, com a recomendação primeiro e botões para responder.
- **Seus passos vêm em lote** (a "sua vez"), não um por mensagem.
- **Print é com o Claude:** em teste no seu PC, ele tira pelo computer-use.
- **Comando que é para você rodar vem rotulado com o lugar** (por exemplo, "No seu Windows (PowerShell)"). O que roda na máquina do Claude, o Claude roda.
- **Atalhos para você:** "próximo bloco", "como está?", "testei", "registra", "prepara o envio", "manda no zap quando terminar".
- **Modelo do tamanho da tarefa:** Haiku para busca e resumo de log; Sonnet para quase tudo; Opus só para arquitetura, plano e revisão final, dizendo por quê.

## 8. Regras fixas

1. **Nada sai do computador sem o seu "sim":** commit, push, PR, issue e comentário.
2. **Custo zero até a venda abrir:** nada que gere cobrança sem o "sim" do dono; pagamento só em modo de teste; o teste roda no computador antes da nuvem.
3. **Número medido ou não aconteceu**, e sempre com o que não foi testado.
4. **Segredo só no `.env`**, que nunca entra no git nem no registro.
5. **Projeto de outro dono:** MVP e roteiro são proposta até o dono aprovar; quem não é o dono nunca faz merge no ramo principal.
6. **A memória do Claude fica só na sua máquina:** o que outra pessoa precisa saber vai para `docs/`, para o changelog ou para o PR.

## 9. Como vira ferramenta (depois do "ok")

Um plugin do Claude Code, o **kit**, instalado uma vez e usado em todo projeto:

| Comando | Faz |
| --- | --- |
| `/doyourshit:guia` | Diz em que fase o projeto está e qual é o próximo passo; conduz as fases 0, 0b, 2, 3 e 6 |
| `/doyourshit:novo-projeto` | Monta a base (fase 1) com os modelos, para projeto novo ou herdado |
| `/doyourshit:bloco` | O ciclo do bloco (seção 3), com a "sua vez" e o boletim |
| `/doyourshit:testar-navegador` | Os testes de tela (seção 5) |
| `/doyourshit:registro` | Diário, base, comparação e preparo do envio |
| `/doyourshit:relatar`, `/doyourshit:comecar`, `/doyourshit:novidades` | Achado → issue; issue → ramo e worktree; o que mudou |
| `/doyourshit:viabilidade` | Custo, tempo (no ritmo medido do método) e mercado, antes de construir |
| `/doyourshit:textos` | Define a voz no começo e revisa telas, e-mails, site e anúncios (método do modo clarify da impeccable) |
| `/doyourshit:video` | A fábrica de vídeo (Remotion + Higgsfield), instalada no projeto e vestida com a marca |
| `/doyourshit:treinamento` | Treino de quem entra no projeto |
| Agente `testador` | Roda baterias de teste e relata números, sem editar código |
| Agente `pesquisa-mercado` | Concorrentes, preços, reclamações, como fazer mais barato e como se destacar |
| Agente `marca` | Posicionamento, nome, voz, cores, fontes, logo e primeiras ideias de marketing, em 2 ou 3 caminhos |
| Agente `vendas` | Só vendas: oferta, preço, fundadores, os 10 primeiros clientes, canais, funil e textos de abordagem |
| Agentes `video-diretor`, `video-gerador`, `video-montador`, `video-revisor` | As etapas do vídeo: roteiro, gerações pagas, montagem e revisão |

**Tempo com o método.** A estimativa usa o ritmo medido no WavBox (2026-11): de 10 a 22 passos de teste fechados por dia de trabalho, a maioria feita pelo Claude; o MVP foi de 37% a 62,5% em 7 dias corridos. O que segura são os passos VOCÊ, as aprovações e os terceiros. Cada projeto mede o próprio ritmo ao fechar os blocos.

**De onde vem cada uma.** As skills que o Figuerah montou para a equipe do WavBox e as que o Matheus criou entram no kit, sem os nomes, caminhos e regras próprios do WavBox:

| Skill no WavBox | Quem fez | No kit |
| --- | --- | --- |
| `comecar` | Figuerah | `/doyourshit:comecar`, igual, lendo repositório e fluxo do `docs/KIT.md` |
| `relatar` | Figuerah | `/doyourshit:relatar`: achado A<n> → issue no formato dos templates |
| `novidades` | Figuerah | `/doyourshit:novidades`, igual |
| `treinamento` | Figuerah | `/doyourshit:treinamento`: treino de quem entra no projeto, com os módulos montados a partir dos docs do projeto |
| `teste-mac` | Figuerah | Vira um padrão: o teste numa máquina que o Claude não alcança (Mac, celular) é um passo VOCÊ com um script `check-*.sh` e um relatório pronto |
| `registro` | Matheus | `/doyourshit:registro`, com o `comparar.sh` genérico |
| `recado-whatsapp` | Matheus | Continua sendo dele; o kit usa para os avisos (seção 6) |
| `docs/MVP.md`, `docs/testes/MVP.md`, `docs/CUSTOS.md`, templates de issue e de PR | Matheus e Figuerah | Modelos do `/doyourshit:novo-projeto` |

O `docs/KIT.md` de cada projeto guarda o que muda (repositório, dono, pasta do registro, comandos de teste, ambiente, contas), e as skills leem dali. O kit fica em `/home/projetos/matheus-kit` e, se você quiser, num repositório seu no GitHub, para instalar em qualquer máquina.

## Para decidir

1. O método está certo? O que tirar ou mudar?
2. Aviso pelo WhatsApp: em todo boletim, ou só quando o bloco bloqueia e na "sua vez"?
3. O kit vai para um repositório seu no GitHub (privado), ou fica só nesta máquina por enquanto?
