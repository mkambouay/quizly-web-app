"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";

type Props = {};

const data = [
  {
    text: "hey",
    value: 3,
  },
  {
    text: "derecho de familia",
    value: 10,
  },
  {
    text: "procesos psicologicos",
    value: 15,
  },
  {
    text: "hola",
    value: 3,
  },
  {
    text: "react.js",
    value: 7,
  },
];

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const WordCloud = dynamic(() => import("react-d3-cloud"), {
  ssr: false, // Disable SSR for this component
});

const CustomWordCloud = (props: Props) => {
  const { theme } = useTheme();
  return (
    <>
      <WordCloud
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme == "dark" ? "white" : "black"}
        data={data}
      ></WordCloud>
    </>
  );
};

export default CustomWordCloud;
