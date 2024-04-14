import { Player } from "../game/objects/Player";
import { setSocket } from "../socket/socket";

//create a singleton class to store the state
export class State {
  public static instance: State;
  public players: Player[];
  public currentPlayer: any;
  public socket: any;

  private constructor() {
    this.players = [];
    this.currentPlayer = {};
    this.socket = {};
  }

  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }

    return State.instance;
  }

  public setSocket() {
    this.socket = setSocket();
  }

  public addPlayer(player: Player) {
    this.players.push(player);
  }

  public removePlayer(player: Player) {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  public setCurrentPlayer(player: Player) {
    this.currentPlayer = player;
  }

  public getCurrentPlayer() {
    return this.currentPlayer;
  }

  public getPlayers() {
    return this.players;
  }

  public getSocket() {
    return this.socket;
  }

  public getPlayerById(id: string) {
    return this.players.find((p) => p.id === id);
  }
}
