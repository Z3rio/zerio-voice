import {
  AnsicolorMethods,
  green,
  lightBlue,
  red,
  white,
  yellow,
} from "ansicolor";

export enum LogLevel {
  info,
  debug,
  warn,
  error,
}

function getCurrentLogLevel(): LogLevel {
  const val = GetResourceKvpString("zerio-voice_logLevel");

  if (val === "info" || val === "debug" || val === "warn" || val == "error") {
    return LogLevel[val];
  }

  return LogLevel.error;
}

function createLog(txt: unknown, prefix: AnsicolorMethods, logLevel: LogLevel) {
  const currentLogLevel = getCurrentLogLevel();

  if (currentLogLevel >= logLevel) {
    switch (typeof txt) {
      case "object":
        txt = JSON.stringify(txt);
        break;
      case "number":
      case "boolean":
        txt = txt.toString();
        break;
    }

    if (typeof txt === "string") {
      console.log(
        lightBlue("[Zerio-Voice] LOGGER : ") + prefix(txt) + white(""),
      );
    }
  }
}

export function warn(txt: unknown) {
  createLog(txt, yellow, LogLevel.warn);
}

export function success(txt: unknown) {
  createLog(txt, green, LogLevel.info);
}

export function error(txt: unknown) {
  createLog(txt, red, LogLevel.error);
}

export function info(txt: unknown) {
  createLog(txt, white, LogLevel.info);
}
