#!/usr/bin/env node
// Renderiza um projeto. Mídias que faltam viram cartões de animatic (custo zero).
// Uso:
//   node scripts/render.mjs <projeto>                    vídeo inteiro em saida/<projeto>-<largura>x<altura>.mp4
//   node scripts/render.mjs <projeto> --formato 16:9     troca para 1920x1080 sem mexer no roteiro
//   node scripts/render.mjs <projeto> --quadros 0-89     só um trecho
//   node scripts/render.mjs <projeto> --stills 1,2.5,8   PNGs nos segundos pedidos (para revisar)
//   node scripts/render.mjs <projeto> --rapido           escala 0.5, para conferir rápido
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { RAIZ, argumentos, gravarJson, pastaDoProjeto } from "./comum.mjs";
import { conferir, prepararRoteiro } from "./conferir-roteiro.mjs";

const FORMATOS = { "9:16": [1080, 1920], "16:9": [1920, 1080], "1:1": [1080, 1080], "4:5": [1080, 1350] };

const { pos, flags } = argumentos(process.argv.slice(2));
const pasta = pastaDoProjeto(pos[0]);
const nome = path.basename(pasta);
const { roteiro, erros } = conferir(pasta);
if (erros.length) {
  console.error("O roteiro tem erros; rode: npm run conferir -- " + nome);
  for (const e of erros) console.error("  " + e);
  process.exit(1);
}

prepararRoteiro(pasta, roteiro);

if (flags.formato) {
  const f = FORMATOS[flags.formato];
  if (!f) throw new Error(`Formato ${flags.formato} não existe (${Object.keys(FORMATOS).join(", ")}).`);
  [roteiro.formato.largura, roteiro.formato.altura] = f;
}

const temp = path.join(pasta, ".render-props.json");
gravarJson(temp, roteiro);
const saidas = path.join(pasta, "saida");
fs.mkdirSync(saidas, { recursive: true });
const sufixo = `${roteiro.formato.largura}x${roteiro.formato.altura}`;
const bin = path.join(RAIZ, "node_modules/.bin/remotion");
const comuns = ["--props", temp, "--public-dir", pasta, ...(flags.rapido ? ["--scale", "0.5"] : [])];

const rodar = (args) => {
  const r = spawnSync(bin, args, { cwd: RAIZ, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

if (flags.stills) {
  const fps = roteiro.formato.fps;
  for (const s of String(flags.stills).split(",")) {
    const quadro = Math.round(Number(s) * fps);
    const out = path.join(saidas, `still-${sufixo}-${String(s).replace(".", "_")}s.png`);
    rodar(["still", "Institucional", out, "--frame", String(quadro), ...comuns]);
  }
} else {
  const trecho = flags.quadros ? `-${String(flags.quadros).replace("-", "_")}` : "";
  const out = path.join(saidas, `${nome}-${sufixo}${trecho}.mp4`);
  rodar(["render", "Institucional", out, ...comuns, ...(flags.quadros ? ["--frames", String(flags.quadros)] : [])]);
  console.log(`\nPronto: ${out}`);
}
fs.rmSync(temp, { force: true });
