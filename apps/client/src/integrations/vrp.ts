import { VrpProxy } from "@vrpjs/client";
import { Handlers } from "@vrpjs/client/lib/VrpProxy";

export let vRP: null | Handlers = null;

try {
  vRP = VrpProxy.getInterface("vRP");
} catch (_e) {
  // could not load vrp, probably doesnt exist on the server
}
