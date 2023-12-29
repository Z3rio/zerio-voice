export class PlayerRadioData {
  source: number;
  channels: Array<number> = [];
  isTalking: Record<number, boolean> = {};

  private updateStateBag() {
    Player(this.source).state.radioChannels = this.channels;
  }

  constructor(source: number) {
    this.source = source;

    this.updateStateBag();
  }

  addChannel(channel: number) {
    if (!this.channels.includes(channel)) {
      this.channels.push(channel);
      this.isTalking[channel] = false;
    }

    this.updateStateBag();
  }

  removeChannel(channel: number) {
    if (this.channels.includes(channel)) {
      this.channels = this.channels.filter((c) => c !== channel);
      delete this.isTalking[channel];
    }

    this.updateStateBag();
  }
}

export class RadioChannelData {
  frequency: number;
  players: number[] = [];

  constructor(channel: number) {
    this.frequency = channel;
  }

  removePlr(src: number) {
    this.players = this.players.filter((p) => p !== src);
  }

  addPlr(src: number) {
    if (!this.players.includes(src)) {
      this.players.push(src);
    }
  }
}
