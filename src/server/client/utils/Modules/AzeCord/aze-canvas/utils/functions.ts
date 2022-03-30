import { Canvas } from "canvas";

export const formatVariable = (prefix: any, variable: string) => {
  const formattedVariable = variable
    .toLowerCase()
    .split("-")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.substr(1, word.length).toLowerCase()
    )
    .join("");
  return prefix + formattedVariable;
};

export const applyText = (
  canvas: Canvas,
  text: any,
  defaultFontSize: number,
  width: number,
  font: any
) => {
  const ctx = canvas.getContext("2d");
  do {
    ctx.font = `${(defaultFontSize -= 1)}px ${font}`;
  } while (ctx.measureText(text).width > width);
  return ctx.font;
};
