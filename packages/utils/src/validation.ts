import { Schema, Validator } from "jsonschema";

const validator = new Validator();

const configLoggingSchema: Schema = {
  id: "/ConfigLogging",
  type: "object",
  properties: {
    level: {
      type: "string",
      required: true,
    },
  },
  required: true,
};
validator.addSchema(configLoggingSchema, "/ConfigLogging");

const configUIInteractionSchema: Schema = {
  id: "/ConfigUIInteraction",
  type: "object",
  properties: {
    key: {
      type: "string",
      required: true,
    },
    requireMousePressAswell: {
      type: "boolean",
      required: true,
    },
  },
  required: true,
};
validator.addSchema(configUIInteractionSchema, "/ConfigUI");

const configUISchema: Schema = {
  id: "/ConfigUI",
  type: "object",
  properties: {
    enabled: {
      type: "boolean",
      required: true,
    },
    interaction: {
      $ref: "/ConfigUIInteraction",
      required: true,
    },
  },
  required: true,
};
validator.addSchema(configUISchema, "/ConfigUI");

const configLocaleSchema: Schema = {
  id: "/ConfigLocale",
  type: "object",
  properties: {
    language: {
      type: "string",
      required: true,
    },
  },
  required: true,
};
validator.addSchema(configLocaleSchema, "/ConfigLocale");

const configSubmixSchema: Schema = {
  id: "/ConfigSubmix",
  type: "object",
  properties: {
    radio: {
      type: "boolean",
      required: true,
    },
    call: {
      type: "boolean",
      required: true,
    },
  },
  required: true,
};
validator.addSchema(configSubmixSchema, "/ConfigSubmix");

const configRadioSchema: Schema = {
  id: "/ConfigRadio",
  type: "object",
  properties: {
    enabled: {
      type: "boolean",
      required: true,
    },
    enableMicClicks: {
      type: "boolean",
      required: true,
    },
    micClicksVolume: {
      type: "number",
      required: true,
    },
    keybind: {
      type: "string",
      required: true,
    },
  },
  required: true,
};
validator.addSchema(configRadioSchema, "/ConfigRadio");

const configSchema: Schema = {
  type: "object",
  properties: {
    logging: {
      $ref: "/ConfigLogging",
      required: true,
    },
    ui: {
      $ref: "/ConfigUI",
      required: true,
    },
    locale: {
      $ref: "/ConfigLocale",
      required: true,
    },
    submix: {
      $ref: "/ConfigSubmix",
      required: true,
    },
    radio: {
      $ref: "/ConfigRadio",
      required: true,
    },
  },
};
validator.addSchema(configLoggingSchema, "/ConfigSchema");

export function validateConfig(cfg: unknown): boolean {
  return validator.validate(cfg, configSchema).valid;
}
