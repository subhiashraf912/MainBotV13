let translations;
import fs from "fs";
import english from "./english.json";

type indexes = keyof typeof english;
const GetLanguage = (
  title: indexes | `${string}_description` | `${string}_usage`,
  language: string
) => {
  translations = JSON.parse(
    fs.readFileSync(
      `src/Bot/utils/Languages/${language.toLowerCase()}.json`,
      "utf8"
    )
  );
  if (!translations) return "Hasn't been added yet.";
  if (!translations[title]) return "Hasn't been added yet.";
  return translations[title] as string;
}

export default GetLanguage;
