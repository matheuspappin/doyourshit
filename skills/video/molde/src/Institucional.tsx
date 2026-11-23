import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import type { Cena, Roteiro, Transicao } from "./roteiro";
import { quadrosDasCenas, segundosDaTransicao, transicaoDaCena } from "./roteiro";
import { EtiquetaCena, Marca, MidiaCena, Tela, Titulo } from "./cenas/Cenas";
import { Ficha, Onda } from "./cenas/Grafismos";
import { cores } from "./tema";

const CenaPorTipo: React.FC<{ cena: Cena }> = ({ cena }) => {
  switch (cena.tipo) {
    case "titulo":
      return <Titulo cena={cena} />;
    case "video":
    case "imagem":
      return <MidiaCena cena={cena} />;
    case "tela":
      return <Tela cena={cena} />;
    case "etiqueta":
      return <EtiquetaCena cena={cena} />;
    case "marca":
      return <Marca cena={cena} />;
    case "ficha":
      return <Ficha cena={cena} />;
    case "onda":
      return <Onda cena={cena} />;
  }
};

/** Clarão curto em tinta forte na entrada da cena (transição "flash", sem sobreposição). */
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4], [0.85, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: cores.tintaForte, opacity: o, pointerEvents: "none" }} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apresentacao = (tipo: Transicao): TransitionPresentation<any> | null => {
  switch (tipo) {
    case "fade":
      return fade();
    case "slide":
      return slide({ direction: "from-right" });
    case "wipe":
      return wipe({ direction: "from-left" });
    default:
      return null;
  }
};

export const Institucional: React.FC<Roteiro> = (roteiro) => {
  const { fps } = useVideoConfig();
  const quadrosTransicao = Math.round(segundosDaTransicao(roteiro) * fps);
  const trilha = roteiro.trilha;

  const quadros = quadrosDasCenas(roteiro);
  const itens: React.ReactNode[] = [];
  roteiro.cenas.forEach((cena, i) => {
    const tipo = transicaoDaCena(cena, roteiro);
    const efeito = i > 0 ? apresentacao(tipo) : null;
    if (efeito) {
      itens.push(
        <TransitionSeries.Transition
          key={`t-${cena.id}`}
          presentation={efeito}
          timing={linearTiming({ durationInFrames: quadrosTransicao })}
        />,
      );
    }
    itens.push(
      <TransitionSeries.Sequence key={cena.id} durationInFrames={quadros[i]}>
        <CenaPorTipo cena={cena} />
        {i > 0 && tipo === "flash" ? <Flash /> : null}
      </TransitionSeries.Sequence>,
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: cores.papel }}>
      <TransitionSeries>{itens}</TransitionSeries>
      {trilha && trilha._existe !== false ? (
        <Sequence>
          <Audio
            src={staticFile(trilha.arquivo)}
            volume={trilha.volume ?? 1}
            trimBefore={Math.round((trilha.inicio ?? 0) * fps)}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
