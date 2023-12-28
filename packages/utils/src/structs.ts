export interface Config {
  logLevel: string;
  enableUI: boolean;
  enableRadio: boolean;
  locale: string;
}

export interface Translations {
  [key: string]: Translations | string;
}
