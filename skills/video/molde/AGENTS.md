# Vídeo da marca (guia para agentes)

Fábrica de vídeos institucionais e de redes da marca do projeto: **um vídeo de referência vira regra, a regra vira roteiro, o roteiro vira vídeo**. O molde é em Remotion (React), as cenas de clima são geradas no Higgsfield e as telas do produto são sempre reais.

Não é produto: não toca o código do app nem muda contrato. Leia também o `docs/MARCA.md` (ou o `DESIGN.md`) do projeto: o vídeo segue a marca.

## Comandos (rode em `video/`)

| Comando | O que faz | Custa? |
| --- | --- | --- |
| `npm ci` | instala (Remotion 4.0.545; baixa o Chrome headless na 1ª vez) | não |
| `npm run analisar -- <ref.mp4> projetos/<p>/referencia` | cortes, ritmo, BPM, cortes na batida, movimento e brilho por plano; quadros de cada plano | não |
| `npm run conferir -- <p>` | confere o roteiro.json: formato, ids, aspas, durações, arquivos que faltam | não |
| `npm run render -- <p>` | renderiza `projetos/<p>/saida/<p>-1080x1920.mp4`; mídia que falta vira cartão de animatic | não |
| `npm run render -- <p> --formato 16:9` | outra proporção sem mexer no roteiro (9:16, 16:9, 1:1, 4:5) | não |
| `npm run render -- <p> --stills 1,4.5,9` | PNGs nos segundos pedidos, para revisar sem renderizar tudo | não |
| `npm run render -- <p> --rapido` | metade da resolução, para conferir rápido | não |
| `npm run studio -- <p>` | Remotion Studio na porta 3000 (na VPS: `ssh -L 3000:localhost:3000`) | não |
| `npm run higgsfield -- estimar <p>` | preço em US$ de cada geração pendente (`POST /estimate`) | não |
| `npm run higgsfield -- gerar <p> --confirmar [--limite-usd 5] [--so g-c02]` | gera, baixa em `assets/` e anota em `gastos.json` | **sim** |
| `npm run typecheck` | confere os tipos do molde | não |

Medidas na VPS (6 núcleos, 3 abas do Chrome): 6 stills em ~100 s (cada still empacota de novo; prefira `--rapido` para conferir o vídeo todo).

## Custo (docs/CUSTOS.md)

- O Higgsfield cobra em dólar do saldo da conta a cada geração. **Nada de `gerar` sem antes `estimar`, mostrar a tabela e ter o sim de quem paga**, e o sim do dono do projeto quando o saldo for do projeto. Quem não é o dono pergunta antes.
- O `gerar` recusa sem `--confirmar` e para se o total passar de `--limite-usd` (padrão US$ 5).
- Aprove o **animatic** (render sem as mídias geradas, custo zero) antes de gerar qualquer coisa. Gere primeiro o quadro-chave (imagem, barata), aprove, depois anime (vídeo, cara).
- Falha e nsfw não são cobrados; o que foi gerado fica em `gastos.json` (entra no git, é a prestação de contas).
- Credenciais só em `video/.env` (`HF_API_KEY_ID`, `HF_API_KEY_SECRET`); modelo em `.env.example`. Nunca no chat, nunca no git.

## Projeto

```
video/projetos/<nome>/
  referencia/        ref.mp4 (fora do git), analise.json, resumo.md, quadros/ (fora do git)
  ficha-estilo.md    a regra extraída da referência (o diretor escreve)
  roteiro.json       cenas + gerações (contrato entre os agentes; src/roteiro.ts tem os tipos)
  assets/            mídias geradas, telas gravadas e trilha (fora do git)
  gastos.json        cada pedido ao Higgsfield (entra no git)
  saida/             renders (fora do git)
```

## Roteiro (`roteiro.json`)

- `formato` `{largura, altura, fps}`; `transicao` `{tipo, duracao}` padrão; `trilha` `{arquivo, volume, bpm, inicio}`.
- `cenas[]`: cada uma com `id`, `tipo` e `duracao` (s) **ou** `batidas` (precisa de `trilha.bpm`; é assim que o corte cai na música). Opcionais: `transicao` (`corte`, `flash`, `fade`, `slide`, `wipe`), `legenda` (rótulo de ficha no rodapé), `nota` (só para a equipe).
  - `titulo`: `linhas[]` (≤ 16 caracteres por linha no 9:16), `sub`, `alerta` (listra: só em problema).
  - `video` / `imagem`: `arquivo`, `movimento` (`zoom-in`, `zoom-out`, `pan-esq`, `pan-dir`, `sobe`, `desce`, `parado`), `inicio`, `titulo` (com `\n`), `veu` (0 a 1).
  - `tela`: gravação ou captura **real** do produto, `titulo`, `foco` `{x, y, escala}` para aproximar numa região.
  - `etiqueta`: `codigo` na etiqueta de lacre (V03, K7Q-2XM), `rotulo`, `titulo`.
  - `marca`: ícone + WAVBOX, `sub`, `chamada` (ex.: wavbox.app).
  - `ficha`: ficha técnica, `titulo` e `linhas[]` de `{rotulo, valor}` (entram uma por vez, em zebra). Só número que está nos docs do produto.
  - `onda`: a onda de áudio desenhada pelo molde (veio do WavBox; serve a produto de áudio), cursor em lacre andando e `comentarios[]` de `{posicao (0 a 1), tempo, tag, texto}` abrindo quando o cursor chega; `versao` no rótulo de cima. Substitui mídia gerada quando não há Higgsfield.
