import Canvas from "canvas";
import Util from "./Util";
import assets from "./Assets";

/**
 * @typedef {object} CanvacordRankData
 * @property {number} width Rank card width
 * @property {number} height Rank card height
 * @property {object} background Rank card background data
 * @property {"image"|"color"} [background.type="color"] Background type
 * @property {string|Buffer} [background.image="#23272A"] Background image (or color)
 * @property {object} progressBar Progressbar data
 * @property {boolean} [progressBar.rounded=true] If the progressbar should be rounded
 * @property {number} [progressBar.x=275.5] Progressbar X
 * @property {number} [progressBar.y=183.75] Progressbar Y
 * @property {number} [progressBar.height=37.5] Progressbar height
 * @property {number} [progressBar.width=596.5] Progressbar width
 * @property {object} [progressBar.track] Progressbar track
 * @property {string} [progressBar.track.color="#484b4E"] Progressbar track color
 * @property {object} [progressBar.bar] Progressbar bar data
 * @property {"color"|"gradient"} [progressBar.bar.type="color"] Progressbar bar type
 * @property {string|string[]} [progressBar.bar.color="#FFFFFF"] Progressbar bar color
 * @property {object} overlay Progressbar overlay
 * @property {boolean} [overlay.display=true] If it should display overlay
 * @property {number} [overlay.level=0.5] Overlay opacity level
 * @property {string} [overlay.color="#333640"] Overlay bg color
 * @property {object} avatar Rank card avatar data
 * @property {string|Buffer} [avatar.source=null] Avatar source
 * @property {number} [avatar.x=70] X
 * @property {number} [avatar.y=50] Y
 * @property {number} [avatar.height=180] height
 * @property {number} [avatar.width=180] width
 * @property {object} status Rank card status
 * @property {number} [status.width=5] Status width
 * @property {"online"|"dnd"|"idle"|"offline"|"streaming"} [status.type] Status type
 * @property {string} [status.color="#43B581"] Status color
 * @property {boolean} [status.circle=true] Circualr status?
 * @property {object} rank Rank card rank data
 * @property {boolean} [rank.display=true] If it should display rank
 * @property {number} [rank.data=1] The Rank
 * @property {string} [rank.textColor="#FFFFFF"] Rank text color
 * @property {string} [rank.color="#F3F3F3"] Rank color
 * @property {string} [rank.displayText="RANK"] Rank display text
 * @property {object} level Rank card level data
 * @property {boolean} [level.display=true] If it should display level
 * @property {number} [level.data=1] The level
 * @property {string} [level.textColor="#FFFFFF"] level text color
 * @property {string} [level.color="#F3F3F3"] level color
 * @property {string} [level.displayText="LEVEL"] level display text
 * @property {object} currentXP Rank card current xp
 * @property {number} [currentXP.data=0] Current xp
 * @property {string} [currentXP.color="#FFFFFF"] Rank card current xp color
 * @property {object} requiredXP Rank card required xp
 * @property {number} [requiredXP.data=0] required xp
 * @property {string} [requiredXP.color="#FFFFFF"] Rank card required xp color
 * @property {object} discriminator Rank card discriminator
 * @property {number|string} [discriminator.discrim=null] The discriminator
 * @property {string} [discriminator.color="rgba(255, 255, 255, 0.4)"] Rank card discriminator color
 * @property {object} username Username Data
 * @property {string} [username.name=null] Rank card username
 * @property {string} [username.color="#FFFFFF"] Rank card username color
 * @property {boolean} [renderEmojis=false] If it should render emojis
 */

class Rank {
  data: {
    width: number;
    height: number;
    background: { type: string; image: string };
    progressBar: {
      rounded: boolean;
      x: number;
      y: number;
      height: number;
      width: number;
      track: { color: string };
      bar: { type: string; color: string };
    };
    overlay: { display: boolean; level: number; color: string };
    avatar: {
      source: null;
      x: number;
      y: number;
      height: number;
      width: number;
    };
    status: {
      width: boolean | number;
      type: string;
      color: string;
      circle: boolean;
    };
    rank: {
      display: boolean;
      data: number;
      textColor: string;
      color: string;
      displayText: string;
    };
    level: {
      display: boolean;
      data: number;
      textColor: string;
      color: string;
      displayText: string;
    };
    currentXP: { data: number; color: string };
    requiredXP: { data: number; color: string };
    discriminator: { discrim: string | number | null; color: string };
    username: { name: string | null; color: string };
    renderEmojis: boolean;
  };

