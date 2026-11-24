---
name: novo-projeto
description: Monta a base do método doyourshit num projeto novo (pasta vazia) ou herdado (código que já existe) — docs/KIT.md, AGENTS.md, CLAUDE.md, docs/MVP.md, docs/testes/ROTEIRO.md, docs/CUSTOS.md, CHANGELOG.md, templates de issue e PR, a pasta do registro e a base do que foi recebido. Use quando o Matheus disser "projeto novo", "monta a base", "peguei esse projeto", "aplica o método aqui", ou quando o /doyourshit:guia mandar.
---

# Novo projeto: a base

Responda em português do Brasil. Os modelos estão em `modelos/`, nesta pasta da skill. Nada é commitado: os arquivos ficam no disco até o "sim" do Matheus.

## 1. Perguntar (uma por vez, com o palpite já preenchido)

Descubra sozinho o que der (`git remote -v`, `git branch --show-current`, `package.json`, `README`, scripts de teste, `.env.example`) e pergunte só o que faltar, uma pergunta por vez, sempre com o seu palpite:

1. Nome do projeto e uma frase sobre ele.
2. Novo ou herdado? Quem é o dono? (Se não for o Matheus: o MVP e o roteiro viram proposta, e ele nunca faz merge no ramo principal.)
3. Repositório no GitHub (ou nenhum ainda).
4. Comandos de instalar, lint, teste e build (sugira os que achou).
5. Onde o app roda localmente e em produção.
6. Avisos: boletim pelo WhatsApp sempre, só na "sua vez" e em bloqueio, ou nunca?

## 2. Criar os arquivos

1. Copie os modelos para a raiz do projeto, **sem sobrescrever nada**: se o arquivo já existir (um `AGENTS.md`, um `CLAUDE.md`, um template de PR), mostre a diferença e proponha juntar.
2. Troque os `{{CAMPOS}}` pelas respostas. Data: `TZ=America/Sao_Paulo date +%Y-%m-%d`. O que ficar sem resposta vira `<a definir>`.
3. No `CLAUDE.md`: se já existir, só acrescente a linha `@AGENTS.md` e a seção "Específico do Claude Code".
4. `docs/KIT.md`: preencha tudo. A linha "Pasta do registro" é lida pelo `comparar.sh`, então mantenha o formato `| Pasta do registro | \`<caminho>\` |`.

## 3. Registro e base

1. Crie a pasta do registro **fora do repositório**, ao lado dele: `<pasta do projeto>-registro/`, com `BASE.md`, `REGISTRO.md` (dos modelos) e `evidencias/`.
2. Projeto com git: `git update-ref refs/registro/base/<ramo> HEAD` e uma linha no `BASE.md` ("recebido" para herdado, "primeiro commit" para novo). Sem git: proponha `git init` (local, sem commit) e marque a base depois do primeiro commit autorizado.
3. Primeira entrada no `REGISTRO.md`, no formato do `/doyourshit:registro`.

## 4. Herdado: o T0 já na hora

Projeto que já existe: rode os comandos de teste (é o T0) e anote o resultado com números no roteiro. Cada problema vira um achado (A1, A2…). Isso mostra em minutos o estado real do que foi recebido. Em seguida, o diagnóstico de segurança: `/owasp-security-audit:security-audit`, só leitura, com os achados entrando como A<n> de risco A.

## 5. Fechar

Mostre a lista do que foi criado e o resultado do T0, se houver, e diga o próximo passo (o `/doyourshit:guia`, fase 2: o MVP). Pergunte se pode commitar a base; só com o "sim" dele: `git add` dos arquivos criados (nunca `.env`) e um commit "Base do projeto (método doyourshit)".