- `geracoes[]`: `id`, `endpoint` (sem barra), `parametros` (vão como estão), `saida`, `imagem_de` (encadeia: a imagem de outra geração vira `image_url`) ou `imagem_local`.

## Regras da marca no vídeo (docs/MARCA.md)

> As regras abaixo são as do WavBox, que serviram de exemplo. Num projeto novo, troque pelas da marca do projeto (o `/doyourshit:video` faz isso na preparação).

- Papel quase preto, tinta osso; **laranja só em lacre** (etiqueta, ícone, estado ativo). Nunca em título, fundo ou texto.
- Títulos, rótulos e marca em caixa alta condensada (Barlow Condensed 900), **sem aspas**; sub e legenda em label (Semi Condensed 600, 0,12em) **abaixo** do título, nunca acima.
- Cantos retos, zero sombra, fio fino. Listra diagonal só onde algo dá errado.
- Tela do produto sempre real (gravação ou captura do app). Interface inventada por IA não entra.
- Prompt para o Higgsfield: sem texto e sem logo na imagem (o texto é do molde), luz baixa e quente, fundo escuro, granulado de filme, combinando com o papel quase preto.

## Modelos do Higgsfield (docs.higgsfield.ai)

Auth `Authorization: Key id:segredo`; base `https://api.higgsfield.ai/<endpoint>`; resposta com `status_url`; estados `queued`, `in_progress`, `completed`, `failed`, `nsfw`, `canceled`; saída em `video.url` ou `images[0].url`; arquivos apagados em 7 dias (o script baixa na hora). Preços medidos em 2026-11-19: Soul standard 1080p = 3 créditos = US$ 0,188 por imagem. O `/estimate` valida o corpo sem cobrar (devolve "X is a required property"): use-o para testar parâmetros de modelo sem página na doc. **Leia a página do modelo (`https://docs.higgsfield.ai/docs/models/<modelo>.md`) antes de usar um endpoint novo**: cada um tem parâmetros próprios.

| Uso | Endpoint | Parâmetros conferidos |
| --- | --- | --- |
| Quadro-chave (foto) | `higgsfield-ai/soul/standard` | `prompt`; `aspect_ratio` (9:16, 16:9, 1:1, 4:3, 3:4, 2:3, 3:2); `resolution` (720p, 1080p); `seed`; `style_id`; `image_reference_url` |
| Texto para vídeo | `kling-video/v3.0/pro/text-to-video` | `prompt` (≤ 2500); `duration` 3–15; `aspect_ratio` (16:9, 9:16, 1:1); `sound` on/off; `cfg_scale`; `multi_shots`, `multi_prompt` |
| Imagem para vídeo | `kling-video/v3.0/pro/image-to-video` | `image_url` (obrigatório), `prompt`, `duration` (aceitos pelo `/estimate`, 2026-11-19; sem página na doc). US$ 0,0962 por segundo em 1080p (5 s ≈ US$ 0,48) |
| Imagem para vídeo (alternativa) | `wan/v2.6/image-to-video` | `prompt`, `image_url`; `duration` 5/10/15; `resolution` 480p–1080p; `negative_prompt`; `seed` |

## Agentes e skill

- `/video` (`.claude/skills/video/`): conduz o fluxo inteiro, com as aprovações.
- `video-diretor`: referência → ficha de estilo → roteiro.json (texto, ritmo, prompts).
- `video-gerador`: estimar e gerar no Higgsfield, conferir o que voltou.
- `video-montador`: molde Remotion (`src/`), render, ajustes de animação.
- `video-revisor`: confere o render contra a ficha de estilo e a marca, sem editar.
- Skill de Remotion: a oficial (`remotion:remotion-best-practices`, plugin remotion) quando estiver instalada; senão `ecc:remotion-video-creation` (mesmas regras).
