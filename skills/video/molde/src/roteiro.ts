// Formato do roteiro.json: o contrato entre o diretor (que escreve), o gerador
// (que preenche os arquivos do Higgsfield) e o montador (que renderiza).
// Descrição completa em video/AGENTS.md › "Roteiro".

export type Movimento = "parado" | "zoom-in" | "zoom-out" | "pan-esq" | "pan-dir" | "sobe" | "desce";

export type Transicao = "corte" | "fade" | "slide" | "wipe" | "flash";

type CenaBase = {
  id: string;
  /** Duração em segundos. Use `batidas` no lugar quando a trilha tiver bpm. */
  duracao?: number;
  batidas?: number;
  /** Transição de entrada desta cena (sobrepõe a padrão do roteiro). */
  transicao?: Transicao;
  /** Texto pequeno em label no rodapé (rótulo de ficha). Sem aspas. */
  legenda?: string;
  /** Anotação para a equipe; não aparece no vídeo. */
  nota?: string;
};

export type CenaTitulo = CenaBase & {
  tipo: "titulo";
  /** Linhas do título, em caixa alta. Cada linha entra numa batida. */
  linhas: string[];
  sub?: string;
  /** Liga a listra de alerta por baixo (só para problema). */
  alerta?: boolean;
};

export type CenaMidia = CenaBase & {
  tipo: "video" | "imagem";
  /** Caminho relativo à pasta do projeto (ex.: assets/g01.mp4). */
  arquivo: string;
  movimento?: Movimento;
  /** Segundo do arquivo em que a cena começa (vídeo). */
  inicio?: number;
  /** Texto grande sobre a mídia (caixa alta). */
  titulo?: string;
  /** Escurece a mídia para o texto ler (0 a 1). */
  veu?: number;
  /** Preenchido pelo render.mjs: o arquivo existe? Se não, vira cartão de animatic. */
  _existe?: boolean;
  /** Prompt mostrado no cartão de animatic quando o arquivo ainda não existe. */
  _prompt?: string;
};

export type CenaTela = CenaBase & {
  tipo: "tela";
  /** Gravação ou captura real do produto (mp4, png ou jpg). */
  arquivo: string;
  titulo?: string;
  /** Aproximação numa região: x e y de 0 a 1 (centro), escala final. */
  foco?: { x: number; y: number; escala: number };
  _existe?: boolean;
  _prompt?: string;
};

export type CenaEtiqueta = CenaBase & {
  tipo: "etiqueta";
  /** Código na etiqueta de lacre (ex.: V03, SB-001, K7Q-2XM). */
  codigo: string;
  rotulo?: string;
  titulo?: string;
};

export type CenaMarca = CenaBase & {
  tipo: "marca";
  sub?: string;
  /** Chamada final, em label (ex.: wavbox.app). */
  chamada?: string;
};

export type CenaFicha = CenaBase & {
  tipo: "ficha";
  titulo?: string;
  /** Linhas da ficha técnica: rótulo em label, valor em condensada. Entram uma por vez. */
  linhas: { rotulo: string; valor: string }[];
};

export type CenaOnda = CenaBase & {
  tipo: "onda";
  titulo?: string;
  /** Duração da faixa mostrada no fim da régua (ex.: 3:24). */
  total?: string;
  /** Rótulo pequeno sobre a onda (ex.: V03 · Mix 2). */
  versao?: string;
  /** Comentários presos no tempo: posição de 0 a 1 na onda. */
  comentarios: { posicao: number; tempo: string; tag: string; texto: string }[];
};

export type Cena = CenaTitulo | CenaMidia | CenaTela | CenaEtiqueta | CenaMarca | CenaFicha | CenaOnda;

export type Geracao = {
  id: string;
  /** Endpoint do Higgsfield, sem barra inicial (ex.: kling-video/v3.0/pro/image-to-video). */
  endpoint: string;
  /** Corpo enviado como está. Confira os nomes na página do modelo antes. */
  parametros: Record<string, unknown>;
  /** Onde salvar, relativo à pasta do projeto. */
  saida: string;
  /** Usa a saída de outra geração (imagem) como image_url. */
  imagem_de?: string;
  /** Imagem local enviada pelo upload e usada como image_url. */
  imagem_local?: string;
};

export type Roteiro = {
  titulo: string;
  formato: { largura: number; altura: number; fps: number };
  /** Transição padrão entre cenas e a duração dela em segundos. */
  transicao?: { tipo: Transicao; duracao: number };
  trilha?: { arquivo: string; volume?: number; bpm?: number; inicio?: number; nota?: string; _existe?: boolean };
  cenas: Cena[];
  /** Pedidos ao Higgsfield. Não entram no render, só no scripts/higgsfield.mjs. */
  geracoes?: Geracao[];
};

export const segundosDaCena = (cena: Cena, roteiro: Roteiro): number => {
  if (cena.batidas && roteiro.trilha?.bpm) return (cena.batidas * 60) / roteiro.trilha.bpm;
  return cena.duracao ?? 2;
};

export const transicaoDaCena = (cena: Cena, roteiro: Roteiro): Transicao =>
  cena.transicao ?? roteiro.transicao?.tipo ?? "corte";

export const segundosDaTransicao = (roteiro: Roteiro): number => roteiro.transicao?.duracao ?? 0.2;

export const sobrepoe = (t: Transicao) => t !== "corte" && t !== "flash";

/** Quadros de cada sequência: a cena antes de uma transição com sobreposição ganha a duração dela,
 * para que a cena seguinte comece exatamente na batida (o corte não escorrega com as transições). */
export const quadrosDasCenas = (roteiro: Roteiro): number[] => {
  const fps = roteiro.formato.fps;
  const t = Math.round(segundosDaTransicao(roteiro) * fps);
  return roteiro.cenas.map((cena, i) => {
    const proxima = roteiro.cenas[i + 1];
    const extra = proxima && sobrepoe(transicaoDaCena(proxima, roteiro)) ? t : 0;
    return Math.round(segundosDaCena(cena, roteiro) * fps) + extra;
  });
};

/** Duração total em quadros: a soma das cenas (as transições não encurtam o vídeo). */
export const quadrosTotais = (roteiro: Roteiro): number => {
  const fps = roteiro.formato.fps;
  const total = roteiro.cenas.reduce((s, c) => s + Math.round(segundosDaCena(c, roteiro) * fps), 0);
  return Math.max(1, total);
};
