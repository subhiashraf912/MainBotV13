import fs, { readdirSync } from "fs";
const dir = {
  IMAGES: `src/Bot/utils/Modules/@azecord/assets/data/images`,
  FONTS: `src/Bot/utils/Modules/@azecord/assets/data/fonts`,
};
const obj = {
  images: {},
  fonts: {},
};

const clean = (str: string) => {
  return str.toUpperCase().split(" ").join("_");
};

const imagesFiles = fs.readdirSync(dir.IMAGES);
if (!imagesFiles.length)
  throw new Error(
    "[Canvacord] Assets dir is corrupted, please re-install canvacord."
  );
//@ts-ignore
imagesFiles.forEach((x, i) => {
  const name = clean(x.split(".")[0]);
  //@ts-ignore
  obj.images[name] = `${dir.IMAGES}/${x}`;
});

const fontsFiles = readdirSync(dir.FONTS);
if (!fontsFiles.length)
  throw new Error(
    "[Canvacord] Assets dir is corrupted, please re-install canvacord."
  );

fontsFiles.forEach((x, i) => {
  const name = x.split(".")[0];
  //@ts-ignore
  obj.fonts[name] = `${dir.FONTS}/${x}`;
});

/**
 * Canvacord assets loader
 * @param {"FONT"|"IMAGE"} type assets type
 */
export default (type: "FONT" | "IMAGE") => {
  switch (type) {
    case "FONT":
      return obj.fonts as any;
      break;
    case "IMAGE":
      return obj.images as any;
      break;
    default:
      throw new Error("CANVACORD_INVALID_ASSETS_TYPE");
  }
};
