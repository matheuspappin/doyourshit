import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cores, fontes } from "../tema";
import type { CenaFicha, CenaOnda } from "../roteiro";
import { Fundo, Legenda, TituloAnimado, useU } from "../componentes/base";

// Cenas feitas só de grafismo da marca: substituem a mídia gerada quando ela não existe
// e mostram o produto do jeito do DESIGN.md (ficha técnica, onda com pinos, lacre no ativo).

const useVertical = () => {
  const { width, height } = useVideoConfig();
  return height > width;
};

/** Ficha técnica: rótulo em label calado, valor em condensada forte, linhas em zebra, uma por vez. */
export const Ficha: React.FC<{ cena: CenaFicha }> = ({ cena }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  const vertical = useVertical();
  const atrasoLinhas = cena.titulo ? 10 : 2;
  const passo = Math.max(3, Math.round(fps * 0.18));
  return (
    <Fundo>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: `0 ${(vertical ? 64 : 140) * u}px`,
          flexDirection: vertical ? "column" : "row",
          alignItems: vertical ? "stretch" : "center",
          gap: (vertical ? 70 : 110) * u,
        }}
      >
        {cena.titulo ? (
          <div style={{ flex: vertical ? undefined : "0 0 34%" }}>
            <TituloAnimado linhas={cena.titulo.split("\n")} tamanho={vertical ? 120 : 112} />
          </div>
        ) : null}
        <div style={{ flex: vertical ? undefined : 1 }}>
          {cena.linhas.map((linha, i) => {
            const p = spring({ frame: f - atrasoLinhas - i * passo, fps, config: { damping: 200 } });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 36 * u,
                  padding: `${(vertical ? 26 : 22) * u}px ${24 * u}px`,
                  background: i % 2 === 0 ? cores.elevado : "transparent",
                  opacity: p,
                  transform: `translateX(${(1 - p) * -40 * u}px)`,
                }}
              >
                <div
                  style={{
                    flex: `0 0 ${(vertical ? 230 : 220) * u}px`,
                    fontFamily: fontes.label,
                    fontWeight: 600,
                    fontSize: (vertical ? 26 : 24) * u,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: cores.calada,
                  }}
                >
                  {linha.rotulo}
                </div>
                <div
                  style={{
                    fontFamily: fontes.display,
                    fontWeight: 800,
                    fontSize: (vertical ? 44 : 46) * u,
                    lineHeight: 1,
                    color: cores.tintaForte,
                  }}
                >
                  {linha.valor}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </Fundo>
  );
};

/** Altura determinística de cada barra (sem Math.random: o render é quadro a quadro). */
const alturaDaBarra = (i: number, n: number) => {
  const x = i / n;
  const corpo = 0.55 + 0.35 * Math.sin(Math.PI * x) ** 0.6;
  const textura = 0.12 * Math.sin(i * 1.7) + 0.08 * Math.sin(i * 4.3 + 1) + 0.05 * Math.sin(i * 9.1 + 2);
  return Math.min(1, Math.max(0.2, corpo + textura));
};

/**
 * Onda do WavBox web: barras em tinta (tocado) sobre calada (não tocado), cursor em lacre
 * andando, pinos quadrados no tempo de cada comentário e o comentário abrindo quando o cursor chega.
 */
export const Onda: React.FC<{ cena: CenaOnda }> = ({ cena }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const u = useU();
  const vertical = height > width;
  const n = vertical ? 46 : 84;
  const larguraOnda = width - (vertical ? 128 : 280) * u;
  const alturaOnda = (vertical ? 260 : 240) * u;
  const entrada = (i: number) =>
    spring({ frame: f - 6 - i * 0.35, fps, config: { damping: 18, mass: 0.5 } });
  const cursor = interpolate(f, [fps * 0.6, durationInFrames - fps * 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  // Comentário ativo: o último pino que o cursor já passou.
  const passados = cena.comentarios.filter((k) => cursor >= k.posicao);
  const ativo = passados[passados.length - 1];
  const idxAtivo = ativo ? cena.comentarios.indexOf(ativo) : -1;
  const quadroDoPino = (pos: number) => fps * 0.6 + pos * (durationInFrames - fps * 0.9);
  const abre = ativo ? spring({ frame: f - quadroDoPino(ativo.posicao), fps, config: { damping: 200 } }) : 0;
  const barra = larguraOnda / n;

  return (
    <Fundo>
      <AbsoluteFill
        style={{
          padding: `0 ${(vertical ? 64 : 140) * u}px`,
          justifyContent: "center",
          gap: (vertical ? 70 : 54) * u,
        }}
      >
        {cena.titulo ? <TituloAnimado linhas={cena.titulo.split("\n")} tamanho={vertical ? 110 : 96} /> : null}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 18 * u,
              fontFamily: fontes.label,
              fontWeight: 600,
              fontSize: 24 * u,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: cores.calada,
            }}
          >
            <span>{cena.versao ?? "Forma de onda"}</span>
            <span>{cena.comentarios.length} comentários</span>
          </div>
          <div style={{ position: "relative", width: larguraOnda, height: alturaOnda + 40 * u }}>
            {Array.from({ length: n }, (_, i) => {
              const h = alturaDaBarra(i, n) * alturaOnda * entrada(i);
              const tocado = i / n <= cursor;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: i * barra,
                    top: (alturaOnda - h) / 2,
                    width: barra * 0.62,
                    height: h,
                    background: tocado ? cores.tintaForte : cores.fantasma,
                  }}
                />
              );
            })}
            {/* cursor em lacre */}
            <div
              style={{
                position: "absolute",
                left: cursor * larguraOnda,
                top: -10 * u,
                width: 4 * u,
                height: alturaOnda + 20 * u,
                background: cores.lacre,
              }}
            />
            {/* pinos dos comentários */}
            {cena.comentarios.map((k, i) => {
              const aceso = i === idxAtivo;
              const lado = 16 * u;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: k.posicao * larguraOnda - lado / 2,
                    top: alturaOnda + 14 * u,
                    width: lado,
                    height: lado,
                    background: aceso ? cores.lacre : "transparent",
                    border: `${2 * u}px solid ${aceso ? cores.lacre : cores.tintaForte}`,
                  }}
                />
              );
            })}
          </div>
          {/* comentário que o cursor alcançou */}
          <div style={{ height: (vertical ? 210 : 150) * u, marginTop: 28 * u }}>
            {ativo ? (
              <div
                style={{
                  background: cores.elevado,
                  padding: `${24 * u}px ${30 * u}px`,
                  opacity: abre,
                  transform: `translateY(${(1 - abre) * 16 * u}px)`,
                  display: "flex",
                  gap: 28 * u,
                  alignItems: "baseline",
                }}
              >
                <div style={{ fontFamily: fontes.display, fontWeight: 800, fontSize: 40 * u, color: cores.tintaForte }}>
                  {ativo.tempo}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: fontes.label,
                      fontWeight: 600,
                      fontSize: 22 * u,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: cores.calada,
                    }}
                  >
                    {ativo.tag}
                  </div>
                  <div style={{ marginTop: 8 * u, fontFamily: fontes.corpo, fontSize: 34 * u, lineHeight: 1.35, color: cores.tinta }}>
                    {ativo.texto}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
      {cena.legenda ? <Legenda texto={cena.legenda} /> : null}
    </Fundo>
  );
};
