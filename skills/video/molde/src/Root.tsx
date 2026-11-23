import React from "react";
import { Composition } from "remotion";
import { Institucional } from "./Institucional";
import { quadrosTotais, type Roteiro } from "./roteiro";
import exemplo from "../projetos/exemplo/roteiro.json";

// Uma composição só: o molde. Cada vídeo é um roteiro.json passado em --props
// e a pasta do projeto passada em --public-dir (ver scripts/render.mjs).
export const RemotionRoot: React.FC = () => (
  <Composition
    id="Institucional"
    component={Institucional as unknown as React.FC<Record<string, unknown>>}
    defaultProps={exemplo as unknown as Record<string, unknown>}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
    calculateMetadata={({ props }) => {
      const r = props as unknown as Roteiro;
      return {
        durationInFrames: quadrosTotais(r),
        fps: r.formato.fps,
        width: r.formato.largura,
        height: r.formato.altura,
      };
    }}
  />
);
