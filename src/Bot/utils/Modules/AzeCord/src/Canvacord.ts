import Trigger from "../libs/Trigger";
import Greyscale from "../libs/Greyscale";
import Invert from "../libs/Invert";
import Sepia from "../libs/Sepia";
import assets from "./Assets";
import fs from "fs";
import Brightness from "../libs/Brightness";
import Threshold from "../libs/Threshold";
import Convolute from "../libs/Convolute";
import rect from "../plugins/rect";
import Canvas from "canvas";
import Darkness from "../libs/Darkness";
import circle from "../plugins/circle";
import round from "../plugins/round";
import Util from "./Util";

class Canvacord {
  constructor() {
    throw new Error(
      `The ${this.constructor.name} class may not be instantiated!`
    );
  }

  static async trigger(image: string | Buffer) {
    if (!image) throw new Error("Expected image, received nothing!");
    await Canvacord.__wait(undefined);
    return await Trigger(image, assets("IMAGE").TRIGGERED);
  }

  static async invert(image: string | Buffer) {
    if (!image) throw new Error("Expected image, received nothing!");
    return await Invert(image);
  }

  static async sepia(image: string | Buffer) {
    if (!image) throw new Error("Expected image, received nothing!");
    return await Sepia(image);
  }

  static async greyscale(image: string | Buffer) {
    if (!image) throw new Error("Expected image, received nothing!");
    return await Greyscale(image);
  }

  static async brightness(image: string | Buffer, amount: number) {
    if (!image) throw new Error("Expected image, received nothing!");
    if (isNaN(amount)) throw new Error("Amount must be a number!");
    return await Brightness(image, amount);
  }

  static async darkness(image: string | Buffer, amount: number) {
    if (!image) throw new Error("Expected image, received nothing!");
    if (isNaN(amount)) throw new Error("Amount must be a number!");
    return await Darkness(image, amount);
  }

  static async threshold(img: string | Buffer, amount: number) {
    if (!img) throw new Error("Expected image, received nothing!");
    if (isNaN(amount)) throw new Error("Amount must be a number!");
    return await Threshold(img, amount);
  }

  static async convolute(img: string | Buffer, matrix: any[], opaque: boolean) {
    if (!img) throw new Error("Expected image, received nothing!");
    if (!Array.isArray(matrix))
      throw new Error("Convolution matrix must be Array.");
    return await Convolute(img, matrix, opaque);
  }

  static createProgressBar(
    track = {
      x: false,
      y: false,
      width: false,
      height: false,
      color: false,
      stroke: false,
      lineWidth: false,
    },
    bar = { width: false, color: false }
  ) {
    if (!track) throw new Error("Invalid track args!");
    if (!bar) throw new Error("Invalid progressbar args!");
    //@ts-expect-error
    const canvas = Canvas.createCanvas(track.width, track.height);
    const ctx = canvas.getContext("2d");

    if (bar.width > track.width) bar.width = track.width;
    //@ts-expect-error
    if (bar.width < 0) bar.width = 0;

    if (track.stroke) {
      //@ts-expect-error
      rect(ctx, track.x, track.y, track.height, bar.width, bar.color, false);
      rect(
        ctx,
        //@ts-expect-error
        track.x,
        track.y,
        track.height,
        track.width,
        track.color,
        track.stroke,
        track.lineWidth
      );
    } else {
      rect(
        ctx,
        //@ts-expect-error
        track.x,
        track.y,
        track.height,
        track.width,
        track.color,
        track.stroke,
        track.lineWidth
      );
      //@ts-expect-error
      rect(ctx, track.x, track.y, track.height, bar.width, bar.color, false);
    }

    return canvas.toBuffer();
  }