  constructor() {
    this.data = {
      width: 934,
      height: 282,
      background: {
        type: "color",
        image: "#23272A",
      },
      progressBar: {
        rounded: true,
        x: 275.5,
        y: 183.75,
        height: 37.5,
        width: 596.5,
        track: {
          color: "#484b4E",
        },
        bar: {
          type: "color",
          color: "#FFFFFF",
        },
      },
      overlay: {
        display: true,
        level: 0.5,
        color: "#333640",
      },
      avatar: {
        source: null,
        x: 70,
        y: 50,
        height: 180,
        width: 180,
      },
      status: {
        width: 5,
        type: "online",
        color: "#43B581",
        circle: true,
      },
      rank: {
        display: true,
        data: 1,
        textColor: "#FFFFFF",
        color: "#F3F3F3",
        displayText: "RANK",
      },
      level: {
        display: true,
        data: 1,
        textColor: "#FFFFFF",
        color: "#F3F3F3",
        displayText: "LEVEL",
      },
      currentXP: {
        data: 0,
        color: "#FFFFFF",
      },
      requiredXP: {
        data: 0,
        color: "#FFFFFF",
      },
      discriminator: {
        discrim: null,
        color: "rgba(255, 255, 255, 0.4)",
      },
      username: {
        name: null,
        color: "#FFFFFF",
      },
      renderEmojis: false,
    };

    // Load default fonts
    this.registerFonts();
  }

  registerFonts(fontArray = []) {
    if (!fontArray.length) {
      setTimeout(() => {
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
        Canvas.registerFont(assets("FONT").NOTOSANS, {
          family: "NotoSans",
          weight: "bold",
          style: "normal",
        });
      }, 250);
    } else {
      fontArray.forEach((font) => {
        //@ts-ignore
        Canvas.registerFont(font.path, font.face);
      });
    }

    return this;
  }

  renderEmojis(apply = false) {
    this.data.renderEmojis = !!apply;
    return this;
  }

  setUsername(name: string, color?: string) {
    if (typeof name !== "string")
      throw new Error(
        `Expected username to be a string, received ${typeof name}!`
      );
    this.data.username.name = name;
    this.data.username.color =
      color && typeof color === "string" ? color : "#FFFFFF";
    return this;
  }

  setDiscriminator(
    discriminator: string | number,
    color = "rgba(255, 255, 255, 0.4)"
  ): Rank {
    this.data.discriminator.discrim =
      !isNaN(discriminator as number) && `${discriminator}`.length === 4
        ? discriminator
        : null;
    this.data.discriminator.color =
      color && typeof color === "string" ? color : "rgba(255, 255, 255, 0.4)";
    return this;
  }

  setProgressBar(color: string | string[], fillType = "COLOR", rounded = true) {
    switch (fillType) {
      case "COLOR":
        if (typeof color !== "string")
          throw new Error(
            `Color type must be a string, received ${typeof color}!`
          );
        this.data.progressBar.bar.color = color;
        this.data.progressBar.bar.type = "color";
        this.data.progressBar.rounded = !!rounded;
        break;
      case "GRADIENT":
        if (!Array.isArray(color))
          throw new Error(
            `Color type must be Array, received ${typeof color}!`
          );
        //@ts-ignore
        this.data.progressBar.bar.color = color.slice(0, 2);
        this.data.progressBar.bar.type = "gradient";
        this.data.progressBar.rounded = !!rounded;
        break;
      default:
        throw new Error(`Unsupported progressbar type "${fillType}"!`);
    }

    return this;
  }

