import Canvas from "canvas";
// Register Bold font
Canvas.registerFont(`${__dirname}/assets/fonts/theboldfont.ttf`, {
  family: "Bold",
});
// Register SketchMatch font
Canvas.registerFont(`${__dirname}/assets/fonts/SketchMatch.ttf`, {
  family: "SketchMatch",
});
// Register SketchMatch font
Canvas.registerFont(`${__dirname}/assets/fonts/LuckiestGuy-Regular.ttf`, {
  family: "luckiest guy",
});
// Register KeepCalm font
Canvas.registerFont(`${__dirname}/assets/fonts/KeepCalm-Medium.ttf`, {
  family: "KeepCalm",
});
import Base from "./src/greetings/Base";
import Welcome from "./src/greetings/Welcome";
import Goodbye from "./src/greetings/Goodbye";
import RankCard from "./src/rank/Rank";

export { Base, Welcome, Goodbye, RankCard }
