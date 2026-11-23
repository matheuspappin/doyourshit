#!/usr/bin/env node
// Mede um vídeo de referência para virar ficha de estilo.
// Uso: node scripts/analisar-referencia.mjs <video.mp4> <pasta-de-saida>
// Saída na pasta:
//   analise.json   números: cortes, duração de cada plano, ritmo, movimento, brilho, BPM, cortes na batida
//   resumo.md      o mesmo em texto, para o diretor ler
//   quadros/       p01-meio.jpg (e -inicio/-fim nos planos com 1 s ou mais), para olhar o estilo
// Usa o ffmpeg que vem com o Remotion (sem filtro de cena); a detecção de corte é feita aqui.
import fs from "node:fs";
import path from "node:path";
import { argumentos, ffmpeg, ffprobe, gravarJson } from "./comum.mjs";

const { pos, flags } = argumentos(process.argv.slice(2));
const [entrada, saidaArg] = pos;
if (!entrada || !fs.existsSync(entrada)) {
  console.error("Uso: node scripts/analisar-referencia.mjs <video.mp4> <pasta-de-saida>");
  process.exit(1);
}
const saida = path.resolve(saidaArg ?? path.join(path.dirname(entrada), "analise"));
const pastaQuadros = path.join(saida, "quadros");
fs.mkdirSync(pastaQuadros, { recursive: true });

// 1. Metadados
const probe = JSON.parse(
  ffprobe(["-print_format", "json", "-show_streams", "-show_format", entrada]).stdout || "{}",
);
const v = probe.streams?.find((s) => s.codec_type === "video");
if (!v) throw new Error("Não achei faixa de vídeo no arquivo.");
const temAudio = probe.streams.some((s) => s.codec_type === "audio");
const [num, den] = (v.avg_frame_rate || v.r_frame_rate || "30/1").split("/").map(Number);
const fps = den ? num / den : num;
const duracao = Number(probe.format?.duration ?? v.duration ?? 0);
let largura = v.width;
let altura = v.height;
const rot = Number(v.tags?.rotate ?? v.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? 0);
if (Math.abs(rot) === 90) [largura, altura] = [altura, largura];

// 2. Quadros pequenos em cinza para medir diferença entre quadros
const W = 96;
const H = Math.max(2, Math.round((W * altura) / largura / 2) * 2);
const bruto = ffmpeg(["-i", entrada, "-an", "-vf", `scale=${W}:${H},format=gray`, "-f", "image2pipe", "-c:v", "rawvideo", "-pix_fmt", "gray", "pipe:1"]);
if (bruto.status !== 0) throw new Error("ffmpeg falhou ao ler o vídeo: " + bruto.stderr?.toString());
const buf = bruto.stdout;
const tam = W * H;
const n = Math.floor(buf.length / tam);
const diff = new Float64Array(n);
const brilho = new Float64Array(n);
const hist = (o) => {
  const h = new Float64Array(16);
  for (let i = 0; i < tam; i++) h[buf[o + i] >> 4]++;
  return h;
};
let hAnt = hist(0);
for (let q = 0; q < n; q++) {
  const o = q * tam;
  let soma = 0;
  let somaB = 0;
  for (let i = 0; i < tam; i++) {
    somaB += buf[o + i];
    if (q > 0) soma += Math.abs(buf[o + i] - buf[o - tam + i]);
  }
  brilho[q] = somaB / tam / 255;
  if (q > 0) {
    const h = hist(o);
    let dh = 0;
    for (let k = 0; k < 16; k++) dh += Math.abs(h[k] - hAnt[k]);
    hAnt = h;
    // Mistura diferença de pixel (movimento) com diferença de histograma (troca de plano).
    diff[q] = 0.5 * (soma / tam / 255) + 0.5 * (dh / (2 * tam));
  }
}

// 3. Cortes: pico acima de um limiar adaptativo, com plano mínimo de 4 quadros
const vals = Array.from(diff.slice(1)).sort((a, b) => a - b);
const mediana = vals[Math.floor(vals.length / 2)] ?? 0;
const limiar = Number(flags.limiar ?? Math.max(0.08, mediana * 5));
const cortes = [];
let ultimo = 0;
for (let q = 1; q < n - 1; q++) {
  const pico = diff[q] > limiar && diff[q] >= diff[q - 1] && diff[q] >= diff[q + 1];
  if (pico && q - ultimo >= 4) {
    cortes.push(q);
    ultimo = q;
  }
}
const limites = [0, ...cortes, n];
const planos = [];
for (let i = 0; i < limites.length - 1; i++) {
  const a = limites[i];
  const b = limites[i + 1];
  let mov = 0;
  let br = 0;
  for (let q = a; q < b; q++) {
    if (q > a) mov += diff[q];
    br += brilho[q];
  }
  const qtd = b - a;
  const movimento = qtd > 1 ? mov / (qtd - 1) : 0;
  planos.push({
    plano: i + 1,
    inicio: +(a / fps).toFixed(3),
    fim: +(b / fps).toFixed(3),
    duracao: +((b - a) / fps).toFixed(3),
    movimento: movimento < 0.01 ? "parado" : movimento < 0.035 ? "leve" : movimento < 0.08 ? "médio" : "forte",
    movimento_valor: +movimento.toFixed(4),
    brilho: +(br / qtd).toFixed(3),
  });
}

