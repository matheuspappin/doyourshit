#!/usr/bin/env node
// Cliente do Higgsfield para os vídeos do WavBox. Sem dependências (fetch do Node).
// Docs: https://docs.higgsfield.ai/docs/llms.txt (leia a página do modelo antes de usar um endpoint novo).
//
// Credenciais em video/.env (nunca no git):
//   HF_API_KEY_ID=...        e  HF_API_KEY_SECRET=...      (ou HF_KEY=id:secret)
//
// Comandos:
//   estimar <projeto> [--so g-c02,g-c06] [--refazer]       custo em US$ de cada geração pendente (não gasta)
//   gerar   <projeto> --confirmar [--limite-usd 5] [--so ...] [--refazer]
//                                                          gera o que falta, baixa em assets/ e anota em gastos.json
//   status  <request_id>                                   estado de um pedido
//   upload  <arquivo>                                      envia um arquivo e mostra a URL pública
//
// Regra de custo (docs/CUSTOS.md): cada geração é cobrada em dólar do saldo da conta.
// O gerar só roda com --confirmar, depois do estimar e do "sim" de quem paga.
import fs from "node:fs";
import path from "node:path";
import { argumentos, carregarEnv, gravarJson, lerJson, pastaDoProjeto } from "./comum.mjs";

const BASE = "https://api.higgsfield.ai";
carregarEnv();

const credencial = () => {
  const par = process.env.HF_KEY ?? process.env.HF_CREDENTIALS;
  const id = process.env.HF_API_KEY_ID ?? par?.split(":")[0];
  const segredo = process.env.HF_API_KEY_SECRET ?? par?.split(":").slice(1).join(":");
  if (!id || !segredo) {
    console.error("Faltam as credenciais: crie video/.env com HF_API_KEY_ID e HF_API_KEY_SECRET (veja video/.env.example).");
    process.exit(1);
  }
  return `Key ${id}:${segredo}`;
};

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

const chamar = async (metodo, url, corpo) => {
  for (let tentativa = 0; ; tentativa++) {
    const r = await fetch(url.startsWith("http") ? url : `${BASE}/${url}`, {
      method: metodo,
      headers: { Authorization: credencial(), "Content-Type": "application/json", Accept: "application/json" },
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const texto = await r.text();
    let dados;
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = { bruto: texto };
    }
    if (r.ok) return dados;
    if ((r.status >= 500 || r.status === 429) && tentativa < 4) {
      await esperar(2000 * 1.5 ** tentativa);
      continue;
    }
    const erro = new Error(`${metodo} ${url} → ${r.status}: ${texto.slice(0, 500)}`);
    erro.status = r.status;
    throw erro;
  }
};

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".wav": "audio/wav" };

const upload = async (arquivo) => {
  const tipo = MIME[path.extname(arquivo).toLowerCase()];
  if (!tipo) throw new Error(`Tipo de arquivo não aceito no upload: ${arquivo}`);
  const u = await chamar("POST", "files/generate-upload-url", { content_type: tipo });
  // Não mande a credencial do Higgsfield para a URL assinada.
  const r = await fetch(u.upload_url, { method: "PUT", headers: u.upload_headers ?? { "Content-Type": tipo }, body: fs.readFileSync(arquivo) });
  if (!r.ok) throw new Error(`Upload falhou (${r.status}): ${await r.text()}`);
  return u.public_url;
};

const acompanhar = async (pedido) => {
  let espera = 2000;
  const inicio = Date.now();
  for (;;) {
    const s = await chamar("GET", pedido.status_url ?? `requests/${pedido.request_id}/status`);
    if (["completed", "failed", "nsfw", "canceled"].includes(s.status)) return s;
    process.stdout.write(`  ${s.status} (${Math.round((Date.now() - inicio) / 1000)} s)\r`);
    await esperar(espera + Math.random() * 500);
    espera = Math.min(10000, espera * 1.5);
  }
};

