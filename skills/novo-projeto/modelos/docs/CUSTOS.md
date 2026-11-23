# {{PROJETO}}: custos (regra de custo zero até a venda abrir)

> Criado em {{DATA}}. Enquanto o produto não estiver vendendo, o projeto gasta **R$ 0 por mês**.

## As regras

1. **Orçamento fixo: R$ 0/mês.** Nada que gere cobrança entra sem o "sim" do dono ({{DONO}}), no chat ou por escrito. Cada gasto aprovado vai para a tabela "Gastos aprovados", com data, valor e motivo.
2. **O teste roda no computador, não na nuvem.** Cada verificação tem um comando local (tabela "Onde roda cada teste"). O CI pago ou com cota curta é plano B.
3. **Antes de gastar, procure o caminho grátis.** Se não houver, escreva a proposta: o quê, quanto por mês, por que agora e o que acontece se esperar.
4. **Pagamento só em modo de teste** (sandbox) até o dono liberar a venda.
5. **Nada que peça cartão no nome do projeto:** conta, plano ou teste grátis que vire cobrança.
6. **O Claude e outros agentes seguem as mesmas regras:** não criam serviço pago, não trocam de plano, não cadastram cartão. Se a tarefa depender disso, param e perguntam.

## O que usamos e o limite grátis

| Serviço | Para quê | Plano | Limite grátis |
| --- | --- | --- | --- |
| <serviço> | <uso> | Grátis | <limite> |

## Gastos adiados (só com aprovação, quando o produto pedir)

| Gasto | Quanto | Quando faz sentido |
| --- | --- | --- |

## Gastos aprovados

| Data | Gasto | Valor | Quem aprovou | Por quê |
| --- | --- | --- | --- | --- |

## Onde roda cada teste

| Teste | Comando | Onde |
| --- | --- | --- |
| Lint, testes, build | ver `docs/KIT.md` › "Comandos de teste" | Máquina do Claude |
| Telas | `/doyourshit:testar-navegador` | Máquina do Claude ou o Chrome do Matheus |
| <aparelho que o Claude não alcança> | <script `check-*.sh` + relatório> | <onde> |

## Risco: o que precisa de validação antes de publicar

| Nível | O que é | Regra |
| --- | --- | --- |
| **A** | Dinheiro, login, dados e migrations, segurança, contrato entre partes, instalador | Só sai testado |
| **B** | Interface, textos, lógica sem mudar contrato | Pode ir ao ar e ser conferido lá, com hotfix se quebrar |
| **C** | Ferramenta, teste, documentação | Sem efeito para quem usa |

## Hotfix

Quebrou no ar: ramo `hotfix/<versão>` a partir do que está publicado, a menor correção possível, o T0 e o passo que falhou retestados, e publicação. Depois, a correção volta para o ramo principal.
