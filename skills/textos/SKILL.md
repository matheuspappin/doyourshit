---
name: textos
description: Cuida dos textos do projeto para não nascerem ridículos nem soarem como sistema — define a voz no começo (docs/VOZ.md com tom, glossário e proibidos) e revisa telas, mensagens de erro, e-mails, site, anúncios e cartelas de vídeo com um tom humano e objetivo, no método do modo clarify da skill impeccable. Use quando o Matheus disser "revisa os textos", "o texto está estranho", "falta um tom mais humano", "define a voz", "escreve o texto da tela", ou antes de publicar qualquer tela, página ou campanha.
---

# Textos: voz humana e objetiva

Feito a partir da revisão dos textos do WavBox (2026-11), que usou o modo **clarify** da skill impeccable (pbakaus/impeccable). Responda em português do Brasil.

**O diagnóstico que mais se repete:** a boa voz costuma existir em algum lugar (num tour, num post, no jeito do dono falar), mas as telas soam como sistema. O trabalho é levar a voz boa para o resto.

## Modo 1: definir a voz (no começo do projeto)

Escreva `docs/VOZ.md`, curto, a partir do `docs/MVP.md` (para quem), do `docs/MARCA.md` (se houver) e de 3 exemplos de texto que o Matheus ache bons:

- **Com quem falamos** e como essa pessoa fala (as palavras dela, não as nossas).
- **O tom:** 3 adjetivos, cada um com um "mas não" (por exemplo, "direto, mas não seco").
- **Glossário:** um termo por conceito (por exemplo, **comentário**, nunca feedback/retorno/comentário alternando), e qual termo vale para cada público.
- **Proibidos:** jargão técnico para quem não é técnico ("servidor", "MiB", "revogar", "área de transferência"), "Não foi possível…", "Informe…", "Ocorreu um erro", "Clique aqui".
- **Padrões:** "tente de novo" (não "tente novamente"), "e-mail", reticências `…`, "Ex.:", nome de coisa sem aspas.
- **3 pares antes/depois** que mostram a voz.

## Modo 2: revisar

1. **Junte os textos** do escopo: telas (extraia as strings do código, inclusive mensagens de erro, estados vazios e de carregamento), e-mails, site, anúncios, cartelas de vídeo. Diga quantos arquivos e quantos textos leu.
2. **Se a skill impeccable estiver instalada** (`.agents/skills/impeccable/` ou nas skills do Claude), leia o `reference/clarify.md` dela e siga também. Sem ela, siga só esta skill. Para instalar: `npx skills add pbakaus/impeccable`.
3. **Procure, nesta ordem:**
   1. Mensagem que não diz o que aconteceu, por quê (quando ajuda) e o que fazer agora.
   2. Jargão de programador na tela de quem não é programador.
   3. Tom de formulário ou de sistema ("Informe…", "Não foi possível…", "Ocorreu um erro").
   4. Inconsistência: dois termos para a mesma coisa, "tente novamente" × "tente de novo", "..." × "…", "email" × "e-mail".
   5. Parágrafo longo onde a pessoa precisa decidir rápido: a frase que importa primeiro, uma ideia por linha.
   6. Texto interno que vazou para a tela ("Resumo do catálogo", "Situação", abreviação cortada).
   7. Aspas em nomes, botão genérico ("OK", "Sim", "Enviar") em ação destrutiva, promessa que o sistema não cumpre.
4. **Entregue uma tabela por tela:** `Hoje | Proposta | Por quê (padrão n)`, começando pela tela mais importante (a que o cliente vê). Antes da tabela, o diagnóstico em uma frase e os padrões que mais pesam, com a contagem.
5. **Não mude sem o "sim":** fato, termo jurídico, preço e termo técnico que o público conhece (pergunte antes). Com o "sim", aplique, rode o T0 e confira as telas no navegador (`/doyourshit:testar-navegador`), inclusive no celular, porque texto maior quebra layout.
6. Registre (`/doyourshit:registro`) e, se a revisão criou regra nova, acrescente no `docs/VOZ.md`.

## Antes de publicar qualquer coisa

Teste rápido de cada texto: quem lê só aquilo entende? Diz o que fazer em seguida? Dá para cortar uma palavra sem perder sentido? Está no glossário?
