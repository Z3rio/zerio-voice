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
  };
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
