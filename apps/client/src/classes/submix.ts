import { SubmixVolume } from "@zerio-voice/utils/structs";
import {
  AddAudioSubmixOutput,
  CreateAudioSubmix,
  SetAudioSubmixEffectParamInt,
  SetAudioSubmixEffectRadioFx,
  SetAudioSubmixOutputVolumes
} from "@zerio-voice/utils/submix";

const playerServerId = GetPlayerServerId(PlayerId());

export class Submix {
  readonly id: number;

  readonly name: string;
  readonly slot: number;
  readonly volumes: SubmixVolume;
  readonly radioEffect?: string;

  public constructor(
    name: string,
    slot: number,
    volumes: SubmixVolume,
    radioEffect?: string
  ) {
    this.name = name;
    this.slot = slot;
    this.volumes = volumes;
    this.radioEffect = radioEffect;

    this.id = CreateAudioSubmix(name);

    if (this.radioEffect) {
      SetAudioSubmixEffectRadioFx(this.id, 0);
      SetAudioSubmixEffectParamInt(this.id, 0, GetHashKey(this.radioEffect), 1);
    }

    SetAudioSubmixOutputVolumes(
      this.id,
      this.slot,
      this.volumes.frontLeftVolume,
      this.volumes.frontRightVolume,
      this.volumes.rearLeftVolume,
      this.volumes.rearRightVolume,
      this.volumes.channel5Volume,
      this.volumes.channel6Volume
    );
    AddAudioSubmixOutput(this.id, this.slot);
  }

  enable() {
    MumbleSetSubmixForServerId(playerServerId, this.id);
  }

  disable() {
    MumbleSetSubmixForServerId(playerServerId, -1);
  }
}
