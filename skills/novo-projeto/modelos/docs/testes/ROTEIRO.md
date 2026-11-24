# Teste do {{PROJETO}}: o roteiro único

> **Estado:** criado em {{DATA}} pelo Matheus com o Claude, no método doyourshit. Produto e progresso: [docs/MVP.md](../MVP.md).

## Como usar

- Cada passo diz **quem faz**: **CLAUDE** (roda comando, lê log e banco, testa telas no navegador, tira print, escreve código e testes) ou **VOCÊ** (senha e 2FA, cartão de teste, outra pessoa, outro aparelho, decisões). Antes de escrever um passo VOCÊ, tente fazer dele um passo CLAUDE.
- O Claude roda os passos dele sozinho e entrega os seus todos juntos ("sua vez"). Ao fechar o bloco, você recebe o boletim.
- Resultado: `[x] AAAA-MM-DD · números` quando passou; `[!] AAAA-MM-DD · o que falhou (A<n>)` quando falhou; `[-] motivo` quando não se aplica.
- Cada falha vira uma linha em **Achados** (A1, A2…) e uma entrada no registro local; com o seu "sim", uma issue.
- **Produção é real:** no ar, só leitura e uma conta marcada `[TESTE]`. Dinheiro só em modo de teste.
- A ordem importa: as etapas vão de cima para baixo, e um bloco só começa com o anterior fechado.

## Placar

| Bloco | Tema | Feito | Situação |
| --- | --- | --- | --- |
| T0 | Base automática | 0/4 | — |
| T1 | <área> | 0/<n> | — |
| TS | Segurança (auditar, corrigir, verificar, portão) | 0/3 | — |
| T<n> | Ponta a ponta com uma pessoa de verdade | 0/<n> | — |

## O caminho até o MVP

| Etapa | Objetivo | Blocos | Sai quando |
| --- | --- | --- | --- |
| **1. Validar o que existe** | Saber o que funciona de verdade | T0–T<n> | Lista dos achados que bloqueiam o MVP, cada um com dono e prazo |
| **2. Dinheiro** | Cobrança funcionando em modo de teste | T<n> | Pagar, cancelar e falhar o cartão mudam o plano sozinhos |
| **3. Fechar as lacunas** | O que falta do "Entra agora" | T<n> | Nada bloqueante aberto |
| **3b. Segurança** | Nada grave aberto antes de alguém de fora usar | TS | Portão da ATeam liberado |
| **4. Ponta a ponta** | O ciclo inteiro com uma pessoa de verdade | T<n> | Ela fez tudo sozinha (e pagou) |

## Ambiente de teste

| Peça | Onde | Quem cuida |
| --- | --- | --- |
| App local | `{{URL_LOCAL}}` | CLAUDE sobe, reinicia, lê log e banco |
| Produção | `{{URL_PRODUCAO}}` | Só leitura |

**Contas que o teste usa:**

| Conta | Papel | Precisa |
| --- | --- | --- |
| **A** | Você, dono/admin | <e-mail de teste> |
| **B** | <papel> | <outro e-mail> |
| Pagamento | Modo de teste | Chaves de teste no `.env` |

## Etapa 1: validar o que existe

### T0. Base automática

| ID | Quem | Faz | Esperado | Resultado |
| --- | --- | --- | --- | --- |
| T0.1 | CLAUDE | `{{CMD_INSTALAR}}` | Instala sem erro | [ ] |
| T0.2 | CLAUDE | `{{CMD_LINT}}` | 0 erros | [ ] |
| T0.3 | CLAUDE | `{{CMD_TESTE}}` | Tudo verde | [ ] |
| T0.4 | CLAUDE | `{{CMD_BUILD}}` | Build ok | [ ] |

### T1. <área>

| ID | Quem | Faz | Esperado | Resultado |
| --- | --- | --- | --- | --- |
| T1.1 | CLAUDE | <no navegador: abrir, clicar, preencher> | <o que deve aparecer, no banco, na rede> | [ ] |
| T1.2 | VOCÊ | <o que só você faz> | <esperado> | [ ] |

### TS. Segurança

| ID | Quem | Faz | Esperado | Resultado |
| --- | --- | --- | --- | --- |
| TS.1 | CLAUDE | `/ateam-security-audit:security-audit`: segredos, código, dependências, infraestrutura e CI, controle de acesso e lógica de negócio | Registro de achados criado; cada um vira A<n> | [ ] |
| TS.2 | CLAUDE | `/ateam-security-audit:security-fix` nos achados críticos e altos | Correções feitas e testadas (T0 verde) | [ ] |
| TS.3 | CLAUDE | `/ateam-security-audit:security-verify` | Portão liberado, ou pendências decididas pelo dono | [ ] |

## Achados

| # | Passo | O quê | Risco | Situação |
| --- | --- | --- | --- | --- |

Risco: **A** = dinheiro, login, dados, segurança ou contrato (só sai testado); **B** = interface, texto, lógica sem contrato (vai ao ar e é conferido lá); **C** = ferramenta, teste ou documentação.
