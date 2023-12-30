// redm compatibility, can be used for fivem anyways though

export function CreateAudioSubmix(name: string): number {
  return Citizen.invokeNative("0x658d2bc8", name, Citizen.resultAsInteger());
}

export function AddAudioSubmixOutput(submixId: number, outputSubmixId: number) {
  Citizen.invokeNative("0xac6e290d", submixId, outputSubmixId);
}

export function MumbleSetSubmixForServerId(serverId: number, submixId: number) {
  Citizen.invokeNative("0xfe3a3054", serverId, submixId);
}

export function SetAudioSubmixEffectParamFloat(
  submixId: number,
  effectSlot: number,
  paramIndex: number,
  paramValue: number,
) {
  Citizen.invokeNative(
    "0x9a209b3c",
    submixId,
    effectSlot,
    paramIndex,
    paramValue,
  );
}

export function SetAudioSubmixEffectParamInt(
  submixId: number,
  effectSlot: number,
  paramIndex: number,
  paramValue: number,
) {
  Citizen.invokeNative(
    "0x77fae2b8",
    submixId,
    effectSlot,
    paramIndex,
    paramValue,
  );
}

export function SetAudioSubmixEffectRadioFx(
  submixId: number,
  effectSlot: number,
) {
  Citizen.invokeNative("0xaaa94d53", submixId, effectSlot);
}

export function SetAudioSubmixOutputVolumes(
  submixId: number,
  outputSlot: number,
  frontLeftVolume: number,
  frontRightVolume: number,
  rearLeftVolume: number,
  rearRightVolume: number,
  channel5Volume: number,
  channel6Volume: number,
) {
  Citizen.invokeNative(
    "0x825dc0d1",
    submixId,
    outputSlot,
    frontLeftVolume,
    frontRightVolume,
    rearLeftVolume,
    rearRightVolume,
    channel5Volume,
    channel6Volume,
  );
}