// 4. Quadros para olhar (JPEG 540 de largura)
const extrair = (t, nome) => {
  ffmpeg(["-y", "-ss", t.toFixed(3), "-i", entrada, "-frames:v", "1", "-vf", "scale=540:-2", "-q:v", "3", path.join(pastaQuadros, nome)]);
};
const maxQuadros = Number(flags["max-quadros"] ?? 80);
let feitos = 0;
for (const p of planos) {
  if (feitos >= maxQuadros) break;
  const id = `p${String(p.plano).padStart(2, "0")}`;
  extrair(p.inicio + p.duracao / 2, `${id}-meio.jpg`);
  feitos++;
  if (p.duracao >= 1 && feitos + 2 <= maxQuadros) {
    extrair(p.inicio + 0.08, `${id}-inicio.jpg`);
    extrair(Math.max(p.inicio, p.fim - 0.12), `${id}-fim.jpg`);
    feitos += 2;
  }
}

// 5. Áudio: BPM por autocorrelação da força de ataque e quantos cortes caem na batida
let audio = null;
if (temAudio) {
  const SR = 11025;
  // Sem muxer s16le nesta build: sai WAV e pulamos o cabeçalho até o bloco "data".
  const wav = ffmpeg(["-i", entrada, "-vn", "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", "-f", "wav", "pipe:1"]).stdout;
  const inicioDados = wav.indexOf("data") + 8;
  const pcm = Buffer.from(wav.subarray(inicioDados, inicioDados + Math.floor((wav.length - inicioDados) / 2) * 2));
  const amostras = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length / 2);
  const HOP = 256;
  const nq = Math.floor(amostras.length / HOP);
  const energia = new Float64Array(nq);
  for (let i = 0; i < nq; i++) {
    let s = 0;
    for (let k = 0; k < HOP; k++) {
      const x = amostras[i * HOP + k] / 32768;
      s += x * x;
    }
    // Compressão log1p: o silêncio fica perto de zero e não gera ataque falso (log puro explode no silêncio).
    energia[i] = Math.log1p(1000 * (s / HOP));
  }
  const ataque = new Float64Array(nq);
  for (let i = 1; i < nq; i++) ataque[i] = Math.max(0, energia[i] - energia[i - 1]);
  // Tira a média para a autocorrelação não favorecer atraso nenhum.
  const mediaAtaque = ataque.reduce((a, b) => a + b, 0) / (nq || 1);
  for (let i = 0; i < nq; i++) ataque[i] -= mediaAtaque;
  const taxa = SR / HOP; // quadros de ataque por segundo
  let melhor = { bpm: 0, valor: -Infinity };
  for (let bpm = 70; bpm <= 180; bpm += 0.5) {
    const lag = (60 / bpm) * taxa;
    const l0 = Math.floor(lag);
    const fr = lag - l0;
    let s = 0;
    for (let i = 0; i + l0 + 1 < nq; i++) s += ataque[i] * (ataque[i + l0] * (1 - fr) + ataque[i + l0 + 1] * fr);
    s /= nq - l0; // normaliza pelo número de termos
    // Preferência leve por andamentos perto de 120 (log-normal, como no librosa): desempata dobro/metade.
    s *= Math.exp(-0.5 * Math.log2(bpm / 120) ** 2);
    if (s > melhor.valor) melhor = { bpm, valor: s };
  }
  // Refino: pente de batidas (andamento ± 3 BPM, passo 0,1) com a melhor fase de cada um.
  // A autocorrelação acha a região; o pente acerta o andamento exato e a primeira batida.
  const durAudio = amostras.length / SR;
  const pente = (bpm) => {
    const p = 60 / bpm;
    let melhorS = -Infinity;
    let melhorD = 0;
    for (let d = 0; d < p; d += 0.005) {
      let s = 0;
      for (let t = d; t < durAudio; t += p) {
        const i = Math.round(t * taxa);
        s += Math.max(ataque[i] ?? 0, ataque[i - 1] ?? 0, ataque[i + 1] ?? 0);
      }
      if (s > melhorS) {
        melhorS = s;
        melhorD = d;
      }
    }
    return { s: melhorS / Math.ceil(durAudio / p), d: melhorD };
  };
  let refino = { bpm: melhor.bpm, ...pente(melhor.bpm) };
  for (let b = melhor.bpm - 3; b <= melhor.bpm + 3; b += 0.1) {
    const r = pente(b);
    if (r.s > refino.s) refino = { bpm: +b.toFixed(1), ...r };
  }
  melhor.bpm = refino.bpm;
  const periodo = 60 / melhor.bpm;
  const fase = refino.d;
  const tol = Number(flags.tolerancia ?? 0.07);
  const tCortes = cortes.map((q) => q / fps);
  const naBatida = tCortes.filter((t) => {
    const r = (((t - fase) % periodo) + periodo) % periodo;
    return Math.min(r, periodo - r) <= tol;
  }).length;
  const meiaBatida = tCortes.filter((t) => {
    const p2 = periodo / 2;
    const r = (((t - fase) % p2) + p2) % p2;
    return Math.min(r, p2 - r) <= tol;
  }).length;
  // Momentos fortes: os maiores picos de ataque, separados por 1 s.
  const picos = Array.from(ataque, (valor, i) => ({ t: i / taxa, valor }))
    .sort((a, b) => b.valor - a.valor)
    .reduce((acc, p) => (acc.length < 6 && acc.every((x) => Math.abs(x.t - p.t) > 1) ? [...acc, p] : acc), [])
    .map((p) => +p.t.toFixed(2))
    .sort((a, b) => a - b);
  audio = {
    bpm_estimado: melhor.bpm,
    obs_bpm: "Estimativa por autocorrelação; pode sair o dobro ou a metade do real. Confira de ouvido.",
    primeira_batida: +fase.toFixed(3),
    cortes_na_batida: tCortes.length ? +(naBatida / tCortes.length).toFixed(2) : 0,
    cortes_na_meia_batida: tCortes.length ? +(meiaBatida / tCortes.length).toFixed(2) : 0,
    duracao_media_em_batidas: planos.length ? +(duracao / planos.length / periodo).toFixed(2) : 0,
    momentos_fortes: picos,
  };
}