  static async blur(image: string | Buffer) {
    if (!image) throw new Error("Image was not provided!");
    const img = await Canvas.loadImage(image);
    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width / 4, canvas.height / 4);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width / 4,
      canvas.height / 4,
      0,
      0,
      canvas.width + 5,
      canvas.height + 5
    );

    return canvas.toBuffer();
  }

  static async pixelate(image: string | Buffer, pixels = 5) {
    if (!image) throw new Error("Image was not provided!");
    if (!pixels || typeof pixels !== "number") pixels = 100;
    if (pixels < 1) pixels = 100;
    if (pixels > 100) pixels = 100;

    const img = await Canvas.loadImage(image);
    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    const pixel = pixels / 100;

    ctx.drawImage(img, 0, 0, canvas.width * pixel, canvas.height * pixel);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      canvas,
      0,
      0,
      canvas.width * pixel,
      canvas.height * pixel,
      0,
      0,
      canvas.width + 5,
      canvas.height + 5
    );

    return canvas.toBuffer();
  }

  static async sharpen(image: string | Buffer, lvl = 1) {
    if (!image) throw new Error("Image was not provided!");
    return await Convolute(
      image,
      Canvacord.CONVOLUTION_MATRIX.SHARPEN,
      true,
      lvl
    );
  }

  static async burn(image: string | Buffer, lvl = 1) {
    if (!image) throw new Error("Image was not provided!");
    return await Convolute(image, Canvacord.CONVOLUTION_MATRIX.BURN, true, lvl);
  }

  static color(
    color = "#FFFFFF",
    displayHex = false,
    height = 1024,
    width = 1024
  ) {
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    rect(ctx, 0, 0, height, width, color);

    if (!!displayHex) {
      const ic = Util.invertColor(color);
      ctx.font = "bold 72px Manrope";
      ctx.fillStyle = ic;
      ctx.fillText(color.toUpperCase(), canvas.width / 3, canvas.height / 2);
    }

    return canvas.toBuffer();
  }

  static async circle(image: string | Buffer) {
    if (!image) throw new Error("Image was not provided!");
    const img = await Canvas.loadImage(image);
    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    circle(ctx, canvas.width, canvas.height);
    return canvas.toBuffer();
  }

  static rectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    stroke: any,
    lineWidth: number | undefined
  ) {
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    rect(ctx, x, y, canvas.height, canvas.width, color, !!stroke, lineWidth);
    round(ctx, x, y, canvas.width, canvas.height);
    return canvas.toBuffer();
  }

  static async fuse(image1: string | Buffer, image2: string | Buffer) {
    if (!image1) throw new Error("Missing parameter 'image1'!");
    if (!image2) throw new Error("Missing parameter 'image2'!");

    const img1 = await Canvas.loadImage(image1);
    const img2 = await Canvas.loadImage(image2);

    const canvas = Canvas.createCanvas(img1.width, img1.height);
    const ctx = canvas.getContext("2d");
    ctx.globalAlpha = 0.5;
    ctx.drawImage(img1, 0, 0);
    ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);

    return canvas.toBuffer();
  }

  static async resize(image: string | Buffer, width: number, height: number) {
    if (!image) throw new Error("Image was not provided!");
    const img = await Canvas.loadImage(image);
    const w = width && !isNaN(width) ? width : img.width;
    const h = height && !isNaN(height) ? width : img.height;
    const canvas = await Canvas.createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toBuffer();
  }

  static async kiss(image1: string | Buffer, image2: string | Buffer) {
    if (!image1) throw new Error("First image was not provided!");
    if (!image2) throw new Error("Second image was not provided!");
    await this.__wait(undefined);
    const canvas = Canvas.createCanvas(768, 574);
    const ctx = canvas.getContext("2d");
    const background = await Canvas.loadImage(Canvacord.assets("IMAGE").KISS);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(image1);
    const avatar1 = await Canvas.loadImage(image2);
    ctx.drawImage(avatar1, 370, 25, 200, 200);
    ctx.drawImage(avatar, 150, 25, 200, 200);
    return canvas.toBuffer();
  }

  static async spank(image1: string | Buffer, image2: string | Buffer) {
    if (!image1) throw new Error("First image was not provided!");
    if (!image2) throw new Error("Second image was not provided!");
    await this.__wait(undefined);
    const canvas = Canvas.createCanvas(500, 500);
    const ctx = canvas.getContext("2d");
    const background = await Canvas.loadImage(Canvacord.assets("IMAGE").SPANK);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(image1);
    const avatar1 = await Canvas.loadImage(image2);
    ctx.drawImage(avatar1, 350, 220, 120, 120);
    ctx.drawImage(avatar, 225, 5, 140, 140);
    return canvas.toBuffer();
  }

  static async registerFonts(fontArray = []) {
    if (!fontArray.length) {
      await Canvacord.__wait(undefined);
      // default fonts
      Canvas.registerFont(assets("FONT").MANROPE_BOLD, {
        family: "Manrope",
        weight: "bold",
        style: "normal",
      });

      Canvas.registerFont(assets("FONT").MANROPE_REGULAR, {
        family: "Manrope",
        weight: "regular",
        style: "normal",
      });

      Canvas.registerFont(assets("FONT").WHITNEY_MEDIUM, {
        family: "Whitney",
        weight: "regular",
        style: "normal",
      });

      Canvas.registerFont(assets("FONT").WHITNEY_BOOK, {
        family: "Whitney",
        weight: "bold",
        style: "normal",
      });

      Canvas.registerFont(assets("FONT").ROBOTO_LIGHT, {
        family: "Roboto",
        weight: "light",
        style: "normal",
      });

      Canvas.registerFont(assets("FONT").ROBOTO_REGULAR, {
        family: "Roboto",
        weight: "regular",
        style: "normal",
      });
      Canvas.registerFont(assets("FONT").NOTOSANS, {
        family: "NotoSans",
        weight: "regular",
        style: "normal",
      });
      Canvas.registerFont(assets("FONT").NOTOSANS, {
        family: "NotoSans",
        weight: "bold",
        style: "normal",
      });
      Canvas.registerFont(assets("FONT").NOTOSANS, {
        family: "NotoSans",
        weight: "light",
        style: "normal",
      });
    } else {
      fontArray.forEach((font) => {
        //@ts-expect-error
        Canvas.registerFont(font.path, font.face);
      });
    }

    return;
  }

  static async slap(image1: string | Buffer, image2: string | Buffer) {
    if (!image1) throw new Error("First image was not provided!");
    if (!image2) throw new Error("Second image was not provided!");
    await this.__wait(undefined);
    const canvas = Canvas.createCanvas(1000, 500);
    const ctx = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      Canvacord.assets("IMAGE").BATSLAP
    );
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    const avatar = await Canvas.loadImage(image1);
    const avatar1 = await Canvas.loadImage(image2);
    ctx.drawImage(avatar1, 580, 260, 200, 200);
    ctx.drawImage(avatar, 350, 70, 220, 220);
    return canvas.toBuffer();
  }

  static async beautiful(image: string | Buffer) {
    if (!image) throw new Error("Image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(image);
    const base = await Canvas.loadImage(Canvacord.assets("IMAGE").BEAUTIFUL);
    const canvas = Canvas.createCanvas(376, 400);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 258, 28, 84, 95);
    ctx.drawImage(img, 258, 229, 84, 95);

    return canvas.toBuffer();
  }

  static async facepalm(image: string | Buffer) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    let layer = await Canvas.loadImage(Canvacord.assets("IMAGE").FACEPALM);
    let canvas = Canvas.createCanvas(632, 357);
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 632, 357);
    let avatar = await Canvas.loadImage(image);
    ctx.drawImage(avatar, 199, 112, 235, 235);
    ctx.drawImage(layer, 0, 0, 632, 357);
    return canvas.toBuffer();
  }

  static async rainbow(image: string | Buffer) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    let bg = await Canvas.loadImage(Canvacord.assets("IMAGE").GAY);
    let img = await Canvas.loadImage(image);
    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    return canvas.toBuffer();
  }

  /**
   * "F" in the chat
   * @param {string|Buffer} image image source
   * @returns {Promise<Buffer>}
   */
  static async rip(image: string | Buffer) {
    if (!image) throw new Error("Image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(image);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").RIP);
    const canvas = Canvas.createCanvas(244, 253);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 63, 110, 90, 90);
    return canvas.toBuffer();
  }

  static async trash(image: any) {
    if (!image) throw new Error("Image was not provided!");
    await this.__wait(undefined);
    const blur = await Canvacord.blur(image);
    const img = await Canvas.loadImage(blur);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").TRASH);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(img, 309, 0, 309, 309);
    return canvas.toBuffer();
  }

  static async hitler(image: string | Buffer) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(image);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").HITLER);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(img, 46, 43, 140, 140);

    return canvas.toBuffer();
  }

  static async colorfy(
    image: string | Buffer,
    color: string | CanvasGradient | CanvasPattern
  ) {
    if (!image) throw new Error("Image was not provided!");
    const img = await Canvas.loadImage(image);
    const canvas = Canvas.createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    if (color) {
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    return canvas.toBuffer();
  }

  static async jokeOverHead(image: string | Buffer) {
    if (!image) throw new Error("Image wasn ot provided!");
    await this.__wait(undefined);
    const layer = await Canvas.loadImage(
      Canvacord.assets("IMAGE").JOKEOVERHEAD
    );
    const img = await Canvas.loadImage(image);
    const canvas = Canvas.createCanvas(425, 404);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 425, 404);
    ctx.drawImage(img, 125, 130, 140, 135);
    ctx.drawImage(layer, 0, 0, 425, 404);
    return canvas.toBuffer();
  }

  static async distracted(image1: any, image2: any, image3 = null) {
    if (!image1) throw new Error("First image was not provided!");
    if (!image2) throw new Error("Second image was not provided!");
    await this.__wait(undefined);
    const background = await Canvas.loadImage(
      Canvacord.assets("IMAGE").DISTRACTED
    );
    const avatar1 = await Canvas.loadImage(await Canvacord.circle(image1));
    const avatar2 = await Canvas.loadImage(await Canvacord.circle(image2));
    const avatar3 = image3
      ? await Canvas.loadImage(await Canvacord.circle(image3))
      : null;

    const canvas = Canvas.createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar1, 180, 90, 150, 150);
    ctx.drawImage(avatar2, 480, 35, 130, 130);
    if (avatar3) ctx.drawImage(avatar3, 730, 110, 130, 130);

    return canvas.toBuffer();
  }

  static async affect(image: string | Buffer) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(image);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").AFFECT);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(img, 180, 383, 200, 157);

    return canvas.toBuffer();
  }

  static async jail(image: string | Buffer, greyscale = false) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(
      greyscale ? await Canvacord.greyscale(image) : image
    );
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").JAIL);

    const canvas = Canvas.createCanvas(350, 350);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    return canvas.toBuffer();
  }

  static async bed(image1: string | Buffer, image2: string | Buffer) {
    if (!image1) throw new Error("First image was not provided!");
    if (!image2) throw new Error("Second image was not provided!");
    await this.__wait(undefined);
    const avatar = await Canvas.loadImage(image1);
    const avatar1 = await Canvas.loadImage(image2);
    const background = await Canvas.loadImage(Canvacord.assets("IMAGE").BED);

    const canvas = Canvas.createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(avatar, 25, 100, 100, 100);
    ctx.drawImage(avatar, 25, 300, 100, 100);
    ctx.drawImage(avatar, 53, 450, 70, 70);
    ctx.drawImage(avatar1, 53, 575, 100, 100);

    return canvas.toBuffer();
  }

  static async delete(image: string | Buffer, dark = false) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(image);
    const bg = await Canvas.loadImage(
      dark
        ? await Canvacord.invert(Canvacord.assets("IMAGE").DELETE)
        : Canvacord.assets("IMAGE").DELETE
    );

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 120, 135, 195, 195);

    return canvas.toBuffer();
  }

  static tictactoe(
    fill = { a1: 0, b1: 0, c1: 0, a2: 0, b2: 0, c2: 0, a3: 0, b3: 0, c3: 0 },
    color: any = { bg: 0, bar: 0, x: 0, o: 0 }
  ) {
    color = {
      bg: color.bg || "white",
      bar: color.bar || "black",
      x: color.x || "red",
      o: color.o || "blue",
    };

    const canvas = Canvas.createCanvas(2048, 2048);
    const ctx = canvas.getContext("2d");

    const drawO = (x: number, y: number) => {
      let halfSectionSize = 0.5 * 682;
      let centerX = x + halfSectionSize;
      let centerY = y + halfSectionSize;
      let radius = (682 - 100) / 2;
      let startAngle = 0 * Math.PI;
      let endAngle = 2 * Math.PI;

      ctx.lineWidth = 40;
      ctx.strokeStyle = color.o;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.stroke();
    };

    const drawX = (x: number, y: number) => {
      ctx.strokeStyle = color.x;
      ctx.lineWidth = 40;
      ctx.beginPath();
      let offset = 50;
      ctx.moveTo(x + offset, y + offset);
      ctx.lineTo(x + 682 - offset, y + 682 - offset);
      ctx.moveTo(x + offset, y + 682 - offset);
      ctx.lineTo(x + 682 - offset, y + offset);
      ctx.stroke();
    };

    const params = {
      a1: {
        x: 5,
        y: 5,
      },
      b1: {
        x: 682,
        y: 5,
      },
      c1: {
        x: 1364,
        y: 5,
      },
      a2: {
        x: 5,
        y: 682,
      },
      b2: {
        x: 682,
        y: 682,
      },
      c2: {
        x: 1364,
        y: 682,
      },
      a3: {
        x: 5,
        y: 1364,
      },
      b3: {
        x: 682,
        y: 1364,
      },
      c3: {
        x: 1364,
        y: 1364,
      },
    };

    // background
    ctx.fillStyle = color.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lines
    ctx.lineWidth = 30;
    ctx.lineCap = "round";
    ctx.strokeStyle = color.bar;
    ctx.beginPath();

    //Horizontal lines
    for (var y = 1; y <= 2; y++) {
      ctx.moveTo(4, y * 682);
      ctx.lineTo(2043, y * 682);
    }
    // Vertical lines
    for (var x = 1; x <= 2; x++) {
      ctx.moveTo(x * 682, 4);
      ctx.lineTo(x * 682, 2043);
    }

    ctx.stroke();

    // apply
    Object.keys(fill).forEach((x) => {
      //@ts-ignore
      if (!fill[x] || !["X", "O"].includes(fill[x])) return;
      //@ts-ignore
      const data = params[x];
      //@ts-ignore
      fill[x] === "X" ? drawX(data.x, data.y) : drawO(data.x, data.y);
    });

    return canvas.toBuffer();
  }

  static async opinion(avatar: string | Buffer, msg: any) {
    if (!avatar) throw new Error("Avatar was not provided!");
    if (!msg) throw new Error("Message was not provided!");
    await this.__wait(undefined);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").OPINION);
    const ava = await Canvas.loadImage(avatar);

    const canvas = Canvas.createCanvas(482, 481);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(ava, 62, 340, 85, 85);
    ctx.drawImage(ava, 260, 180, 70, 70);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 15px arial";
    ctx.fillStyle = "#000000";
    await Util.renderEmoji(
      ctx,
      Util.shorten(msg, 24),
      canvas.width / 10,
      canvas.height / 1.51
    );

    return canvas.toBuffer();
  }

  static gradient(colorFrom: string, colorTo: string, width: any, height: any) {
    if (!colorFrom) throw new Error("ColorFrom was not provided!");
    if (!colorTo) throw new Error("ColorTo was not provided!");

    const canvas = Canvas.createCanvas(width || 400, height || 200);
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

    gradient.addColorStop(0, colorFrom);
    gradient.addColorStop(1, colorTo);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return canvas.toBuffer();
  }

  static async ohno(message: any) {
    if (!message) throw new Error("Message was not provided!");
    await Canvacord.__wait(undefined);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").OHNO);
    const canvas = Canvas.createCanvas(1000, 1000);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 50px Times New Roman";
    ctx.fillStyle = "#000000";
    await Util.renderEmoji(ctx, Util.shorten(message, 20), 540, 195);

    return canvas.toBuffer();
  }

  static async changemymind(text: string | any[]) {
    if (!text) throw new Error("missing text!");
    await this.__wait(undefined);
    const base = await Canvas.loadImage(Canvacord.assets("IMAGE").CHANGEMYMIND);
    const canvas = Canvas.createCanvas(base.width, base.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(base, 0, 0, canvas.width, canvas.height);
    let x = text.length;
    let fontSize = 70;
    if (x <= 15) {
      ctx.translate(310, 365);
    } else if (x <= 30) {
      fontSize = 50;
      ctx.translate(315, 365);
    } else if (x <= 70) {
      fontSize = 40;
      ctx.translate(315, 365);
    } else if (x <= 85) {
      fontSize = 32;
      ctx.translate(315, 365);
    } else if (x < 100) {
      fontSize = 26;
      ctx.translate(315, 365);
    } else if (x < 120) {
      fontSize = 21;
      ctx.translate(315, 365);
    } else if (x < 180) {
      fontSize = 0.0032 * (x * x) - 0.878 * x + 80.545;
      ctx.translate(315, 365);
    } else if (x < 700) {
      fontSize = 0.0000168 * (x * x) - 0.0319 * x + 23.62;
      ctx.translate(310, 338);
    } else {
      fontSize = 7;
      ctx.translate(310, 335);
    }
    ctx.font = `${fontSize}px 'Arial'`;
    ctx.rotate(-0.39575);

    const lines = Util.getLines(text as string, ctx, 345);
    let i = 0;
    while (i < lines.length) {
      ctx.fillText(lines[i], 10, i * fontSize - 5);
      i++;
    }
    return canvas.toBuffer();
  }

  static async clyde(message: any) {
    if (!message) message = "Please provide text!";
    await this.__wait(undefined);
    let avatar = await Canvas.loadImage(
      await Canvacord.circle(Canvacord.assets("IMAGE").CLYDE)
    );
    let badge = await Canvas.loadImage(Canvacord.assets("IMAGE").BOTBADGE);
    Canvas.registerFont(Canvacord.assets("FONT").WHITNEY_MEDIUM, {
      family: "Whitney",
      weight: "regular",
      style: "normal",
    });

    Canvas.registerFont(Canvacord.assets("FONT").MANROPE_REGULAR, {
      family: "Manrope",
      weight: "regular",
      style: "normal",
    });

    const canvas = Canvas.createCanvas(1500, 300);

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#36393E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(avatar, 75, 30, 130, 130);
    ctx.drawImage(badge, 360, 45, 100, 40);

    ctx.font = "40px Manrope";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    await Util.renderEmoji(ctx, Util.shorten(message, 66), 230, 150);

    ctx.font = "50px Whitney";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "start";
    ctx.fillText("Clyde", 230, 80);

    ctx.font = "40px Whitney";
    ctx.fillStyle = "#7D7D7D";
    ctx.textAlign = "start";
    ctx.fillText(Util.discordTime(), 470, 80);

    ctx.font = "20px Manrope";
    ctx.fillStyle = "#7D7D7D";
    ctx.textAlign = "start";
    ctx.fillText("Only you can see this  —", 240, 190);

    ctx.font = "20px Manrope";
    ctx.fillStyle = "#2785C7";
    ctx.textAlign = "start";
    ctx.fillText(
      "delete this message.",
      240 + ctx.measureText("Only you can see this  —").width + 10,
      190
    );

    return canvas.toBuffer();
  }

  static async wanted(image: string | Buffer) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(image);
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").WANTED);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 145, 282, 447, 447);

    return canvas.toBuffer();
  }

  static async wasted(image: any) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(await Canvacord.greyscale(image));
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").WASTED);

    const canvas = Canvas.createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    return canvas.toBuffer();
  }

  static async youtube(
    ops = { username: null, content: null, avatar: null, dark: false }
  ) {
    if (!ops.username || typeof ops.username !== "string")
      throw new Error("Username may not be empty!");
    if (!ops.content || typeof ops.content !== "string")
      throw new Error("Content may not be empty!");
    if (!ops.avatar) throw new Error("Avatar source may not be empty!");
    ops.dark = !!ops.dark;

    await this.__wait(undefined);
    const bg = await Canvas.loadImage(
      !ops.dark
        ? Canvacord.assets("IMAGE").YOUTUBE
        : await Canvacord.invert(Canvacord.assets("IMAGE").YOUTUBE)
    );
    const avatar = await Canvas.loadImage(await Canvacord.circle(ops.avatar));

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, -3, -3, canvas.width + 6, canvas.height + 6);
    ctx.drawImage(avatar, 17, 33, 52, 52);

    let time: number | string = Math.floor(Math.random() * (59 - 1)) + 1;
    time = `${time + (time == 1 ? " minute" : " minutes")} ago`;

    const username = Util.shorten(ops.username, 21);
    const comment = Util.shorten(ops.content, 60);

    ctx.font = "20px Roboto";
    ctx.fillStyle = ops.dark ? "#FFFFFF" : "#000000";
    ctx.fillText(username, 92, 50);

    ctx.font = "16px Roboto";
    ctx.fillStyle = "#909090";
    ctx.fillText(time.toString(), ctx.measureText(username).width + 140, 50);

    ctx.font = "18px Roboto";
    ctx.fillStyle = ops.dark ? "#FFFFFF" : "#000000";
    await Util.renderEmoji(ctx, comment, 92, 80);

    return canvas.toBuffer();
  }

  static async shit(image: any) {
    if (!image) throw new Error("image was not provided!");
    await this.__wait(undefined);
    const img = await Canvas.loadImage(await Canvacord.circle(image));
    const bg = await Canvas.loadImage(Canvacord.assets("IMAGE").SHIT);

    const canvas = Canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 210, 700, 170, 170);

    return canvas.toBuffer();
  }

  static write(
    data: string | NodeJS.ArrayBufferView,
    name: fs.PathOrFileDescriptor
  ) {
    return fs.writeFileSync(name, data);
  }

  static async guildIcon(name: any, size = 1024) {
    const str = Util.getAcronym(name);
    if (!str) throw new Error("Couldn't parse acronym!");
    if (typeof size !== "number" || size < 0 || size > 4096 || size % 16 !== 0)
      throw new Error("Invalid icon size!");

    const canvas = Canvas.createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#7289DA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${size / 4}px Whitney`;
    await Util.renderEmoji(ctx, str, canvas.width / 4, canvas.height / 1.7);

    return canvas.toBuffer();
  }

  static get assets() {
    return assets;
  }

  static __wait(dur: undefined) {
    return new Promise((res) => {
      setTimeout(() => res(undefined), dur || 250);
    });
  }

  static get CONVOLUTION_MATRIX() {
    return {
      EDGES: [0, -1, 0, -1, 4, -1, 0, -1, 0],
      BLUR: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
      SHARPEN: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      BURN: [
        1 / 11,
        1 / 11,
        1 / 11,
        1 / 11,
        1 / 11,
        1 / 11,
        1 / 11,
        1 / 11,
        1 / 11,
      ],
    };
  }

  static get Util() {
    return Util;
  }
}

export default Canvacord;