const urlDaSaida = (s) => s.video?.url ?? s.images?.[0]?.url ?? s.audio?.url ?? s.payload?.video?.url ?? s.payload?.images?.[0]?.url;

const baixar = async (url, destino) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download falhou (${r.status}) de ${url}`);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
};

/** Gerações pendentes em ordem (quem depende de outra vem depois dela). */
const pendentes = (pasta, roteiro, flags) => {
  const todas = roteiro.geracoes ?? [];
  const so = flags.so ? new Set(String(flags.so).split(",")) : null;
  const porId = new Map(todas.map((g) => [g.id, g]));
  const ordem = [];
  const visto = new Set();
  const visitar = (g) => {
    if (visto.has(g.id)) return;
    visto.add(g.id);
    if (g.imagem_de) visitar(porId.get(g.imagem_de));
    ordem.push(g);
  };
  todas.forEach(visitar);
  return ordem.filter((g) => {
    const existe = fs.existsSync(path.join(pasta, g.saida));
    if (so && !so.has(g.id)) return false;
    return flags.refazer ? true : !existe;
  });
};

const corpoDe = (g, urls) => {
  const corpo = { ...g.parametros };
  if (g.imagem_de) corpo.image_url = urls.get(g.imagem_de) ?? "https://exemplo.invalid/quadro.png";
  if (g.imagem_local) corpo.image_url = urls.get(`local:${g.imagem_local}`) ?? "https://exemplo.invalid/local.png";
  return corpo;
};

const estimar = async (pasta, roteiro, flags) => {
  const lista = pendentes(pasta, roteiro, flags);
  if (!lista.length) {
    console.log("Nada pendente: todas as saídas já existem (use --refazer para gerar de novo).");
    return { total: 0, itens: [] };
  }
  const itens = [];
  for (const g of lista) {
    try {
      const e = await chamar("POST", `estimate/${g.endpoint}`, corpoDe(g, new Map()));
      if (e.type === "description") {
        // Alguns modelos (Kling) devolvem só a tabela: "US$ X por segundo de vídeo". Pega a maior taxa
        // (pior caso) e multiplica pela duração pedida.
        const taxas = [...String(e.pricing_description).matchAll(/\$(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
        const segundos = Number(g.parametros.duration ?? 5);
        const usd = taxas.length && /second/i.test(e.pricing_description) ? Math.max(...taxas) * segundos : NaN;
        itens.push({ id: g.id, endpoint: g.endpoint, usd, aproximado: true, tabela: e.pricing_description });
      } else {
        itens.push({ id: g.id, endpoint: g.endpoint, usd: Number(e.usd ?? e.cost ?? NaN) });
      }
    } catch (erro) {
      itens.push({ id: g.id, endpoint: g.endpoint, usd: NaN, erro: erro.message });
    }
  }
  const total = itens.reduce((s, i) => s + (Number.isFinite(i.usd) ? i.usd : 0), 0);
  console.log("Geração                    Endpoint                                        US$");
  for (const i of itens) {
    console.log(`${i.id.padEnd(26)} ${i.endpoint.padEnd(47)} ${Number.isFinite(i.usd) ? i.usd.toFixed(3) : "?"}${i.aproximado ? " (pela tabela)" : ""}`);
    if (i.erro) console.log(`  erro: ${i.erro}`);
    if (!Number.isFinite(i.usd) && !i.erro) i.erro = "sem preço na resposta da estimativa";
    if (i.tabela && !Number.isFinite(i.usd)) console.log(`  tabela: ${i.tabela}`);
  }
  console.log(`Total estimado: US$ ${total.toFixed(2)} (${itens.length} gerações).`);
  if (itens.some((i) => i.erro)) console.log("Há estimativas com erro: confira os parâmetros na página do modelo antes de gerar.");
  gravarJson(path.join(pasta, "estimativa.json"), { quando: new Date().toISOString(), total, itens });
  return { total, itens };
};

const gerar = async (pasta, roteiro, flags) => {
  if (!flags.confirmar) {
    console.error("Gerar gasta saldo. Rode o estimar, peça o sim de quem paga e repita com --confirmar.");
    process.exit(1);
  }
  const limite = Number(flags["limite-usd"] ?? 5);
  const { total, itens } = await estimar(pasta, roteiro, flags);
  if (!itens.length) return;
  if (itens.some((i) => i.erro)) {
    console.error("Parei: há estimativas com erro.");
    process.exit(1);
  }
  if (total > limite) {
    console.error(`Parei: o total (US$ ${total.toFixed(2)}) passa do limite de US$ ${limite}. Use --limite-usd para subir.`);
    process.exit(1);
  }
  const arquivoGastos = path.join(pasta, "gastos.json");
  const gastos = fs.existsSync(arquivoGastos) ? lerJson(arquivoGastos) : [];
  const urls = new Map();
  for (const g of pendentes(pasta, roteiro, flags)) {
    // Dependência já gerada antes: sobe o arquivo local para ter a URL.
    if (g.imagem_de && !urls.has(g.imagem_de)) {
      const dep = roteiro.geracoes.find((x) => x.id === g.imagem_de);
      urls.set(g.imagem_de, await upload(path.join(pasta, dep.saida)));
    }
    if (g.imagem_local && !urls.has(`local:${g.imagem_local}`)) {
      urls.set(`local:${g.imagem_local}`, await upload(path.join(pasta, g.imagem_local)));
    }
    const estimado = itens.find((i) => i.id === g.id)?.usd;
    console.log(`\n${g.id}: ${g.endpoint} (US$ ${estimado?.toFixed(3)})`);
    const pedido = await chamar("POST", g.endpoint, corpoDe(g, urls));
    const s = await acompanhar(pedido);
    const registro = { quando: new Date().toISOString(), id: g.id, endpoint: g.endpoint, request_id: pedido.request_id, status: s.status, usd_estimado: estimado };
    gastos.push(registro);
    gravarJson(arquivoGastos, gastos);
    if (s.status !== "completed") {
      console.error(`  ${s.status}: ${JSON.stringify(s.error ?? s).slice(0, 300)} (falha e nsfw não são cobrados)`);
      continue;
    }
    const url = urlDaSaida(s);
    await baixar(url, path.join(pasta, g.saida));
    urls.set(g.id, url);
    console.log(`  salvo em ${g.saida}`);
  }
  const gasto = gastos.filter((x) => x.status === "completed").reduce((s, x) => s + (x.usd_estimado ?? 0), 0);
  console.log(`\nGasto estimado acumulado neste projeto: US$ ${gasto.toFixed(2)} (gastos.json).`);
};

const { pos, flags } = argumentos(process.argv.slice(2));
const [comando, alvo] = pos;
try {
  if (comando === "estimar") {
    const pasta = pastaDoProjeto(alvo);
    await estimar(pasta, lerJson(path.join(pasta, "roteiro.json")), flags);
  } else if (comando === "gerar") {
    const pasta = pastaDoProjeto(alvo);
    await gerar(pasta, lerJson(path.join(pasta, "roteiro.json")), flags);
  } else if (comando === "status") {
    console.log(JSON.stringify(await chamar("GET", `requests/${alvo}/status`), null, 2));
  } else if (comando === "upload") {
    console.log(await upload(alvo));
  } else {
    console.log("Comandos: estimar <projeto> | gerar <projeto> --confirmar | status <request_id> | upload <arquivo>");
    process.exit(comando ? 1 : 0);
  }
} catch (erro) {
  console.error(erro.message);
  if (erro.status === 401) console.error("Credencial recusada: confira HF_API_KEY_ID e HF_API_KEY_SECRET no video/.env.");
  if (/not_enough_credits/.test(erro.message)) {
    console.error("Sem saldo na API (cloud.higgsfield.ai › Billing). Nada foi cobrado. Pôr saldo é gasto: precisa do sim de quem paga.");
  }
  process.exit(1);
}
