import moment from "moment";
import abbrev from "../plugins/abbrev";
import renderEmoji from "../plugins/renderEmoji";
import momentDurationFormatSetup from "moment-duration-format";
import { NodeCanvasRenderingContext2D } from "canvas";
momentDurationFormatSetup(moment as any);

class Util {
  constructor() {
    throw new Error(
      `The ${this.constructor.name} class may not be instantiated!`
    );
  }

  static validateHex(hex: string) {
    if (!hex || typeof hex !== "string") return false;
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  }

  static discordTime(time = new Date()) {
    let date = time && time instanceof Date ? time : new Date();
    let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `Today at ${hours}:${minutes}`;
  }

  static formatTime(time: moment.DurationInputArg1) {
    if (!time) return "00:00";
    const fmt = moment.duration(time).format("dd:hh:mm:ss");

    const chunk = fmt.split(":");
    if (chunk.length < 2) chunk.unshift("00");
    return chunk.join(":");
  }

  static shorten(text: string, len: number | undefined) {
    if (typeof text !== "string") return "";
    if (text.length <= (len as number)) return text;
    return text.substr(0, len).trim() + "...";
  }

  static toAbbrev(num: any) {
    return abbrev(num);
  }

  static renderEmoji(
    ctx: NodeCanvasRenderingContext2D,
    msg: string,
    x: number,
    y: number
  ) {
    return renderEmoji(ctx, msg, x, y);
  }

  static formatHex(hex: string | any[], alt = "#000000") {
    if (!hex || typeof hex !== "string") return alt || "#000000";
    hex = hex.replaceAll("#", "");
    if (hex.length === 3)
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return alt || "#000000";

    return `#${hex}`;
  }

  static invertColor(hex: string | any[]) {
    if (!hex || typeof hex !== "string") return "#FFFFFF";
    hex = hex.replaceAll("#", "");

    // match hex color
    if (hex.length === 3)
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return "#FFFFFF";

    // invert colors
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
    const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
    const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

    // return new hex
    const pad = (txt: string, length: number | undefined) => {
      length = length || 2;
      let arr = [length].join("0");
      return (arr + txt).slice(-length);
    }

    const finalHex = `#${pad(r, undefined)}${pad(g, undefined)}${pad(
      b,
      undefined
    )}`;
    return finalHex;
  }

  static getAcronym(name: string) {
    if (!name || typeof name !== "string") return "";
    return name
      .replaceAll(/'s /g, " ")
      .replaceAll(/\w+/g, (e) => e[0])
      .replaceAll(/\s/g, "");
  }

  static getLines(
    text: string,
    ctx: NodeCanvasRenderingContext2D,
    maxWidth: number
  ) {
    if (!text) return [];
    if (!ctx) throw new Error("Canvas context was not provided!");
    if (!maxWidth) throw new Error("No max-width provided!");
    const lines = [];

    while (text.length) {
      let i;
      for (
        i = text.length;
        ctx.measureText(text.substr(0, i)).width > maxWidth;
        i -= 1
      );
      const result = text.substr(0, i);
      let j;
      if (i !== text.length)
        for (
          j = 0;
          result.indexOf(" ", j) !== -1;
          j = result.indexOf(" ", j) + 1
        );
      lines.push(result.substr(0, j || result.length));
      text = text.substr(lines[lines.length - 1].length, text.length);
    }

    return lines;
  }
}

export default Util;
