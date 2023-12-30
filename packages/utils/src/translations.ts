import { warn } from "./logger";
import { Translations } from "./structs";

export function getTranslation(translation: Array<string>): string {
  let rawTranslations: null | Translations = null;
  let locale = GetResourceKvpString("zerio-voice_locale");

  try {
    rawTranslations = JSON.parse(
      LoadResourceFile(GetCurrentResourceName(), "translations.json"),
    );
  } catch (e) {
    warn(e);
  }

  if (rawTranslations) {
    const translations: undefined | string | Translations =
      rawTranslations[locale];

    if (!translations || typeof translations == "string") {
      return `Locale ${locale}, does not exist in your translations file`;
    }

    let retVal: undefined | Translations | string = undefined;

    for (let i = 0; i < translation.length; i++) {
      const v = translation[i];

      if (v) {
        if (typeof retVal !== "string") {
          if (retVal == undefined && translations[v]) {
            retVal = translations[v];
          } else if (retVal !== undefined && retVal[v]) {
            retVal = retVal[v];
          } else {
            return "Invalid translation for: " + JSON.stringify(translation);
          }
        }
      }
    }

    return retVal == undefined
      ? "Invalid Translation"
      : typeof retVal == "string"
      ? retVal
      : "Translation is not a string";
  }

  return "An error occured whilst fetching translations";
}
