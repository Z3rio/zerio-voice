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

const logPrefix = "[Zerio-Voice] LOGGER : ";

function getCurrentLogLevel(): LogLevel {
  const val = GetResourceKvpString("zerio-voice_logLevel");

  if (val === "info" || val === "debug" || val === "warn" || val == "error") {
    return LogLevel[val];
  }

  return LogLevel.error;
}

function createLog(
  txt: unknown[],
  customColor: AnsicolorMethods,
  logLevel: LogLevel,
) {
  const isServer = IsDuplicityVersion();

  for (let i = 0; i < txt.length; i++) {
    const v = txt[i];

    switch (typeof v) {
      case "object":
        txt[i] = JSON.stringify(v);
        break;
      case "number":
      case "boolean":
        txt[i] = v.toString();
        break;
    }
  }

  if (!isServer) {
    customColor = (...txt: unknown[]) => txt;
  }

  const currentLogLevel = getCurrentLogLevel();

  if (currentLogLevel >= logLevel) {
    console.log(
      `${isServer ? lightBlue(logPrefix) : logPrefix}${customColor(txt)}${
        isServer ? white("") : ""
      }`,
    );
  }
}

export function warn(...txt: unknown[]) {
  createLog(txt, yellow, LogLevel.warn);
}

export function success(...txt: unknown[]) {
  createLog(txt, green, LogLevel.info);
}

export function error(...txt: unknown[]) {
  createLog(txt, red, LogLevel.error);
}

export function info(...txt: unknown[]) {
  createLog(txt, white, LogLevel.info);
}
