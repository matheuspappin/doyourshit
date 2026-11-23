# {{PROJETO}}: configuração do doyourshit

> O que muda de um projeto para outro. As skills do `doyourshit` leem daqui; mantenha atualizado. Criado em {{DATA}}.

## Projeto

| Campo | Valor |
| --- | --- |
| Projeto | {{PROJETO}} |
| Uma frase | {{FRASE}} |
| Pasta principal | `{{PASTA}}` (sempre no ramo principal; trabalho em worktree) |
| Ramo principal | `{{RAMO_PRINCIPAL}}` |
| Repositório GitHub | `{{REPO_GITHUB}}` (ou "nenhum ainda") |
| Prefixo dos worktrees | `{{PREFIXO}}-` (ex.: `../{{PREFIXO}}-<tema>`) |
| Pasta do registro | `{{PASTA_REGISTRO}}` |
| Dono | {{DONO}} |
| O Matheus é o dono? | {{E_DONO}} |
| Áreas (para issues) | {{AREAS}} |
| Idioma | Português do Brasil |
| Fuso | America/Sao_Paulo |

## Quem faz o quê e o que pede "sim"

- O Claude faz sozinho tudo o que consegue (comandos, testes, telas no navegador, código, docs, registro).
- Pede "sim" do Matheus, naquele momento, para: commit, push, PR, issue, comentário; escrever em produção ou conta real; correção grande ou de produto; qualquer gasto (gasto também pede o "sim" do dono).
- {{REGRA_DONO}}

## Onde roda cada coisa

| O quê | Onde |
| --- | --- |
| Sessão do Claude | {{ONDE_CLAUDE}} |
| Computador do Matheus | {{ONDE_MATHEUS}} (comandos para ele vão rotulados com o lugar) |
| Aparelhos que o Claude não alcança | {{APARELHOS}} |

## Comandos de teste (T0)

| Comando | Para quê |
| --- | --- |
| `{{CMD_INSTALAR}}` | Instalar dependências |
| `{{CMD_LINT}}` | Lint |
| `{{CMD_TESTE}}` | Testes |
| `{{CMD_BUILD}}` | Build |

## Ambiente de teste

| Peça | Endereço | Quem cuida |
| --- | --- | --- |
| App local | `{{URL_LOCAL}}` | CLAUDE |
| Produção | `{{URL_PRODUCAO}}` (só leitura e conta `[TESTE]`) | — |

## Ritmo (medido ao fechar cada bloco)

| Data | Bloco | Passos | Dias de trabalho | Passos por dia |
| --- | --- | --- | --- | --- |

## Avisos

| Quando | Como |
| --- | --- |
| Boletim de bloco | {{AVISO_BOLETIM}} |
| "Sua vez" e bloqueio, se ele estiver longe | {{AVISO_SUA_VEZ}} |
