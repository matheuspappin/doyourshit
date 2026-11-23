import React from "react";
import { AbsoluteFill } from "remotion";
import { cores, fontes } from "../tema";
import { useU } from "./base";

/**
 * Cartão que ocupa o lugar de uma mídia que ainda não existe. Com ele o roteiro
 * inteiro vira um animatic de custo zero, aprovado antes de gastar no Higgsfield.
 */
export const Animatic: React.FC<{ id: string; arquivo: string; prompt?: string }> = ({ id, arquivo, prompt }) => {
  const u = useU();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: cores.elevado,
        padding: 72 * u,
        justifyContent: "center",
        border: `${1.5 * u}px dashed ${cores.borda}`,
      }}
    >
      <div
        style={{
          fontFamily: fontes.display,
          fontWeight: 900,
          fontSize: 64 * u,
          textTransform: "uppercase",
          color: cores.tintaForte,
          lineHeight: 0.9,
        }}
      >
        Cena {id}
      </div>
      <div
        style={{
          marginTop: 16 * u,
          fontFamily: fontes.label,
          fontWeight: 600,
          fontSize: 22 * u,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: cores.calada,
        }}
      >
        Falta {arquivo}
      </div>
      {prompt ? (
        <div
          style={{
            marginTop: 36 * u,
            fontFamily: fontes.corpo,
            fontSize: 30 * u,
            lineHeight: 1.45,
            color: cores.tinta,
            maxWidth: 900 * u,
          }}
        >
          {prompt}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