  setProgressBarTrack(color: any) {
    if (typeof color !== "string")
      throw new Error(
        `Color type must be a string, received "${typeof color}"!`
      );
    this.data.progressBar.track.color = color;

    return this;
  }

  setOverlay(color: any, level = 0.5, display = true) {
    if (typeof color !== "string")
      throw new Error(
        `Color type must be a string, received "${typeof color}"!`
      );
    this.data.overlay.color = color;
    this.data.overlay.display = !!display;
    this.data.overlay.level = level && typeof level === "number" ? level : 0.5;
    return this;
  }

  setRequiredXP(data: any, color = "#FFFFFF") {
    if (typeof data !== "number")
      throw new Error(
        `Required xp data type must be a number, received ${typeof data}!`
      );
    this.data.requiredXP.data = data;
    this.data.requiredXP.color =
      color && typeof color === "string" ? color : "#FFFFFF";
    return this;
  }

  setCurrentXP(data: any, color = "#FFFFFF") {
    if (typeof data !== "number")
      throw new Error(
        `Current xp data type must be a number, received ${typeof data}!`
      );
    this.data.currentXP.data = data;
    this.data.currentXP.color =
      color && typeof color === "string" ? color : "#FFFFFF";
    return this;
  }

  setRank(data: any, text = "RANK", display = true) {
    if (typeof data !== "number")
      throw new Error(`Level data must be a number, received ${typeof data}!`);
    this.data.rank.data = data;
    this.data.rank.display = !!display;
    if (!text || typeof text !== "string") text = "RANK";
    this.data.rank.displayText = text;

    return this;
  }

  setRankColor(text = "#FFFFFF", number = "#FFFFFF") {
    if (!text || typeof text !== "string") text = "#FFFFFF";
    if (!number || typeof number !== "string") number = "#FFFFFF";
    this.data.rank.textColor = text;
    this.data.rank.color = number;
    return this;
  }
  setLevelColor(text = "#FFFFFF", number = "#FFFFFF") {
    if (!text || typeof text !== "string") text = "#FFFFFF";
    if (!number || typeof number !== "string") number = "#FFFFFF";
    this.data.level.textColor = text;
    this.data.level.color = number;
    return this;
  }
  setLevel(data: any, text = "LEVEL", display = true) {
    if (typeof data !== "number")
      throw new Error(`Level data must be a number, received ${typeof data}!`);
    this.data.level.data = data;
    this.data.level.display = !!display;
    if (!text || typeof text !== "string") text = "LEVEL";
    this.data.level.displayText = text;

    return this;
  }

  setCustomStatusColor(color: any) {
    if (!color || typeof color !== "string") throw new Error("Invalid color!");
    this.data.status.color = color;
    return this;
  }

  setStatus(status: any, circle = true, width: number | boolean = 5) {
    switch (status) {
      case "online":
        this.data.status.type = "online";
        this.data.status.color = "#43B581";
        break;
      case "idle":
        this.data.status.type = "idle";
        this.data.status.color = "#FAA61A";
        break;
      case "dnd":
        this.data.status.type = "dnd";
        this.data.status.color = "#F04747";
        break;
      case "offline":
        this.data.status.type = "offline";
        this.data.status.color = "#747F8E";
        break;
      case "streaming":
        this.data.status.type = "streaming";
        this.data.status.color = "#593595";
        break;
      default:
        throw new Error(`Invalid status "${status}"`);
    }

    if (width !== false)
      this.data.status.width = typeof width === "number" ? width : 5;
    else this.data.status.width = false;
    if ([true, false].includes(circle)) this.data.status.circle = circle;

    return this;
  }

  setBackground(type: "COLOR" | "IMAGE", data: any) {
    if (!data) throw new Error("Missing field : data");
    switch (type) {
      case "COLOR":
        this.data.background.type = "color";
        this.data.background.image =
          data && typeof data === "string" ? data : "#23272A";
        break;
      case "IMAGE":
        this.data.background.type = "image";
        this.data.background.image = data;
        break;
      default:
        throw new Error(`Unsupported background type "${type}"`);
    }

    return this;
  }

