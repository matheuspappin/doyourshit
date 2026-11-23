---
name: registro
description: Registro local de tudo que o Matheus muda e testa num projeto, comparado com o que foi recebido (a base), e o preparo dos commits e PRs para o GitHub. Use quando ele disser "registra", "anota o que fiz", "o que mudei", "compara com o que recebi", "prepara o envio", "vamos subir para o GitHub", ao terminar qualquer mudança no repositório, ao fechar um bloco ou ao começar num ramo novo.
---

# Registro: recebido × feito × testado

O Matheus mantém o trabalho **local** e só sobe para o GitHub com a autorização dele. Esta skill guarda, fora do git, um diário de cada mudança e teste e uma **base** do que foi recebido. Na hora do envio, isso vira commits, PRs e os docs do projeto. Responda em português do Brasil.

## Onde fica cada coisa

| O quê | Onde |
| --- | --- |
| Configuração | `docs/KIT.md` do projeto (pasta do registro, repositório, dono) |
| Diário | `<pasta do registro>/REGISTRO.md` (fora do git) |
| O que foi recebido | `<pasta do registro>/BASE.md` + refs locais `refs/registro/base/<ramo>` (o `git push` comum não as envia) |
| Última comparação | `<pasta do registro>/COMPARACAO.md` |
| Evidências dos testes | `<pasta do registro>/evidencias/<bloco>/` |
| Script | `comparar.sh`, nesta pasta da skill (só lê: sem fetch, commit nem push) |

Sem `docs/KIT.md`: proponha o `/doyourshit:novo-projeto` primeiro.

## Modos

Escolha pelo pedido. Sem pedido claro, depois de qualquer mudança no repositório, rode **registrar**.

### 1. base: marcar o que foi recebido

Ramo sem base (`git for-each-ref refs/registro/base/`):

1. `git fetch origin <ramo>` (só leitura) e anote o SHA do `origin/<ramo>`. Ramo novo criado a partir do principal: a base é a do principal.
2. `git update-ref refs/registro/base/<ramo> <sha>`.
3. Uma linha no `BASE.md` (ramo, SHA, data e hora, de onde veio, observação).

Nunca mova uma base sem ele pedir. Novidade recebida do dono vira linha nova, sem apagar a antiga.

### 2. registrar: anotar uma mudança, um teste ou uma decisão

No fim do `REGISTRO.md`:

```markdown
### AAAA-MM-DDTHH:MM:SS-03:00 · <ramo> · <título curto>

- **Onde:** <worktree> · estado: não commitado | commit local `<sha>` | enviado (PR #n)
- **O que mudou:** <o quê, com os caminhos dos arquivos>
- **Por quê:** <motivo; decisão de quem e quando>
- **Risco:** A | B | C
- **Testes:** <comandos, passos do roteiro (T<n>.<m>) e números medidos>
- **Achados:** <A<n> novos ou resolvidos>
- **Não testado:** <o que ficou de fora e por quê>
- **Para o envio:** <docs a atualizar, aprovação que falta>
```

- Hora: `TZ=America/Sao_Paulo date +%Y-%m-%dT%H:%M:%S%:z`.
- Cite os **caminhos dos arquivos**: o `comparar.sh` usa os nomes para achar o que ficou sem registro.
- Boletim de bloco fechado entra inteiro.
- Nada de segredo, `.env`, token ou senha.

### 3. comparar: o que eu fiz × o que recebi

1. `bash <pasta desta skill>/comparar.sh > <pasta do registro>/COMPARACAO.md` (rode da raiz do projeto) e leia.
2. Resuma por ramo: commits desde a base, o que está só local, o que falta commitar, arquivos sem registro.
3. Para cada arquivo sem registro: descubra o que mudou e proponha a entrada, ou diga que é arquivo gerado.

### 4. preparar envio: commits e PRs

Só quando ele pedir. Nada sai do computador sem o "sim" dele **naquele momento**.

1. Rode o **comparar** e confira que tudo o que vai subir está no registro.
2. Monte o plano de envio a partir do registro: um PR por assunto; commits pequenos, em português, com o porquê; corpo no template de PR, com o risco, os números, os blocos e achados e o que **não** foi testado; e os docs que vão junto (`CHANGELOG.md` com data e hora, `docs/testes/ROTEIRO.md`, `docs/MVP.md`).
3. Confira antes: nenhum `.env`, segredo ou dado pessoal no diff; testes do escopo passando, com a contagem; o ramo do GitHub não andou desde a base (se andou, mescle e teste de novo).
4. Mostre o plano e peça autorização numa pergunta. Com o "sim": commit, `git push -u origin <ramo>` e `gh pr create`. Nunca `push --force`. Quem não é o dono nunca faz merge no ramo principal.
5. Depois: estado "enviado (PR #n)" no registro e uma nota no `BASE.md`.

## Regras

- Commit, push, PR, issue e comentário só com a autorização dele, que vale para aquele pedido e não para o próximo.
- O registro é dele e fica local.
- Se o registro e o repositório discordarem, vale o repositório: corrija o registro e diga o que estava diferente.
