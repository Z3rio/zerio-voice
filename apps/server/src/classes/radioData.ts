export class PlayerRadioData {
  source: number;
  channels: Array<number> = [];
  isTalking: Record<number, boolean> = {};

  constructor(source: number) {
    this.source = source;
  }

  addChannel(channel: number) {
    if (!this.channels.includes(channel)) {
      this.channels.push(channel);
      this.isTalking[channel] = false;
    }
  }

  removeChannel(channel: number) {
    if (this.channels.includes(channel)) {
      this.channels = this.channels.filter((c) => c !== channel);
      delete this.isTalking[channel];
    }
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
