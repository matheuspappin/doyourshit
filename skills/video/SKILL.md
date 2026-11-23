---
name: video
description: Faz vídeos da marca do projeto (Reels, anúncio, institucional, demonstração) a partir de uma ideia e de um vídeo de referência, em Remotion com cenas de clima geradas no Higgsfield e telas reais do produto. Instala o molde no projeto na primeira vez e conduz briefing → referência e roteiro → animatic → gravações → gerações pagas → render → revisão, com aprovação em cada etapa. Use quando o Matheus disser "quero um vídeo", "faz um vídeo como este", "reels", "anúncio em vídeo", "anima isso", ou mandar um vídeo de referência.
---

# Vídeo da marca

Feito a partir da fábrica de vídeo do WavBox (Matheus, 2026-11-19) e já usado numa segunda marca (Bounce Basement). Tudo em português do Brasil. O molde está em `molde/`, nesta pasta da skill. Os agentes do plugin: `video-diretor`, `video-gerador`, `video-montador` e `video-revisor`.

**O que aprendemos:** vídeo curto (15 a 20 s) focado no público e na dor funciona; institucional longo e sem contexto não funciona. Comece sempre pelo público.

## Na primeira vez no projeto: preparar o molde

1. Copie `molde/` para `video/` na raiz do projeto (ou outra pasta que ele preferir) e rode `npm ci` lá dentro. Na primeira vez, o Remotion baixa o Chrome headless.
2. **Marca:** leia `docs/MARCA.md` (o agente `marca` escreve esse arquivo; sem ele, proponha rodar o agente antes ou pergunte cores, fontes e logo). Troque:
   - as cores e as fontes em `video/src/tema.ts`;
   - o `Logo` em `video/src/componentes/base.tsx`;
   - a seção "Regras da marca no vídeo" do `video/AGENTS.md`.
3. **Público:** preencha `video/PUBLICO.md` a partir do `docs/MVP.md` e do `docs/CONCORRENCIA.md`.
4. Rode `npm run typecheck` e `npm run render -- exemplo --rapido` para confirmar que o molde funciona com a marca nova.
5. Credenciais do Higgsfield só em `video/.env` (modelo no `.env.example`), nunca no chat. Se a chave aparecer na conversa, avise que ela precisa ser trocada.

## Etapas (pare em cada ✋ e espere o "sim")

1. **Briefing** (aqui, uma pergunta por vez, só o que faltar): objetivo, público (o padrão é o do `PUBLICO.md`), onde vai passar (Reels 9:16, YouTube 16:9, site), duração, chamada final, trilha (arquivo e licença).
2. **Referência e roteiro:** agente `video-diretor`, com o briefing e o caminho da referência (`video/projetos/<p>/referencia/ref.mp4`, que ele baixa; Instagram, TikTok e YouTube pedem login, então não tente abrir o link). Volta com a ficha de estilo, o `roteiro.json`, a lista de telas para gravar e o animatic.
   ✋ Mostre o animatic (`SendUserFile`, display render), a ficha em 5 linhas e o custo estimado (`npm run higgsfield -- estimar <p>`).
3. **Telas reais:** grave você mesmo o que der (o app no navegador, pelo Playwright ou pelo Chrome DevTools). O que só existe no PC dele vira passo VOCÊ, com a lista de telas, a ação e a duração. Sem gravação, a cena fica como cartão e o vídeo ainda renderiza.
4. **Gerações pagas:** só com o "sim" para o valor (e o do dono, se o saldo for do projeto).
   ✋ "Gerar N cenas no Higgsfield por ~US$ X?" Com o "sim", chame o `video-gerador` com o valor autorizado e os ids: primeiro os quadros-chave, ✋ mostre, depois as animações.
5. **Montagem:** agente `video-montador` para o render final, os outros formatos e os ajustes de animação.
6. **Revisão:** agente `video-revisor` sobre o mp4 final. Corrija o que ele achou (texto e ritmo com o diretor, visual com o montador, mídia com o gerador) e revise de novo até zerar. Os textos das cartelas passam também pela `/doyourshit:textos`.
   ✋ Entregue o mp4 (`SendUserFile`), os números (duração, cortes por segundo, % na batida, gasto em US$) e o que não foi checado.

## Regras

- Nada de `higgsfield gerar` sem o "sim" para o valor; o limite vai em `--limite-usd`.
- Direitos: não reutilize música, imagem ou pessoas da referência. Trilha só com licença clara, anotada no roteiro.
- Tela do produto sempre real: interface inventada por IA não entra.
- Git: mídia pesada fica fora (`video/.gitignore`); `roteiro.json`, `ficha-estilo.md`, `referencia/analise.json` e `gastos.json` entram. Commit só com o "sim" dele.
- Registre cada vídeo entregue (`/doyourshit:registro`), com o gasto.
