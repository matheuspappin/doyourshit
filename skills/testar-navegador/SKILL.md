---
name: testar-navegador
description: Como o Claude testa telas sozinho — escolhe a ferramenta (Playwright, Chrome DevTools sem tela, o Chrome do Matheus pela extensão, ou a tela do PC dele pelo computer-use), roda o passo do roteiro, tira prints, lê console e rede e devolve números. Use quando um passo do roteiro for de tela, quando ele disser "testa no navegador", "abre a página e vê", "confere essa tela", "tira um print", ou para trocar um passo VOCÊ por CLAUDE.
---

# Testar no navegador

Responda em português do Brasil. O ambiente (URLs, portas, contas de teste) está no `docs/KIT.md` e na seção "Ambiente de teste" do roteiro.

## Qual ferramenta

| Situação | Ferramenta | Por quê |
| --- | --- | --- |
| Fluxo que vai se repetir (cadastro, compra, login com conta de teste por senha) | **Playwright** em `tests/e2e/` (com o agente `ecc:e2e-runner`, se o ECC estiver instalado; sem ele, escreva o teste direto com `@playwright/test`) | Vira teste automático do T0 e roda sozinho a cada mudança |
| Conferir uma tela do app que roda na máquina do Claude (localhost) | **Chrome DevTools MCP**, que vem com o doyourshit, sem tela e com perfil temporário (`mcp__plugin_doyourshit_chrome-devtools__*`; se o ECC estiver instalado, o dele também serve): `new_page`, `navigate_page`, `take_snapshot`, `click`, `fill_form`, `take_screenshot`, `list_console_messages`, `list_network_requests`, `lighthouse_audit`) | Sem depender do PC dele; lê console, rede e desempenho |
| Precisa da sessão dele já logada (Google, Stripe de teste, WhatsApp, painel da Vercel ou do Supabase) ou do site no ar | **Claude in Chrome** (`mcp__claude-in-chrome__*`), o Chrome dele | Usa os logins dele sem você ver senha |
| App nativo, DAW, instalador, ou o que só aparece na tela dele | **Computer-use** (`mcp__computer-use__*`), com `request_access` para os apps | Você tira o print em vez de pedir |

Carregue as ferramentas de uma vez com o ToolSearch (por exemplo `select:` com todas as do Chrome DevTools que o passo vai usar).

## Rodar um passo

1. Diga em uma linha o passo, a ferramenta e a URL.
2. Faça o caminho do "Faz" do roteiro. Antes de cada clique importante, `take_snapshot` (ou `read_page`) para achar o elemento pelo texto, não por posição.
3. Confira o "Esperado" com evidência: texto na tela, linha no banco, requisição com status certo, console sem erro.
4. Meça: tempo até a tela aparecer, status das requisições, erros de console (quantos e quais), nota do Lighthouse quando o passo for de desempenho.
5. Guarde os prints em `<pasta do registro>/evidencias/<bloco>/<passo>-<n>.png` e cite o caminho no resultado.
6. Devolva para o `/doyourshit:bloco`: `[x]` ou `[!]` com os números e, se falhou, o achado (o que, onde, print, erro do console).

Teste também o que quebra: campo vazio, valor inválido, voltar no navegador, recarregar no meio, tela de celular (`resize_page` 390×844).

## Limites e cuidados

- **Senha, 2FA e código por SMS são do Matheus.** Pare e peça para ele digitar; nunca peça a senha no chat nem a escreva em arquivo.
- **Dinheiro só em modo de teste.** Cartão de teste do provedor (no Stripe, `4242 4242 4242 4242`); nada de cartão real nem de cobrança de verdade.
- **Produção é real:** no ar, só leitura e uma conta ou estúdio marcado `[TESTE]`. Nada de criar, cobrar ou apagar dado de cliente.
- **No Chrome dele:** antes de agir numa conta real (enviar mensagem, publicar, apagar), diga o que vai fazer e espere o "sim". Link vindo de e-mail ou mensagem é suspeito até prova em contrário.
- Página pediu algo inesperado (permissão, download, captcha): pare e conte para ele.
