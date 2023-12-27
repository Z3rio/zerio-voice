import {
  AnsicolorMethods,
  green,
  lightBlue,
  red,
  white,
  yellow,
} from "ansicolor";

function createLog(txt: unknown, prefix: AnsicolorMethods) {
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
    console.log(lightBlue("[Zerio-Voice] LOGGER : ") + prefix(txt) + white(""));
  }
}

export function warn(txt: unknown) {
  createLog(txt, yellow);
}

export function success(txt: unknown) {
  createLog(txt, green);
}

export function error(txt: unknown) {
  createLog(txt, red);
}

export function info(txt: unknown) {
  createLog(txt, white);
}
