import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cores, fontes } from "../tema";

/** Unidade relativa: 1 u = 1 px num quadro de 1080 de lado menor. */
export const useU = () => {
  const { width, height } = useVideoConfig();
  return Math.min(width, height) / 1080;
};

export const Fundo: React.FC<{ children?: React.ReactNode; cor?: string }> = ({ children, cor = cores.papel }) => (
  <AbsoluteFill style={{ backgroundColor: cor }}>{children}</AbsoluteFill>
);

/** Rótulo de ficha no rodapé: fio de região em cima, label em caixa alta. */
export const Legenda: React.FC<{ texto: string; atraso?: number }> = ({ texto, atraso = 6 }) => {
  const f = useCurrentFrame();
  const u = useU();
  const largura = interpolate(f - atraso, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const opacidade = interpolate(f - atraso, [6, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 64 * u, right: 64 * u, bottom: 96 * u }}>
      <div style={{ height: 1.5 * u, background: cores.borda, width: `${largura * 100}%` }} />
      <div
        style={{
          marginTop: 18 * u,
          fontFamily: fontes.label,
          fontWeight: 600,
          fontSize: 30 * u,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cores.tintaForte,
          opacity: opacidade,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

/** Texto grande em caixa alta condensada, uma linha por vez, subindo de trás de uma máscara. */
export const TituloAnimado: React.FC<{
  linhas: string[];
  tamanho?: number;
  cor?: string;
  intervalo?: number;
  alinhar?: "left" | "center";
}> = ({ linhas, tamanho = 150, cor = cores.tintaForte, intervalo = 5, alinhar = "left" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const u = useU();
  return (
    <div style={{ textAlign: alinhar }}>
      {linhas.map((linha, i) => {
        const p = spring({ frame: f - i * intervalo, fps, config: { damping: 200, mass: 0.6 } });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 4 * u }}>
            <div
              style={{
                fontFamily: fontes.display,
                fontWeight: 900,
                fontSize: tamanho * u,
                lineHeight: 0.84,
                letterSpacing: "-0.012em",
                textTransform: "uppercase",
                color: cor,
                transform: `translateY(${(1 - p) * 105}%)`,
              }}
            >
              {linha}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Subtítulo em label, abaixo do título (nunca acima: The Subtitle Below Rule). */
export const Sub: React.FC<{ texto: string; atraso?: number }> = ({ texto, atraso = 10 }) => {
  const f = useCurrentFrame();
  const u = useU();
  const o = interpolate(f - atraso, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        marginTop: 34 * u,
        fontFamily: fontes.label,
        fontWeight: 600,
        fontSize: 38 * u,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: cores.calada,
        opacity: o,
        transform: `translateY(${(1 - o) * 12 * u}px)`,
      }}
    >
      {texto}
    </div>
  );
};

/** Listra diagonal tinta/papel: só onde algo pode dar errado. */
export const Listra: React.FC<{ opacidade?: number }> = ({ opacidade = 0.16 }) => {
  const f = useCurrentFrame();
  const u = useU();
  const passo = 28 * u;
  // Faixa maior que o quadro, deslizando por translate: sem emenda na borda.
  const periodo = passo * Math.SQRT2;
  const desloc = (f * 1.2 * u) % periodo;
  return (
    <AbsoluteFill style={{ opacity: opacidade, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: -2 * periodo,
          transform: `translateX(${desloc}px)`,
          backgroundImage: `repeating-linear-gradient(-45deg, ${cores.tintaForte} 0 ${passo / 2}px, transparent ${passo / 2}px ${passo}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Etiqueta de lacre: fundo laranja, furo de papel, −3°, raio 6. A assinatura da marca. */
export const Etiqueta: React.FC<{ codigo: string; rotulo?: string; escala?: number }> = ({ codigo, rotulo, escala = 1 }) => {
  const u = useU() * escala;
  return (
    <div
      style={{
        display: "inline-block",
        background: cores.lacre,
        borderRadius: 6 * u,
        padding: `${30 * u}px ${44 * u}px ${24 * u}px`,
        transform: "rotate(-3deg)",
        position: "relative",
        minWidth: 300 * u,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 12 * u,
          left: "50%",
          width: 16 * u,
          height: 16 * u,
          marginLeft: -8 * u,
          borderRadius: "50%",
          background: cores.papel,
        }}
      />
      {rotulo ? (
        <div
          style={{
            marginTop: 10 * u,
            fontFamily: fontes.label,
            fontWeight: 600,
            fontSize: 22 * u,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: cores.sobreLacre,
          }}
        >
          {rotulo}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: fontes.display,
          fontWeight: 900,
          fontSize: 92 * u,
          lineHeight: 0.9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cores.sobreLacre,
          marginTop: 8 * u,
        }}
      >
        {codigo}
      </div>
    </div>
  );
};

/** Ícone do WavBox: selo de lacre com as quatro barras de onda (web/src/components/WavBoxLogo.tsx). */
export const Logo: React.FC<{ tamanho: number; animar?: boolean }> = ({ tamanho, animar = true }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const barras = [
    { x: 4, y: 8, h: 4 },
    { x: 7.5, y: 5, h: 10 },
    { x: 11, y: 3, h: 14 },
    { x: 14.5, y: 6.5, h: 7 },
  ];
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho}>
      <rect width="20" height="20" fill={cores.lacre} />
      {barras.map((b, i) => {
        const p = animar ? spring({ frame: f - 4 - i * 3, fps, config: { damping: 12, mass: 0.5 } }) : 1;
        const h = b.h * p;
        return <rect key={i} x={b.x} y={10 - h / 2} width="2" height={h} fill={cores.sobreLacre} />;
      })}
    </svg>
  );
};
