let translations;
import fs from "fs";
const GetLanguage = (title: string, language: string) => {
  translations = JSON.parse(
    fs.readFileSync(
      `src/Bot/utils/Languages/${language.toLowerCase()}.json`,
      "utf8"
    )
  );
  if (!translations) return "";
  if (!translations[title]) return "";
  return translations[title] as string;
};

export default GetLanguage;