  setAvatar(data: any) {
    if (!data) throw new Error(`Invalid avatar type "${typeof data}"!`);
    this.data.avatar.source = data;
    return this;
  }

  async build(ops = { fontX: "NotoSans", fontY: "NotoSans" }) {
    if (typeof this.data.currentXP.data !== "number")
      throw new Error(
        `Expected currentXP to be a number, received ${typeof this.data
          .currentXP.data}!`
      );
    if (typeof this.data.requiredXP.data !== "number")
      throw new Error(
        `Expected requiredXP to be a number, received ${typeof this.data
          .requiredXP.data}!`
      );
    if (!this.data.avatar.source) throw new Error("Avatar source not found!");
    if (!this.data.username.name) throw new Error("Missing username");

    let bg = null;
    if (this.data.background.type === "image")
      bg = await Canvas.loadImage(this.data.background.image);
    let avatar = await Canvas.loadImage(this.data.avatar.source);

    // create canvas instance
    const canvas = Canvas.createCanvas(this.data.width, this.data.height);
    const ctx = canvas.getContext("2d");

    // create background
    if (!!bg) {
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = this.data.background.image;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // add overlay
    if (!!this.data.overlay.display) {
      ctx.globalAlpha = this.data.overlay.level || 1;
      ctx.fillStyle = this.data.overlay.color;
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    }

    // reset transparency
    ctx.globalAlpha = 1;

    // draw username
    ctx.font = `bold 36px ${ops.fontX}`;
    ctx.fillStyle = this.data.username.color;
    ctx.textAlign = "start";
    const name = Util.shorten(this.data.username.name, 10);

    // apply username
    !this.data.renderEmojis
      ? ctx.fillText(`${name}`, 257 + 18.5, 164)
      : await Util.renderEmoji(ctx, name, 257 + 18.5, 164);

    // draw discriminator
    if (!this.data.discriminator.discrim)
      throw new Error("Missing discriminator!");
    const discrim = `${this.data.discriminator.discrim}`;
    if (discrim) {
      ctx.font = `36px ${ops.fontY}`;
      ctx.fillStyle = this.data.discriminator.color;
      ctx.textAlign = "center";
      ctx.fillText(
        `#${discrim.substr(0, 4)}`,
        ctx.measureText(name).width + 20 + 335,
        164
      );
    }

    // fill level
    if (this.data.level.display && !isNaN(this.data.level.data)) {
      ctx.font = `bold 36px ${ops.fontX}`;
      ctx.fillStyle = this.data.level.textColor;
      ctx.fillText(
        this.data.level.displayText,
        800 -
          //@ts-ignore
          ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data))).width,
        82
      );

