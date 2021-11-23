import { NodeCanvasRenderingContext2D } from "canvas";
export default (ctx: NodeCanvasRenderingContext2D, w: number, h: number) => {
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, h / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  return ctx;
};
