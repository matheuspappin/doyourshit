#!/usr/bin/env node
// Abre o Remotion Studio com um projeto (prévia ao vivo no navegador, porta 3000).
// Uso: node scripts/studio.mjs <projeto>
// Na VPS, abra pelo túnel: ssh -L 3000:localhost:3000 <vps> e acesse http://localhost:3000
// As props ficam fixas ao abrir: mudou o roteiro.json, feche e abra de novo.
import path from "node:path";
import { spawnSync } from "node:child_process";
import { RAIZ, argumentos, gravarJson, lerJson, pastaDoProjeto } from "./comum.mjs";
import { prepararRoteiro } from "./conferir-roteiro.mjs";

const { pos } = argumentos(process.argv.slice(2));
const pasta = pastaDoProjeto(pos[0] ?? "exemplo");
const props = path.join(pasta, ".render-props.json");
gravarJson(props, prepararRoteiro(pasta, lerJson(path.join(pasta, "roteiro.json"))));
spawnSync(
  path.join(RAIZ, "node_modules/.bin/remotion"),
  ["studio", "--props", props, "--public-dir", pasta, "--no-open"],
  { cwd: RAIZ, stdio: "inherit" },
);
