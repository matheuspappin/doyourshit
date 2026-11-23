#!/usr/bin/env node
// Confere um roteiro.json: formato, ids, durações, arquivos que faltam e regras da marca.
// Uso: node scripts/conferir-roteiro.mjs <projeto>
// Sai com código 1 se houver erro; avisos não bloqueiam.
import fs from "node:fs";
import path from "node:path";
import { argumentos, lerJson, pastaDoProjeto } from "./comum.mjs";

const TIPOS = ["titulo", "video", "imagem", "tela", "etiqueta", "marca", "ficha", "onda"];
const TRANSICOES = ["corte", "fade", "slide", "wipe", "flash"];

export const conferir = (pasta) => {
  const r = lerJson(path.join(pasta, "roteiro.json"));
  const erros = [];
  const avisos = [];
  const faltam = [];

  if (!r.formato?.largura || !r.formato?.altura || !r.formato?.fps) erros.push("formato precisa de largura, altura e fps.");
  if (!Array.isArray(r.cenas) || r.cenas.length === 0) erros.push("cenas está vazio.");

  const ids = new Set();
  let total = 0;
  for (const c of r.cenas ?? []) {
    const onde = `cena ${c.id ?? "?"}`;
    if (!c.id) erros.push("cena sem id.");
    if (ids.has(c.id)) erros.push(`${onde}: id repetido.`);
    ids.add(c.id);
    if (!TIPOS.includes(c.tipo)) erros.push(`${onde}: tipo "${c.tipo}" não existe (${TIPOS.join(", ")}).`);
    if (c.transicao && !TRANSICOES.includes(c.transicao)) erros.push(`${onde}: transição "${c.transicao}" não existe.`);
    if (c.batidas && !r.trilha?.bpm) erros.push(`${onde}: usa batidas, mas a trilha não tem bpm.`);
    const seg = c.batidas && r.trilha?.bpm ? (c.batidas * 60) / r.trilha.bpm : c.duracao ?? 2;
    if (seg < 0.4) avisos.push(`${onde}: ${seg.toFixed(2)} s é curto demais para ler.`);
    total += seg;

    const textos = [
      c.linhas?.map((l) => (typeof l === "string" ? l : [l.rotulo, l.valor])),
      c.titulo, c.sub, c.legenda, c.rotulo, c.codigo, c.versao,
      c.comentarios?.map((k) => [k.tag, k.texto]),
    ].flat(3).filter(Boolean);
    for (const t of textos) {
      if (/["“”«»]/.test(t)) erros.push(`${onde}: aspas em "${t}" (The No Quotes Rule do DESIGN.md).`);
    }
    for (const t of String(c.titulo ?? "").split("\n")) {
      if (t.length > 16) avisos.push(`${onde}: título "${t}" com mais de 16 caracteres pode não caber no 9:16.`);
    }
    if (c.tipo === "onda" && (c.comentarios ?? []).some((k) => k.posicao < 0 || k.posicao > 1)) {
      erros.push(`${onde}: posicao do comentário vai de 0 a 1.`);
    }
    if (c.tipo === "titulo" && (c.linhas ?? []).some((l) => l.length > 16)) {
      avisos.push(`${onde}: linha com mais de 16 caracteres pode não caber no 9:16.`);
    }
    if (c.arquivo && !fs.existsSync(path.join(pasta, c.arquivo))) faltam.push(`${c.id}: ${c.arquivo}`);
  }
  if (r.trilha && !fs.existsSync(path.join(pasta, r.trilha.arquivo))) faltam.push(`trilha: ${r.trilha.arquivo}`);

  const geracoes = r.geracoes ?? [];
  const gids = new Set(geracoes.map((g) => g.id));
  for (const g of geracoes) {
    if (!g.endpoint || !g.saida || !g.parametros) erros.push(`geração ${g.id}: precisa de endpoint, parametros e saida.`);
    if (g.imagem_de && !gids.has(g.imagem_de)) erros.push(`geração ${g.id}: imagem_de "${g.imagem_de}" não existe.`);
    if (g.endpoint?.startsWith("/")) erros.push(`geração ${g.id}: endpoint sem barra inicial.`);
  }

  return { roteiro: r, erros, avisos, faltam, segundos: total };
};

/** Roteiro pronto para o Remotion: marca o que existe e põe o prompt no cartão de animatic. */
export const prepararRoteiro = (pasta, roteiro) => {
  const promptDe = new Map((roteiro.geracoes ?? []).map((g) => [g.saida, g.parametros?.prompt]));
  for (const c of roteiro.cenas) {
    if (!c.arquivo) continue;
    c._existe = fs.existsSync(path.join(pasta, c.arquivo));
    if (!c._existe) c._prompt = promptDe.get(c.arquivo) ?? c.nota ?? "";
  }
  if (roteiro.trilha) roteiro.trilha._existe = fs.existsSync(path.join(pasta, roteiro.trilha.arquivo));
  return roteiro;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const { pos } = argumentos(process.argv.slice(2));
  const pasta = pastaDoProjeto(pos[0]);
  const { erros, avisos, faltam, segundos, roteiro } = conferir(pasta);
  console.log(`${roteiro.titulo}: ${roteiro.cenas.length} cenas, ~${segundos.toFixed(1)} s (antes das transições).`);
  for (const e of erros) console.log(`ERRO   ${e}`);
  for (const a of avisos) console.log(`AVISO  ${a}`);
  if (faltam.length) {
    console.log(`Faltam ${faltam.length} arquivos (viram cartão de animatic no render):`);
    for (const f of faltam) console.log(`       ${f}`);
  }
  if (!erros.length) console.log("Roteiro OK.");
  process.exit(erros.length ? 1 : 0);
}
