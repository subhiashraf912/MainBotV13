// Created and maintained by Snowflake Studio ❄

import Canvacord from "./src/Canvacord";
const ConvolutionMatrix = Canvacord.CONVOLUTION_MATRIX;
import Rank from "./src/Rank";
import Spotify from "./src/Spotify";
import Profile from "./src/Profile";
import Leaver from "./src/Leaver";
import Util from "./src/Util";
import assets from "../@azecord/assets";
import Brightness from "./libs/Brightness";
import Convolute from "./libs/Convolute";
import Darkness from "./libs/Darkness";
import Invert from "./libs/Invert";
import Greyscale from "./libs/Greyscale";
import Sepia from "./libs/Sepia";
import Threshold from "./libs/Threshold";
import Trigger from "./libs/Trigger";
// load default fonts
try {
  setTimeout(() => {
    Canvacord.registerFonts();
  });
} catch (e) {}
async function load(moduleName: string) {
  try {
    return import(moduleName);
  } catch (e) {
    return null;
  }
}

const MSX = {
  Brightness,
  Convolute,
  Darkness,
  Greyscale,
  Invert,
  Sepia,
  Threshold,
  Trigger,
};

const write = Canvacord.write;
export {
  Canvacord,
  ConvolutionMatrix,
  Rank,
  Spotify,
  Profile,
  Leaver,
  Util,
  assets as Assets,
  MSX,
  write,
};
