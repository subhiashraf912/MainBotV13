import { fillTextWithTwemoji } from "node-canvas-with-twemoji-and-discord-emoji";
import { NodeCanvasRenderingContext2D } from "canvas";
export default async (
  ctx: NodeCanvasRenderingContext2D,
  message: string,
  x: number,
  y: number
) => {
  return await fillTextWithTwemoji(ctx, message, x, y);
}
