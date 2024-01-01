import { RadioMember } from "@zerio-voice/utils/structs";
import { getPlayerName } from "../integrations/wrapper";

export class PlayerRadioData {
  source: number;
  channels: Array<number> = new Array();
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
  players: Array<RadioMember>;

  constructor(channel: number) {
    this.frequency = channel;
    this.players = new Array();
  }

  removePlr(src: number) {
    // run this before the filtering of the player list, as we want it to update for the player that just got removed aswell
    for (let i = 0; i < this.players.length; i++) {
      const v = this.players[i];

      if (v) {
        emitNet(
          "zerio-voice:client:playerRemovedFromRadioChannel",
          v.source,
          this.frequency,
          src,
        );
      }
    }

    this.players = this.players.filter((p) => p.source !== src);
  }

  async addPlr(src: number) {
    if (this.players.find((p) => p.source == src) === undefined) {
      // run this before insertion, as we do not want this to be ran on the just inserted player
      for (let i = 0; i < this.players.length; i++) {
        const v = this.players[i];

        if (v) {
          emitNet(
            "zerio-voice:client:playerAddedToRadioChannel",
            v.source,
            this.frequency,
            src,
            await getPlayerName(src),
          );
        }
      }

      this.players.push({
        source: src,
        name: await getPlayerName(src),
        talking: false,
      });

      // this syncs ALL players to the just added client
      emitNet(
        "zerio-voice:client:syncRawPlayers",
        src,
        this.frequency,
        this.players,
      );
    }
  }

  updateTalkingState(src: number, isTalking: boolean) {
    const found = this.players.findIndex((p) => p.source == src);

    if (found !== -1) {
      const newPlr = this.players[found];

      if (newPlr) {
        newPlr.talking = isTalking;
        this.players[found] = newPlr;

        for (let i = 0; i < this.players.length; i++) {
          const v = this.players[i];

          if (v && v.source !== src) {
            emitNet(
              "zerio-voice:client:setTalkingOnRadio",
              v.source,
              this.frequency,
              src,
              isTalking,
            );
          }
        }
      }
    }
  }
}
