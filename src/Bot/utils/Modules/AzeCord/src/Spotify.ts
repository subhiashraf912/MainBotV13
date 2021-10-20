import Canvas from "canvas";
import Util from "./Util";
import assets from "./Assets";

class Spotify {
  title: string | null;
  image: string | Buffer | Canvas.Image | null;
  artist: string | null;
  album: string | null;
  start: number | null;
  end: number | null;
  background: { type: number; data: string | Buffer | Canvas.Image };
  progressBar: { bgColor: string; color: string };
  constructor() {
    this.title = null;
    this.image = null;
    this.artist = null;
    this.album = null;
    this.start = null;
    this.end = null;
    this.background = {
      type: 0,
      data: "#2F3136",
    };
    this.progressBar = {
      bgColor: "#E8E8E8",
      color: "#1DB954",
    };

    this.__registerFonts();
  }
  __registerFonts() {
    setTimeout(() => {
      Canvas.registerFont(assets("FONT").MANROPE_REGULAR, {
        family: "Manrope",
        weight: "regular",
        style: "normal",
      });

      Canvas.registerFont(assets("FONT").MANROPE_BOLD, {
        family: "Manrope",
        weight: "bold",
        style: "normal",
      });
    }, 250);
  }

  setProgressBar(type: "TRACK" | "BAR", color: string): Spotify {
    switch (type) {
      case "BAR":
        this.progressBar.color =
          color && typeof color === "string" ? color : "#1DB954";
        break;
      case "TRACK":
        this.progressBar.bgColor =
          color && typeof color === "string" ? color : "#E8E8E8";
        break;
      default:
        throw new Error(`Invalid progressbar type "${type}"!`);
    }

    return this;
  }

  setTitle(title: string) {
    if (!title || typeof title !== "string")
      throw new Error(`Expected title, received ${typeof title}!`);
    this.title = title;
    return this;
  }

  setImage(source: string | Buffer | Canvas.Image | null) {
    if (!source)
      throw new Error(`Expected image source, received ${typeof this.title}!`);
    this.image = source;
    return this;
  }

  setAuthor(name: string) {
    if (!name || typeof name !== "string")
      throw new Error(`Expected artist name, received ${typeof name}!`);
    this.artist = name;
    return this;
  }

  setAlbum(name: string) {
    if (!name || typeof name !== "string")
      throw new Error(`Expected album name, received ${typeof name}!`);
    this.album = name;
    return this;
  }

  setStartTimestamp(time: number | Date) {
    if (!time) throw new Error(`Expected timestamp, received ${typeof time}!`);
    if (time instanceof Date) time = time.getTime();
    this.start = time;
    return this;
  }

  setEndTimestamp(time: number | Date) {
    if (!time) throw new Error(`Expected timestamp, received ${typeof time}!`);
    if (time instanceof Date) time = time.getTime();
    this.end = time;
    return this;
  }

  setBackground(
    type: "COLOR" | "IMAGE" = "COLOR",
    data: string | Buffer | Canvas.Image = "#2F3136"
  ) {
    switch (type) {
      case "COLOR":
        this.background.type = 0;
        this.background.data =
          data && typeof data === "string" ? data : "#2F3136";
        break;
      case "IMAGE":
        if (!data) throw new Error("Missing background data!");
        this.background.type = 1;
        this.background.data = data;
        break;
      default:
        throw new Error(`Invalid background type "${type}"!`);
    }

    return this;
  }

  async build() {
    if (!this.title) throw new Error('Missing "title" in options.');
    if (!this.artist) throw new Error('Missing "artist" in options.');
    if (!this.start) throw new Error('Missing "start" in options.');
    if (!this.end) throw new Error('Missing "end" in options.');

    const total = this.end - this.start;
    const progress = Date.now() - this.start;
    const progressF = Util.formatTime(progress > total ? total : progress);
    const ending = Util.formatTime(total);

    const canvas = Canvas.createCanvas(600, 150);
    const ctx = canvas.getContext("2d");

    // background
    ctx.beginPath();
    if (this.background.type === 0) {
      ctx.rect(0, 0, canvas.width, canvas.height);
      //@ts-ignore
      ctx.fillStyle = this.background.data || "#2F3136";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      //@ts-ignore
      let img = await Canvas.loadImage(this.background.data);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // draw image
    //@ts-ignore
    const img = await Canvas.loadImage(this.image);
    ctx.drawImage(img, 30, 15, 120, 120);

    // draw songname
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px Manrope";
    await Util.renderEmoji(ctx, Util.shorten(this.title, 30), 170, 40);

    // draw artist name
    ctx.fillStyle = "#F1F1F1";
    ctx.font = "14px Manrope";
    await Util.renderEmoji(ctx, `by ${Util.shorten(this.artist, 40)}`, 170, 70);

    // add album
    if (this.album && typeof this.album === "string") {
      ctx.fillStyle = "#F1F1F1";
      ctx.font = "14px Manrope";
      await Util.renderEmoji(
        ctx,
        `on ${Util.shorten(this.album, 40)}`,
        170,
        90
      );
    }

    // ending point
    ctx.fillStyle = "#B3B3B3";
    ctx.font = "14px Manrope";
    await Util.renderEmoji(ctx, ending, 430, 130);

    // progress
    ctx.fillStyle = "#B3B3B3";
    ctx.font = "14px Manrope";
    await Util.renderEmoji(ctx, progressF, 170, 130);

    // progressbar track
    ctx.rect(170, 170, 300, 4);
    ctx.fillStyle = "#E8E8E8";
    ctx.fillRect(170, 110, 300, 4);

    // progressbar
    ctx.fillStyle = "#1DB954";
    ctx.fillRect(170, 110, this.__calculateProgress(progress, total), 4);

    // return
    return canvas.toBuffer();
  }

  __calculateProgress(progress: number, total: number) {
    let prg = (progress / total) * 300;
    if (isNaN(prg) || prg < 0) return 0;
    if (prg > 300) return 300;
    return prg;
  }
}

export default Spotify;
