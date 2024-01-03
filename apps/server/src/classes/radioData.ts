import { RadioMember, RadioSafeGuard } from "@zerio-voice/utils/structs";
import { getPlayerName } from "../integrations/wrapper";

const noTalkOverMode = GetResourceKvpInt("zerio-voice_noTalkOverMode") == 1;

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
  players: Array<RadioMember>;

  private someoneTalking: number | null;
  private safeGuards: Array<RadioSafeGuard | null>;

  constructor(channel: number) {
    this.frequency = channel;
    this.players = [];
    this.someoneTalking = null;
    this.safeGuards = [];
  }

  addSafeGuard(func: RadioSafeGuard): number {
    // .push returns the new length of the array, meaning the inserted idx is len - 1
    return this.safeGuards.push(func) - 1;
  }

  removeSafeGuard(idx: number) {
    // we cant just remove it from the array fully, as that would update all the other indexes, making those incorrect
    this.safeGuards[idx] = null;
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
          src
        );
      }
    }

    this.players = this.players.filter((p) => p.source !== src);
  }

  async addPlr(src: number): Promise<boolean> {
    if (this.players.find((p) => p.source == src) === undefined) {
      for (let i = 0; i < this.safeGuards.length; i++) {
        const v = this.safeGuards[i];

        if (v && (await v(src)) === false) {
          return false;
        }
      }

      // run this before insertion, as we do not want this to be ran on the just inserted player
      for (let i = 0; i < this.players.length; i++) {
        const v = this.players[i];

        if (v) {
          emitNet(
            "zerio-voice:client:playerAddedToRadioChannel",
            v.source,
            this.frequency,
            src,
            await getPlayerName(src)
          );
        }
      }

      this.players.push({
        source: src,
        name: await getPlayerName(src),
        talking: false
      });

      // this syncs ALL players to the just added client
      emitNet(
        "zerio-voice:client:syncRawPlayers",
        src,
        this.frequency,
        this.players
      );

      return true;
    } else {
      return false;
    }
  }

  private reEvalSomeoneTalking() {
    for (let i = 0; i < this.players.length; i++) {
      const v = this.players[i];

      if (v && v.talking) {
        this.someoneTalking = v.source;
        return;
      }
    }

    this.someoneTalking = null;
  }

  updateTalkingState(src: number, isTalking: boolean) {
    if (
      // check whether no talk over mode either isnt enabled, or no one isnt talking already
      noTalkOverMode === false ||
      this.someoneTalking === null ||
      this.someoneTalking === src
    ) {
      const found = this.players.findIndex((p) => p.source == src);

      if (found !== -1) {
        const newPlr = this.players[found];

        if (newPlr) {
          newPlr.talking = isTalking;
          this.players[found] = newPlr;

          if (noTalkOverMode) {
            this.reEvalSomeoneTalking();
          }

          for (let i = 0; i < this.players.length; i++) {
            const v = this.players[i];

            if (v) {
              emitNet(
                "zerio-voice:client:setTalkingOnRadio",
                v.source,
                this.frequency,
                src,
                isTalking
              );
            }
          }
        }
      }
    }
  }
}
