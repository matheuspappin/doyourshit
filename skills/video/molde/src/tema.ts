// Tokens do DESIGN.md da raiz (variante leve do produto, tema escuro).
// Mudou lá, mude aqui. Regras que valem no vídeo:
// - Laranja (lacre) só em lacre: etiqueta, estado ativo, instante da ação. Nunca em título ou fundo de seção.
// - Títulos, rótulos e marca em caixa alta condensada, sem aspas. Corpo nunca em caixa alta.
// - Cantos retos (só a etiqueta tem raio 6), zero sombra, fio fino entre regiões.
// - Listra tinta/papel só onde algo pode dar errado (cena de problema).
import { loadFont as carregarCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { loadFont as carregarSemi } from "@remotion/google-fonts/BarlowSemiCondensed";
import { loadFont as carregarBarlow } from "@remotion/google-fonts/Barlow";

const condensed = carregarCondensed("normal", { weights: ["800", "900"], subsets: ["latin", "latin-ext"] });
const semi = carregarSemi("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] });
const barlow = carregarBarlow("normal", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

export const fontes = {
  display: condensed.fontFamily,
  label: semi.fontFamily,
  corpo: barlow.fontFamily,
};

export const cores = {
  papel: "#0c0c0c", // paper-night: fundo
  elevado: "#141413", // raise-web: superfície elevada (cartões, placas)
  etiqueta: "#1c1c1b", // label-night
  selecao: "#252523", // select-web
  tintaForte: "#e2e0db", // títulos, nomes e números
  tinta: "#c9c7c2", // corpo
  calada: "#979590", // secundário
  fantasma: "#7f7d78",
  fio: "#3f3e3b", // fio de região (1 px)
  borda: "#6c6a66", // borda de controle (1,5 px)
  lacre: "#ff6a1a", // tie-night: só em lacre
  sobreLacre: "#0c0c0c", // texto sobre o lacre é sempre o papel
};

export type Cores = typeof cores;
