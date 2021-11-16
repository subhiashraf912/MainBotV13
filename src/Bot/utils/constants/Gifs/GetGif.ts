import Gifs from "./Gifs.json";
const GenerateGif = (gif: keyof typeof Gifs) => {
  const gifs = Gifs[gif];
  let GifToBeSent: string = gifs[Math.floor(Math.random() * gifs.length)];
  return GifToBeSent;
}

export default GenerateGif;
