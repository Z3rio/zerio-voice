import { Framework } from "./structs";

export const Wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function getDistance(
  coords1: Array<number>,
  coords2: Array<number>,
): number {
  if (
    coords1[0] &&
    coords1[1] &&
    coords1[2] &&
    coords2[0] &&
    coords2[1] &&
    coords2[2]
  ) {
    const dx = coords1[0] - coords2[0];
    const dy = coords1[1] - coords2[1];
    const dz = coords1[2] - coords2[2];

    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return dist;
  } else {
    return -1;
  }
}

export function getFramework(): Framework {
  if (GetResourceState("es_extended") !== "missing") {
    return Framework.ESX;
  } else if (GetResourceState("qb-core") !== "missing") {
    return Framework.QBCore;
  } else if (GetResourceState("vRP") !== "missing") {
    return Framework.vRP;
  }

  return Framework.Standalone;
}
