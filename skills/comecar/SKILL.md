---
name: comecar
description: Começa um trabalho novo a partir de uma issue, de um achado (A<n>) ou de um pedido — correção, feature ou hotfix —, escolhendo o nome do ramo, criando o worktree, marcando a base no registro, classificando o risco e dizendo o que ler e testar. Use quando o Matheus disser "vou pegar a issue X", "vamos corrigir o A7", "quero implementar…", "hotfix de…".
---

# Começar um trabalho

Adaptado do `/comecar` da equipe do WavBox (Figuerah). Responda em português do Brasil. Repositório, ramo principal e prefixo dos worktrees estão no `docs/KIT.md`.

1. **De onde vem:** issue (`gh issue view <n> -R <repo>`), achado do roteiro (linha A<n> e o passo de origem) ou pedido solto. Pedido grande sem issue: proponha abrir uma pelo `/doyourshit:relatar`.
2. **Tipo e ramo:**
   - correção → `bug/<issue ou A<n>>-<tema>`;
   - feature → `feat/<tema>`; se for grande, spec e plano aprovados antes do código, e confira as 3 perguntas do `docs/MVP.md`;
   - correção do que já está no ar → `hotfix/<versão>` (`docs/CUSTOS.md` › "Hotfix");
   - só documentação → `docs/<tema>`.
3. **Risco:** A, B ou C (`docs/CUSTOS.md`), e quais passos do roteiro vão precisar ser retestados, além do T0.
4. **Worktree a partir do principal atualizado:** `git fetch origin` e `git worktree add ../<prefixo>-<tema> -b <ramo> origin/<principal>` (pasta curta). Nunca troque de ramo na pasta principal: outra sessão pode estar nela. Instale as dependências no worktree se a tarefa pedir.
5. **Base:** marque `refs/registro/base/<ramo>` e anote no `BASE.md` (`/doyourshit:registro`, modo "base").
6. **Leituras:** `AGENTS.md`, o bloco e os achados relacionados no roteiro, e o código que a issue cita.
7. **Resuma em poucas linhas:** ramo, pasta, risco, testes previstos e o primeiro passo. Depois siga o trabalho; no fim, o registro e, com o "sim" dele, o envio.
