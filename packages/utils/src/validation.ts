import { Schema, Validator } from "jsonschema";

const validator = new Validator();

const configSchema: Schema = {
  type: "object",
  properties: {},
};

export function validateConfig(cfg: unknown): boolean {
  return validator.validate(cfg, configSchema).valid;
}