      ctx.font = `bold 32px ${ops.fontX}`;
      ctx.fillStyle = this.data.level.color;
      ctx.textAlign = "end";
      //@ts-ignore
      ctx.fillText(Util.toAbbrev(parseInt(this.data.level.data)), 860, 82);
    }

    // fill rank
    if (this.data.rank.display && !isNaN(this.data.rank.data)) {
      ctx.font = `bold 36px ${ops.fontX}`;
      ctx.fillStyle = this.data.rank.textColor;
      // ctx.fillText(this.data.rank.displayText, 800 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data)) || "-").width - 7 - ctx.measureText(this.data.level.displayText).width - 7 - ctx.measureText(Util.toAbbrev(parseInt(this.data.rank.data)) || "-").width, 82);

      ctx.font = `bold 32px ${ops.fontX}`;
      ctx.fillStyle = this.data.rank.color;
      ctx.textAlign = "end";
      // ctx.fillText(Util.toAbbrev(parseInt(this.data.rank.data)), 790 - ctx.measureText(Util.toAbbrev(parseInt(this.data.level.data)) || "-").width - 7 - ctx.measureText(this.data.level.displayText).width, 82);
    }

    // show progress
    ctx.font = `bold 30px ${ops.fontX}`;
    ctx.fillStyle = this.data.requiredXP.color;
    ctx.textAlign = "start";
    ctx.fillText(
      "/ " + Util.toAbbrev(this.data.requiredXP.data),
      670 + ctx.measureText(Util.toAbbrev(this.data.currentXP.data)).width + 15,
      164
    );

    ctx.fillStyle = this.data.currentXP.color;
    ctx.fillText(Util.toAbbrev(this.data.currentXP.data), 670, 164);

    // draw progressbar
    ctx.beginPath();
    if (!!this.data.progressBar.rounded) {
      // bg
      ctx.fillStyle = this.data.progressBar.track.color;
      ctx.arc(
        257 + 18.5,
        147.5 + 18.5 + 36.25,
        18.5,
        1.5 * Math.PI,
        0.5 * Math.PI,
        true
      );
      ctx.fill();
      ctx.fillRect(257 + 18.5, 147.5 + 36.25, 615 - 18.5, 37.5);
      ctx.arc(
        257 + 615,
        147.5 + 18.5 + 36.25,
        18.75,
        1.5 * Math.PI,
        0.5 * Math.PI,
        false
      );
      ctx.fill();

      ctx.beginPath();
      // apply color
      if (this.data.progressBar.bar.type === "gradient") {
        //@ts-ignore
        let gradientContext = ctx.createRadialGradient(
          this._calculateProgress,
          0,
          500,
          0
        ); //@ts-ignore

        this.data.progressBar.bar.color.forEach((color: any, index: any) => {
          gradientContext.addColorStop(index, color);
        });
        ctx.fillStyle = gradientContext;
      } else {
        ctx.fillStyle = this.data.progressBar.bar.color;
      }

      // progress bar
      ctx.arc(
        257 + 18.5,
        147.5 + 18.5 + 36.25,
        18.5,
        1.5 * Math.PI,
        0.5 * Math.PI,
        true
      );
      ctx.fill();
      ctx.fillRect(257 + 18.5, 147.5 + 36.25, this._calculateProgress, 37.5);
      ctx.arc(
        257 + 18.5 + this._calculateProgress,
        147.5 + 18.5 + 36.25,
        18.75,
        1.5 * Math.PI,
        0.5 * Math.PI,
        false
      );
      ctx.fill();
    } else {
      // progress bar
      ctx.fillStyle = this.data.progressBar.bar.color;
      ctx.fillRect(
        this.data.progressBar.x,
        this.data.progressBar.y,
        this._calculateProgress,
        this.data.progressBar.height
      );

      // outline
      ctx.beginPath();
      ctx.strokeStyle = this.data.progressBar.track.color;
      ctx.lineWidth = 7;
      ctx.strokeRect(
        this.data.progressBar.x,
        this.data.progressBar.y,
        this.data.progressBar.width,
        this.data.progressBar.height
      );
    }

    ctx.save();

    // circle
    ctx.beginPath();
    ctx.arc(125 + 10, 125 + 20, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    // draw avatar
    ctx.drawImage(
      avatar,
      35,
      45,
      this.data.avatar.width + 20,
      this.data.avatar.height + 20
    );
    ctx.restore();

    // draw status
    if (!!this.data.status.circle) {
      ctx.beginPath();
      ctx.fillStyle = this.data.status.color;
      ctx.arc(215, 205, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
      ctx.strokeStyle = this.data.status.color;
      ctx.lineWidth = this.data.status.width as number;
      ctx.stroke();
    } else if (!this.data.status.circle && this.data.status.width !== false) {
      ctx.beginPath();
      ctx.arc(135, 145, 100, 0, Math.PI * 2, true);
      ctx.strokeStyle = this.data.status.color;
      ctx.lineWidth = this.data.status.width as number;
      ctx.stroke();
    }

    return canvas.toBuffer();
  }

  get _calculateProgress() {
    const cx = this.data.currentXP.data;
    const rx = this.data.requiredXP.data;

    if (rx <= 0) return 1;
    if (cx > rx) return this.data.progressBar.width;

    let width = (cx * 615) / rx;
    if (width > this.data.progressBar.width)
      width = this.data.progressBar.width;
    return width;
  }
}

export default Rank;
