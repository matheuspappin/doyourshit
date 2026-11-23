import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cores, fontes } from "../tema";
import type { CenaEtiqueta, CenaMarca, CenaMidia, CenaTela, CenaTitulo, Movimento } from "../roteiro";
import { Etiqueta, Fundo, Legenda, Listra, Logo, Sub, TituloAnimado, useU } from "../componentes/base";
import { Animatic } from "../componentes/Animatic";

const ehImagem = (arquivo: string) => /\.(png|jpe?g|webp|gif)$/i.test(arquivo);

const transformDoMovimento = (movimento: Movimento, p: number): string => {
  switch (movimento) {
    case "zoom-in":
      return `scale(${1 + 0.12 * p})`;
    case "zoom-out":
      return `scale(${1.12 - 0.12 * p})`;
    case "pan-esq":
      return `scale(1.12) translateX(${4 - 8 * p}%)`;
    case "pan-dir":
      return `scale(1.12) translateX(${-4 + 8 * p}%)`;
    case "sobe":
      return `scale(1.12) translateY(${4 - 8 * p}%)`;
    case "desce":
      return `scale(1.12) translateY(${-4 + 8 * p}%)`;
    default:
      return "none";
  }
};

const Midia: React.FC<{ arquivo: string; inicio?: number; estilo?: React.CSSProperties }> = ({ arquivo, inicio, estilo }) => {
  const { fps } = useVideoConfig();
  const css: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", ...estilo };
  if (ehImagem(arquivo)) return <Img src={staticFile(arquivo)} style={css} />;
  return <OffthreadVideo src={staticFile(arquivo)} trimBefore={Math.round((inicio ?? 0) * fps)} muted style={css} />;
};

export const Titulo: React.FC<{ cena: CenaTitulo }> = ({ cena }) => {
  const u = useU();
  return (
    <Fundo>
      {cena.alerta ? <Listra /> : null}
      <AbsoluteFill style={{ justifyContent: "center", padding: `0 ${72 * u}px` }}>
        <TituloAnimado linhas={cena.linhas} />
        {cena.sub ? <Sub texto={cena.sub} atraso={6 + cena.linhas.length * 5} /> : null}
      </AbsoluteFill>
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </Fundo>
  );
};

export const MidiaCena: React.FC<{ cena: CenaMidia }> = ({ cena }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const u = useU();
  if (cena._existe === false) return <Animatic id={cena.id} arquivo={cena.arquivo} prompt={cena._prompt} />;
  const p = interpolate(f, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const veu = cena.veu ?? (cena.titulo ? 0.45 : 0);
  return (
    <Fundo>
      <AbsoluteFill style={{ transform: transformDoMovimento(cena.movimento ?? "zoom-in", p) }}>
        <Midia arquivo={cena.arquivo} inicio={cena.inicio} />
      </AbsoluteFill>
      {veu > 0 ? <AbsoluteFill style={{ backgroundColor: cores.papel, opacity: veu }} /> : null}
      {cena.titulo ? (
        <AbsoluteFill style={{ justifyContent: "center", padding: `0 ${72 * u}px` }}>
          <TituloAnimado linhas={cena.titulo.split("\n")} tamanho={130} />
        </AbsoluteFill>
      ) : null}
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </Fundo>
  );
};

/** Tela real do produto numa moldura fina, com aproximação opcional numa região.
 * 9:16: título em cima, tela embaixo. 16:9: título numa coluna à esquerda, tela à direita. */
export const Tela: React.FC<{ cena: CenaTela }> = ({ cena }) => {
  const f = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const u = useU();
  if (cena._existe === false) return <Animatic id={cena.id} arquivo={cena.arquivo} prompt={cena._prompt} />;
  const entrada = spring({ frame: f - 3, fps, config: { damping: 200 } });
  const foco = cena.foco;
  const p = interpolate(f, [fps * 0.5, durationInFrames - fps * 0.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const escala = foco ? 1 + (foco.escala - 1) * p : 1;
  const origem = foco ? `${foco.x * 100}% ${foco.y * 100}%` : "50% 50%";
  const vertical = height > width;
  const margem = (vertical ? 56 : 100) * u;
  const moldura = (
    <div
      style={{
        flex: vertical ? "0 0 auto" : 1,
        maxHeight: "100%",
        overflow: "hidden",
        border: `${1 * u}px solid ${cores.fio}`,
        background: cores.papel,
        opacity: entrada,
        transform: `translateY(${(1 - entrada) * 40 * u}px)`,
      }}
    >
      <div style={{ width: "100%", transform: `scale(${escala})`, transformOrigin: origem }}>
        <Midia arquivo={cena.arquivo} estilo={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    </div>
  );
  const titulo = cena.titulo ? (
    <TituloAnimado linhas={cena.titulo.split("\n")} tamanho={vertical ? 100 : 96} />
  ) : null;
  return (
    <Fundo>
      <AbsoluteFill
        style={{
          padding: margem,
          paddingTop: vertical && titulo ? 150 * u : margem,
          paddingBottom: cena.legenda ? 220 * u : margem,
          flexDirection: vertical ? "column" : "row",
          gap: (vertical ? 56 : 80) * u,
          alignItems: vertical ? "stretch" : "center",
          justifyContent: "center",
        }}
      >
        {titulo ? <div style={{ flex: vertical ? undefined : "0 0 30%" }}>{titulo}</div> : null}
        {moldura}
      </AbsoluteFill>
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </Fundo>
  );
};

export const EtiquetaCena: React.FC<{ cena: CenaEtiqueta }> = ({ cena }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const queda = spring({ frame: f - 4, fps, config: { damping: 11, mass: 0.7 } });
  return (
    <Fundo>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 64 * u, flexDirection: "column" }}>
        {cena.titulo ? <TituloAnimado linhas={cena.titulo.split("\n")} tamanho={110} alinhar="center" /> : null}
        <div style={{ transform: `translateY(${(1 - queda) * -500 * u}px) rotate(${(1 - queda) * -12}deg)` }}>
          <Etiqueta codigo={cena.codigo} rotulo={cena.rotulo} escala={1.6} />
        </div>
      </AbsoluteFill>
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </Fundo>
  );
};

export const Marca: React.FC<{ cena: CenaMarca }> = ({ cena }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const entrada = spring({ frame: f, fps, config: { damping: 200 } });
  const chamada = interpolate(f, [fps * 0.9, fps * 1.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Fundo>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 * u, opacity: entrada }}>
          <Logo tamanho={170 * u} />
          <div
            style={{
              fontFamily: fontes.display,
              fontWeight: 900,
              fontSize: 200 * u,
              lineHeight: 0.84,
              color: cores.tintaForte,
              textTransform: "uppercase",
              transform: `translateX(${(1 - entrada) * 40 * u}px)`,
            }}
          >
            WavBox
          </div>
        </div>
        {cena.sub ? <Sub texto={cena.sub} atraso={12} /> : null}
        {cena.chamada ? (
          <div
            style={{
              marginTop: 80 * u,
              padding: `${18 * u}px ${34 * u}px`,
              border: `${1.5 * u}px solid ${cores.borda}`,
              fontFamily: fontes.display,
              fontWeight: 800,
              fontSize: 40 * u,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: cores.tintaForte,
              opacity: chamada,
            }}
          >
            {cena.chamada}
          </div>
        ) : null}
      </AbsoluteFill>
    </Fundo>
  );
};
