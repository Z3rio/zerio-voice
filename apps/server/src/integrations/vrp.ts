import { VrpProxy } from "@vrpjs/server";
import { Handlers } from "@vrpjs/server/lib/VrpProxy";

let vRP: null | Handlers = null;

try {
  vRP = VrpProxy.getInterface("vRP");
} catch (_e) {}

interface vRPIdentity {
  firstname: string;
  name: string;
}

export async function vrpGetPlayerName(src: number): Promise<string> {
  const name = await new Promise((resolve, _reject) => {
    if (vRP && "getUserIdentity" in vRP) {
      vRP.getUserIdentity([
        src,
        (identity?: vRPIdentity) => {
          if (identity) {
            resolve(identity.firstname + " " + identity.name);
          } else {
            return null;
          }
        },
      ]);
    } else {
      return null;
    }
  });

  if (name) {
    return name as string;
  } else {
    return GetPlayerName(src.toString());
  }
}
