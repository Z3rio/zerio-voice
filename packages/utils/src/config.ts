import { Schema, Validator } from "jsonschema";
import { type Config } from "./structs";

const validator = new Validator();

const configSchema: Schema = {
  type: "object",
  properties: {},
};

export function validateConfig(cfg: unknown): boolean {
  return validator.validate(cfg, configSchema).valid;
}

export function getConfig(): Config | null {
  try {
    return JSON.parse(
      LoadResourceFile(GetCurrentResourceName(), "config.json"),
    );
  } catch (e) {
    console.warn(e);
    return null;
  }
}
