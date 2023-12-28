export class VoiceData {
  source: number;
  assignedChannel: number;

  constructor(source: number, channel: number) {
    this.source = source;
    this.assignedChannel = channel;

    if (channel !== -1) {
      Player(source).state.set("assignedChannel", channel, true);
    }
  }
}
