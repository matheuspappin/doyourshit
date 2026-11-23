---
name: bloco
description: Conduz um bloco do roteiro de testes (T0…Tn de docs/testes/ROTEIRO.md) do começo ao fechamento — abrir, rodar sozinho os passos do CLAUDE, entregar os passos do VOCÊ todos juntos ("sua vez"), numerar os achados (A1, A2…), corrigir, retestar, fechar, mandar o boletim, atualizar placar e progresso do MVP e registrar. Use quando o Matheus disser "vamos testar o T3", "abre o bloco", "próximo bloco", "testei", "fecha o bloco", "como está?".
---

# Bloco: um círculo que se fecha

Responda em português do Brasil. Leia antes: `docs/KIT.md` (ambiente, comandos, pasta do registro, avisos), `docs/testes/ROTEIRO.md` e `docs/MVP.md`. O método inteiro está no `METODO.md` do plugin (seções 3, 4 e 6).

```
abrir → passos do CLAUDE → "sua vez" → achados → corrigir → retestar → fechar → boletim → registro → envio (com "sim")
```

## 1. Abrir

1. Escolha o bloco: o pedido dele ou o primeiro bloco do placar que não está fechado. Se ele quiser pular a ordem das etapas, diga o que fica sem base e siga se ele confirmar.
2. Antes de começar, tente transformar cada passo VOCÊ em CLAUDE (script, teste automático, navegador, print da tela dele). Se conseguir, reescreva o passo no roteiro e diga isso na abertura.
3. Suba o que for do CLAUDE no ambiente (servidor, banco, dados de teste).
4. **Avise em 3 linhas:** o bloco e o que ele testa; quantos passos são do Claude e quantos dele; o tempo estimado e o que ele vai precisar ter em mãos na "sua vez".

## 2. Passos do CLAUDE: sem perguntar, sem narrar

- Rode na ordem. Para telas, siga `/doyourshit:testar-navegador`. Para baterias longas, o agente `testador`.
- **Bloco que mostra tela ou texto para quem usa:** além do teste de funcionamento, passe os textos dessas telas pela `/doyourshit:textos` (modo 2, contra o `docs/VOZ.md`) e confira o visual contra o `docs/MARCA.md` (cores, fontes, logo). O que não bater vira achado de risco B.
- **Não narre passo a passo.** Só interrompa o Matheus por: achado de risco A, bloqueio que só ele resolve, ou algo que poderia apagar dado ou gerar cobrança.
- Guarde as evidências (prints, saídas, contagens) em `<pasta do registro>/evidencias/<bloco>/`.
- **Marcar** na coluna "Resultado": `[x] AAAA-MM-DD · <números>` quando passou, `[!] AAAA-MM-DD · <o que falhou> (A<n>)` quando falhou, `[-] AAAA-MM-DD · <motivo>` quando não se aplica. Nunca `[x]` sem evidência. Data: `TZ=America/Sao_Paulo date +%Y-%m-%d`.

## 3. "Sua vez": os passos do VOCÊ, todos juntos

Quando os passos do Claude acabarem (ou quando um passo dele depender de um do Matheus), mande **uma lista numerada** com todos os passos dele do bloco:

```
Sua vez no T3 (2 passos, uns 10 min). Precisa: celular e o cartão de teste.
1. Em http://localhost:3000/planos, clique em "Assinar Pro" e pague com 4242 4242 4242 4242.
   Deve aparecer: "Plano Pro ativo". Eu confiro o webhook e o banco.
2. No celular, abra o link que chegou por e-mail. Deve abrir a tela do aluno já logado.
Quando terminar, diga "testei" (ou conte o que deu errado).
```

- Cada passo diz onde, o que fazer e o que deve aparecer, e o comando vem rotulado com o lugar onde roda ("No seu Windows (PowerShell)").
- Se ele estiver longe do computador e o `docs/KIT.md` pedir aviso, mande a "sua vez" também pelo WhatsApp (skill `recado-whatsapp`, se instalada).
- Enquanto ele faz, acompanhe o que deixa rastro (log, banco, rede) e, se o teste for no PC dele, tire os prints você mesmo (computer-use).
- Quando ele disser "testei", **confira o rastro antes de marcar**. O que só ele vê (som, tela, sensação) vale pelo relato dele, anotado como "relato do Matheus".

## 4. Achados

Cada falha, dúvida ou dívida vira uma linha na tabela **Achados** do roteiro, com numeração contínua no projeto inteiro (A1, A2, A3…; nunca reaproveite um número):

`| A<n> | <passo> | <o quê, com o caminho do arquivo ou a tela> | <risco A/B/C> | <situação> |`

- **Risco:** A = dinheiro, login, dados, segurança ou contrato entre partes (só sai testado); B = interface, texto ou lógica sem contrato (pode ir ao ar e ser conferido lá, com hotfix); C = ferramenta, teste ou documentação, sem efeito para quem usa.
- **Situação:** "aberto", "corrigido no `<ramo>`, retestado em <data>", "decisão de <quem> em <data>", "fica para a <versão>".
- Com o "sim" dele, o achado vira issue (`/doyourshit:relatar`).

## 5. Corrigir e retestar

- Achado pequeno e com causa clara: corrija já, no ramo do bloco, sem perguntar. Grande ou que muda o produto: pergunte se corrige agora, adia ou leva ao dono.
- Depois de corrigir, rode de novo o passo que falhou **e** o T0. Só então troque `[!]` por `[x]`, com a data do reteste.

## 6. Fechar e mandar o boletim

O bloco fecha quando todos os passos estão `[x]` ou `[-]` e todo achado do bloco foi corrigido ou tem decisão.

1. **Placar:** a linha do bloco com `feito/total` e "Fechado em <data>".
2. **Progresso do MVP:** se um item de "Entra agora" do `docs/MVP.md` mudou de estágio, atualize a tabela "Medição", o total ponderado e a linha do topo, com a data e a evidência.
3. **Boletim**, sempre neste formato:

```
<bloco> · <tema>: FECHADO (<feito>/<total>) em <data hora>

Testado pelo Claude (<n>): <o quê> — <números>. Prints em evidencias/<bloco>/
Testado por você (<n>): <o quê> — <resultado>
Achados novos: A<n> (<risco>, <situação>), …  | nenhum
NÃO testado: <o quê e por quê>  | nada
Progresso do MVP: <antes>% → <depois>% (<item> passou de <x>% para <y>%)  | sem mudança
Preciso de você: nada  | 1. … 2. …
Próximo: <bloco> · <tema> (<n> passos, <n> seus)
```

4. Se o `docs/KIT.md` pedir aviso para o boletim, mande uma versão de 2 linhas pelo WhatsApp.
5. **Registro:** uma entrada pelo `/doyourshit:registro` com o boletim, e uma linha na tabela "Ritmo" do `docs/KIT.md` (passos, dias de trabalho, passos por dia), que a `/doyourshit:viabilidade` usa nas próximas estimativas.
6. **Próxima fase:** se este era o último bloco antes da ponta a ponta, diga que é hora de preparar o lançamento (`/doyourshit:guia`, fase 6: vendas, textos e vídeo).
7. **Envio:** se o bloco mudou código ou docs, pergunte se prepara o envio (modo "preparar envio" do `/doyourshit:registro`). Nada sobe sem o "sim" dele.

## "Como está?"

Mostre, em até 10 linhas: o placar (blocos fechados/total), o bloco aberto e onde parou, os achados abertos por risco, o progresso do MVP e o que espera por ele.
