---
name: novidades
description: Conta o que mudou no projeto desde a última vez — commits, docs, roteiro (blocos e achados), progresso do MVP, issues e PRs — em linguagem simples, e diz o que precisa ser retestado. Use quando o Matheus (ou alguém da equipe) disser "me atualiza", "o que mudou", "novidades", "voltei", ou ao começar o dia.
---

# Novidades: o que mudou desde a última vez

Adaptado do `/novidades` da equipe do WavBox (Figuerah). Responda em português do Brasil, em linguagem simples. É só leitura: **não mude código, não troque de ramo, não faça push**.

1. **Ponto de partida:** o hash em `<pasta do registro>/ultimo-visto` (pasta do registro no `docs/KIT.md`). Sem ele, os últimos 14 dias, e avise.
2. **O que há de novo** (só leitura): `git fetch origin`; `git log --oneline --no-merges <ultimo-visto>..origin/<principal>` e os merges do mesmo intervalo.
3. **Agrupe por assunto**, não por commit: 1 a 3 linhas por área ("o que mudou e por que importa para você").
4. **Roteiro e MVP:** o que mudou no placar, os achados novos ou resolvidos, e o progresso antes e depois (`git diff <ultimo-visto>..origin/<principal> -- docs/testes/ROTEIRO.md docs/MVP.md`).
5. **Regras:** destaque primeiro qualquer mudança em `AGENTS.md`, `docs/CUSTOS.md` ou `docs/KIT.md`.
6. **Trabalho aberto:** `gh issue list -R <repo> --state open --limit 30` e `gh pr list -R <repo> --state open`. Sem `gh` logado, diga e siga só com o git.
7. **O que retestar:** pelos arquivos que mudaram, quais passos do roteiro valem de novo. E o que **não** deu para saber.
8. **Feche em 5 linhas:** a coisa mais importante, o que fazer hoje, o que mudou de regra, o que espera por ele, o que não se sabe.
9. **Atualizar a pasta:** só se ela estiver limpa e no ramo principal, `git merge --ff-only origin/<principal>`. Senão, não mexa e ofereça um worktree (`/doyourshit:comecar`).
10. Depois que ele confirmar, grave `git rev-parse --short origin/<principal>` em `<pasta do registro>/ultimo-visto`.
