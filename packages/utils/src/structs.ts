export interface Config {
  logging: {
    level: string;
  };
  ui: {
    enabled: boolean;
    radioMemberList: {
      enabled: boolean;
      showMembersOfAllChannels: boolean;
    };
    interaction: {
      key: string;
      requireMousePressAswell: boolean;
    };
  };
  framework: {
    customResourceName?: null | string;
  };
  proximity: {
    keybind: string;
  };
  voiceModes: Array<VoiceMode>;
  locale: {
    language: string;
  };
  submix: {
    radio: boolean;
    call: boolean;
  };
  radio: {
    enabled: boolean;
    enableMicClicks: boolean;
    micClicksVolume: number;
    keybind: string;
    noTalkOverMode: boolean;
  };
}

export type RadioSafeGuard = (src: number) => Promise<boolean> | boolean;

export interface VoiceMode {
  range: number;
  name: string;
  default?: boolean;
}

export interface Translations {
  [key: string]: Translations | string;
}

export interface Talking {
  normal: boolean;
  radio: boolean;
}

export interface RadioMember {
  talking: boolean;
  name: string;
  source: number;
}

export interface SubmixVolume {
  frontLeftVolume: number;
  frontRightVolume: number;
  rearLeftVolume: number;
  rearRightVolume: number;
  channel5Volume: number;
  channel6Volume: number;
}

export type NuiCallback = (...args: Array<unknown>) => void;

export enum Framework {
  vRP,
  ESX,
  QBCore,
  Standalone,
}
