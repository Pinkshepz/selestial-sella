"use-client";

import React, { useState, memo } from "react";

const CloudNine = memo(function CloudNine ({
  text
}: {
  text: string
}) {
  const [revealed, setRevealed] = useState(false);
  const cloudCover: React.ReactNode[] = [];
  const cloudCount = (text.length > 2) ? text.length * 2 : (text.length > 1) ? 3 : 2;

  for (let index = 0; index < cloudCount - 1; index++) {
    const cloudSize = 24 - (6 * Math.random());

    cloudCover.push(
      <div key={index}
        className={`absolute rounded-full bg-slate-500/30 dark:bg-white/90 z-100 ${{0: "animate-cloud-a", 1: "animate-cloud-b", 2:"animate-cloud-c"}[index % 3]}`}
        style={{
          left: `calc(${index * 100 / cloudCount}% - 6px)`,
          top: `calc(10px - ${cloudSize / 2}px)`,
          height: `${cloudSize}px`, width: `${cloudSize}px`}}></div>
    );
  }

  return (
    <span onClick={() => setRevealed((prev) => (!prev))}
      className="relative mx-1 -border-b -hover-bg-active rounded-md cursor-pointer">
      {!revealed && cloudCover}
      {revealed ? <span key={1} className="z-0 px-1">{text}</span> : <span key={0} className="z-0 px-1 text-pri/0">{text}</span>}
    </span>
  );
})

export const parseToHTML = (inputText: string) => {
  return inputText.split(/(⟪[^⟫]+⟫|❬[^❭]+❭|【[^❭]+】|⎨[^⎬]+⎬)/g).map((part, indexPart) => {
    if (part.startsWith("⟪") && part.endsWith("⟫")) {
      return <strong className="font-black" key={indexPart}>{part.slice(1, -1)}</strong>;
    } else if (part.startsWith("【") && part.endsWith("】")) {
      return <strong className="rounded-lg bg-amber-dark/30 px-1" key={indexPart}>{part.slice(1, -1)}</strong>;
    } else if (part.startsWith("❬") && part.endsWith("❭")) {
      return <span className="italic font-light" key={indexPart}>{part.slice(1, -1)}</span>;
    } else if (part.startsWith("⎨") && part.endsWith("⎬")) {
      return <span key={indexPart}><CloudNine text={part.slice(1, -1)} /></span>
    } else {
      return <span className="font-medium" key={indexPart}>{part}</span>;
    }
  });
}

export const removeSpecialCharacter = (inputText: string) => {
  return inputText.split(/(⟪[^⟫]+⟫|❬[^❭]+❭|【[^❭]+】|⎨[^⎬]+⎬|\\n)/g).map((part, indexPart) => {
    if (part.startsWith("⟪") && part.endsWith("⟫")) {
      return <span key={indexPart}>{part.slice(1, -1)}</span>;
    } else if (part.startsWith("【") && part.endsWith("】")) {
      return <span key={indexPart}>{part.slice(1, -1)}</span>;
    } else if (part.startsWith("❬") && part.endsWith("❭")) {
      return <span key={indexPart}>{part.slice(1, -1)}</span>;
    } else if (part.startsWith("⎨") && part.endsWith("⎬")) {
      return <span className="px-1 -hover-bg-active rounded-lg" key={indexPart}>...</span>;
    } else {
      return <span className="font-medium" key={indexPart}>{part}</span>;
    }
  });
}

export default function AuricleText ({
  inputText
}: {
  inputText: string
}): React.ReactNode {
    let processedParagraphs: React.ReactNode[] = [];

    try {
      inputText.split("\\n").map((paragraph, indexParagraph) => {
        processedParagraphs.push(
            <div key={indexParagraph}>
                {parseToHTML(paragraph)}
            </div>
          );
      });
    } catch (error) {
      console.error(error);
      return <div className="flex flex-col gap-4">{processedParagraphs}</div>;
    }

    return <div className="flex flex-col gap-4">{processedParagraphs}</div>;
};

export function UnformattedAuricleText ({
  inputText
}: {
  inputText: string
}): React.ReactNode {
    return <div>{removeSpecialCharacter(inputText.replace("\\n", ""))}</div>;
};
