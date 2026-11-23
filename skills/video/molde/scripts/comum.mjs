// Funções comuns dos scripts de vídeo. Sem dependências além do Node 20+.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const PROJETOS = path.join(RAIZ, "projetos");

/** Aceita o nome do projeto (exemplo) ou um caminho para a pasta. */
export const pastaDoProjeto = (nome) => {
  if (!nome) throw new Error("Diga o projeto: o nome da pasta em video/projetos/ (ex.: exemplo).");
  const direto = path.resolve(nome);
  const p = fs.existsSync(path.join(direto, "roteiro.json")) ? direto : path.join(PROJETOS, nome);
  if (!fs.existsSync(path.join(p, "roteiro.json"))) throw new Error(`Não achei ${path.join(p, "roteiro.json")}.`);
  return p;
};

export const lerJson = (arquivo) => JSON.parse(fs.readFileSync(arquivo, "utf8"));
export const gravarJson = (arquivo, dados) => fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2) + "\n");

/** Lê VAR=valor de video/.env (o .env nunca entra no git). */
export const carregarEnv = () => {
  const arquivo = path.join(RAIZ, ".env");
  if (!fs.existsSync(arquivo)) return;
  for (const linha of fs.readFileSync(arquivo, "utf8").split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
};

/** ffmpeg e ffprobe que vêm com o Remotion (build enxuta: scale, crop, aresample; sem select/tile). */
export const ffmpeg = (args, opcoes = {}) =>
  spawnSync(path.join(RAIZ, "node_modules/.bin/remotion"), ["ffmpeg", "-hide_banner", "-loglevel", "error", ...args], {
    maxBuffer: 1024 * 1024 * 1024,
    ...opcoes,
  });

export const ffprobe = (args) =>
  spawnSync(path.join(RAIZ, "node_modules/.bin/remotion"), ["ffprobe", "-v", "error", ...args], { encoding: "utf8" });

export const argumentos = (argv) => {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=");
      if (v !== undefined) flags[k] = v;
      else if (argv[i + 1] && !argv[i + 1].startsWith("--")) flags[k] = argv[++i];
      else flags[k] = true;
    } else pos.push(a);
  }
  return { pos, flags };
};
