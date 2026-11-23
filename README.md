# doyourshit: da ideia ao MVP, em blocos que se fecham

O método que o Matheus usou no WavBox (`docs/MVP.md`, `docs/testes/MVP.md`, a skill `registro`, `docs/CUSTOS.md` e as skills da equipe), empacotado como plugin do Claude Code para servir a qualquer projeto novo ou herdado.

## A ideia em uma página

1. **Um projeto é uma sequência de círculos pequenos que se fecham.** Nada de dez frentes abertas: abre-se um bloco, testa-se, corrige-se o que apareceu, fecha-se, registra-se. Só então o próximo.
2. **Tudo tem dono: VOCÊ ou CLAUDE.** Cada passo do roteiro diz quem faz. O Claude roda comando, lê log e banco, escreve código e testes e **testa no navegador sozinho**. Você faz o que é físico ou pessoal: login com 2FA, cartão de teste, outra pessoa, outro computador, e as decisões.
3. **Número medido ou não aconteceu.** Resultado é `[x] data · 348/348, 34 s`, nunca "funcionou". E sempre: o que **não** foi testado.
4. **Achado vira A1, A2, A3…** Cada falha tem número, passo de origem, risco e situação. Bloco só fecha com cada achado corrigido ou com decisão (quem, quando).
5. **Recebido × feito.** Uma base marca o que você recebeu (ou o primeiro commit); um diário local anota cada mudança e cada teste; uma comparação mostra o que ficou sem registro.
6. **Nada sai do computador sem o seu "sim".** Commit, push, PR, issue e comentário pedem autorização naquele momento.
7. **Custo zero até a venda abrir.** Nada que gere cobrança sem o "sim" do dono; pagamento só em modo de teste; teste roda no computador antes da nuvem.
8. **Documentação viva no repositório.** A memória do Claude fica só na sua máquina; o que outra pessoa precisa saber vai para `docs/`, changelog e PR.

## O ciclo do projeto

| Fase | O que sai | Comando |
| --- | --- | --- |
| 0. Ideia | Para quem, a promessa, como medir | `/doyourshit:guia` |
| 0b. Viabilidade, marca e venda | Custo e tempo, concorrentes, marca, voz, oferta e preço | `/doyourshit:viabilidade`, agentes `pesquisa-mercado`, `marca` e `vendas`, `/doyourshit:textos` |
| 1. Base | `AGENTS.md`, `CLAUDE.md`, `docs/KIT.md`, `docs/CUSTOS.md`, templates de issue e PR, pasta de registro e a base | `/doyourshit:novo-projeto` |
| 2. MVP | `docs/MVP.md`: princípios, as 3 perguntas, o que entra agora, o que fica para depois, progresso ponderado | `/doyourshit:guia` |
| 3. Roteiro | `docs/testes/ROTEIRO.md`: etapas, blocos T0…Tn, passos VOCÊ/CLAUDE, placar, ambiente, contas | `/doyourshit:guia` |
| 4. Blocos | Cada bloco aberto, testado, corrigido, fechado e registrado | `/doyourshit:bloco` |
| 5. Ponta a ponta | O ciclo inteiro com uma pessoa de verdade | `/doyourshit:bloco` (último bloco) |
| 6. Lançamento e depois | Versões 1.1, 1.2… uma por vez | `/doyourshit:guia` |

No dia a dia: `/doyourshit:treinamento` (quem entra no projeto), `/doyourshit:comecar` (issue → ramo → worktree), `/doyourshit:registro` (anota, compara, prepara envio), `/doyourshit:testar-navegador` (o Claude testa as telas), `/doyourshit:relatar` (achado → issue) e `/doyourshit:novidades` (o que mudou).

O ciclo de um bloco:

```
abrir → rodar os passos (CLAUDE e VOCÊ) → achados A1… → corrigir → retestar → fechar → registrar → enviar (com "sim")
```

## Instalar

O repositório é privado: a máquina precisa do `gh` logado numa conta com acesso a `matheuspappin/doyourshit`.

```bash
claude plugin marketplace add matheuspappin/doyourshit
```

```bash
claude plugin install doyourshit@matheus
```

Para pegar uma versão nova depois:

```bash
claude plugin marketplace update matheus
```

Na VPS do Matheus, o marketplace aponta para a pasta local `/home/projetos/matheus-kit`: o que muda ali vale nas próximas sessões, sem precisar de push.

## Num projeto

- **Novo:** abra o Claude na pasta vazia e diga `/doyourshit:guia`. Ele pergunta a ideia e monta a base.
- **Herdado** (como foi o AKAAI): `/doyourshit:guia` também. Ele marca a base do que você recebeu, roda o T0 (testes automáticos que já existem) e monta o roteiro a partir do que o projeto já tem.

O arquivo `docs/KIT.md` de cada projeto guarda o que muda de um para o outro (repositório, dono, pasta do registro, comandos de teste, ambiente). As skills leem dali; nada fica fixo nelas.

## O que está aqui

| Caminho | O quê |
| --- | --- |
| `skills/guia/` | O guia: diz em que fase o projeto está e qual é o próximo passo |
| `skills/novo-projeto/` | Monta a base; `modelos/` tem todos os arquivos de partida |
| `skills/bloco/` | O ciclo de um bloco do roteiro |
| `skills/registro/` | Diário local, base, comparação (`comparar.sh`) e preparo do envio |
| `skills/testar-navegador/` | Como o Claude testa telas: Playwright, Chrome DevTools, o seu Chrome e a sua tela |
| `skills/relatar/`, `comecar/`, `novidades/`, `treinamento/` | Achado → issue; issue → worktree; o que mudou; treino de quem entra |
| `skills/viabilidade/`, `textos/`, `video/` | Custo, tempo e mercado na ideia; voz e revisão de textos; a fábrica de vídeo (o molde fica em `video/molde/`) |
| `agents/pesquisa-mercado.md`, `marca.md`, `vendas.md`, `video-*.md` | Concorrentes; marca e criativo; vendas; as 4 etapas do vídeo |
| `METODO.md` | O método completo |
| `agents/testador.md` | Subagente que roda testes e relata números, sem editar código |
