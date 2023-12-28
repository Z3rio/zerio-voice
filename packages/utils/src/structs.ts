export interface Config {
  logging: {
    level: string;
  };
  ui: {
    enabled: boolean;
  };
  locale: {
    language: string;
  };
  radio: {
    enabled: boolean;
    keybind: string;
  };
}

export interface Translations {
  [key: string]: Translations | string;
}

export interface Talking {
  normal: boolean;
  radio: boolean;
}
