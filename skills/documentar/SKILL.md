---
name: documentar
description: Escreve ou atualiza o README e a documentação de um projeto a partir do estado real (docs/MVP.md, roteiro, docs/KIT.md, código, comandos que de fato rodam), na voz do projeto, para quem chega sem contexto — o que é, para quem, como instalar, como usar, o que esperar, requisitos, custos, limites e créditos. Confere cada comando e link antes de entregar. Use quando o Matheus disser "escreve o README", "documenta isso", "o README está fraco", "atualiza a documentação", ao publicar um repositório, ao fechar uma versão ou antes do lançamento.
---

# Documentar: README e docs que se explicam sozinhos

Responda em português do Brasil. A voz vem do `docs/VOZ.md` (se existir) e o texto final passa pela `/doyourshit:textos`. Só escreve o que é verdade **hoje**: cada afirmação sai de um arquivo, de um comando que rodou ou de uma decisão registrada.

## 1. Para quem e para quê

Antes de escrever, responda (pergunte só o que não der para descobrir):

- **Quem lê:** alguém que nunca ouviu falar do projeto? Alguém da equipe? Um cliente? Um investidor? Cada um pede um README diferente; o padrão é a pessoa que acabou de abrir o repositório.
- **O que ela precisa fazer depois de ler:** instalar, usar, contribuir, decidir.
- **Público ou privado:** o que não pode aparecer (caminhos da máquina, nomes de clientes, e-mails, segredos, decisões internas).

## 2. Juntar os fatos

Leia: `docs/MVP.md`, `docs/testes/ROTEIRO.md` (placar), `docs/KIT.md` (comandos e ambiente), `CHANGELOG.md`, os manifestos (`package.json`, `plugin.json`…), a estrutura de pastas e o README atual. Anote o que mudou desde a última versão do README.

## 3. A estrutura

Use as seções que o projeto pede, nesta ordem, e corte o que não se aplica:

1. **Título e uma frase:** o que é e para quem, sem jargão e sem nome interno.
2. **Por que existe:** o problema, em 2 ou 3 linhas.
3. **O que você ganha:** de 3 a 6 pontos concretos, cada um com uma prova (número, exemplo, print).
4. **Como é na prática:** um exemplo real do resultado (uma tela, uma saída, um relatório), não uma descrição dele.
5. **Requisitos:** o que precisa estar instalado ou logado, e o que é opcional.
6. **Instalar:** comandos copiáveis, um por bloco, na ordem.
7. **Começar a usar:** o primeiro uso em 3 passos, e o que deve aparecer.
8. **Referência:** comandos, configurações ou rotas, em tabela.
9. **Custos e limites:** o que pode gerar cobrança, o que precisa de autorização, o que não faz.
10. **Como funciona por dentro**, se ajudar quem vai mexer: um mapa das pastas.
11. **Atualizar e contribuir:** como pegar a versão nova, como propor mudança, versões.
12. **Créditos e licença:** de onde veio cada parte e de quem é.

## 4. Conferir antes de entregar

- **Comandos:** rode cada comando seguro (instalar em pasta de teste, `--help`, validação). O que não der para rodar, marque como não conferido.
- **Links e caminhos:** todo arquivo citado existe; todo link abre (`gh` para repositório privado).
- **Fatos:** nenhum número sem fonte, nenhum recurso que ainda não existe (o que está no roteiro sem `[x]` não é recurso).
- **Privacidade:** nada de segredo, e-mail, caminho da máquina (em repositório público) ou dado de cliente.
- **Leitura de quem chega:** leia como alguém de fora. Cada termo próprio do método (bloco, achado, "sua vez") é explicado na primeira vez que aparece.
- **Textos:** passe pela `/doyourshit:textos` (modo 2).

## 5. Entregar

Mostre o diff do README (ou o arquivo novo) e a lista do que foi conferido e do que não foi. Commit e push só com o "sim" do Matheus. Registre (`/doyourshit:registro`).

## Outros documentos

A mesma régua vale para: página de ajuda e manual do usuário (o roteiro do usuário, não o do código), `CHANGELOG.md` (o que mudou para quem usa, com data e hora), guia de contribuição e notas de versão. Para um manual em PDF, use a skill de PDF disponível.