// 6. Resumo
const dur = planos.map((p) => p.duracao).sort((a, b) => a - b);
const media = dur.reduce((a, b) => a + b, 0) / (dur.length || 1);
const analise = {
  arquivo: path.basename(entrada),
  duracao: +duracao.toFixed(2),
  largura,
  altura,
  proporcao: largura > altura ? "horizontal" : largura === altura ? "quadrado" : "vertical",
  fps: +fps.toFixed(3),
  planos_total: planos.length,
  ritmo: {
    cortes_por_segundo: +(cortes.length / (duracao || 1)).toFixed(2),
    plano_medio: +media.toFixed(2),
    plano_mediano: dur[Math.floor(dur.length / 2)] ?? 0,
    plano_mais_curto: dur[0] ?? 0,
    plano_mais_longo: dur[dur.length - 1] ?? 0,
  },
  brilho_medio: +(brilho.reduce((a, b) => a + b, 0) / (n || 1)).toFixed(3),
  limiar_de_corte: +limiar.toFixed(3),
  audio,
  planos,
};
gravarJson(path.join(saida, "analise.json"), analise);

const linhas = [
  `# Análise de ${analise.arquivo}`,
  "",
  `${analise.duracao} s, ${largura}x${altura} (${analise.proporcao}), ${analise.fps} fps, ${planos.length} planos.`,
  `Ritmo: ${analise.ritmo.cortes_por_segundo} cortes/s; plano médio ${analise.ritmo.plano_medio} s (mediana ${analise.ritmo.plano_mediano} s, de ${analise.ritmo.plano_mais_curto} a ${analise.ritmo.plano_mais_longo} s).`,
  `Brilho médio ${analise.brilho_medio} (0 preto, 1 branco).`,
  audio
    ? `Áudio: ~${audio.bpm_estimado} BPM; ${Math.round(audio.cortes_na_batida * 100)}% dos cortes na batida, ${Math.round(audio.cortes_na_meia_batida * 100)}% na meia batida; plano médio = ${audio.duracao_media_em_batidas} batidas. Momentos fortes: ${audio.momentos_fortes.join(", ")} s.`
    : "Sem áudio.",
  "",
  "| Plano | Início | Duração | Movimento | Brilho | Quadros |",
  "| --- | --- | --- | --- | --- | --- |",
  ...planos.map((p) => {
    const id = `p${String(p.plano).padStart(2, "0")}`;
    const qs = fs.readdirSync(pastaQuadros).filter((f) => f.startsWith(id + "-")).join(", ");
    return `| ${p.plano} | ${p.inicio} | ${p.duracao} | ${p.movimento} | ${p.brilho} | ${qs} |`;
  }),
  "",
  `Detecção de corte com limiar ${analise.limiar_de_corte}. Se juntou planos, rode de novo com --limiar menor (ex.: 0.05); se partiu planos com movimento rápido, com --limiar maior.`,
];
fs.writeFileSync(path.join(saida, "resumo.md"), linhas.join("\n") + "\n");
console.log(linhas.slice(0, 6).join("\n"));
console.log(`\nSalvo em ${saida} (analise.json, resumo.md, ${fs.readdirSync(pastaQuadros).length} quadros).`);
