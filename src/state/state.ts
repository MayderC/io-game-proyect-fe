import { EMIT, ON } from "../contants/constants";
import { Player } from "../game/objects/Player";
import { io } from "socket.io-client";
const URL = import.meta.env.VITE_API_URL;

const setSocket = () => {
  return io(URL);
};

//create a singleton class to store the state
export class State {
  public static instance: State;
  public players: Map<string, Player> = new Map();
  public currentPlayer: any;
  public socket: any;

  private constructor() {
    this.players = new Map();
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
    this.socket.on("connect", () => {
      console.log("connected");
      this.socket.emit(EMIT.JOIN, {
        player: this.currentPlayer,
      });
    });
  }

  public addPlayer(player: Player) {
    this.players.set(player.id, player);
  }

  public removePlayer(player: Player) {
    this.players.delete(player.id);
  }

  public setCurrentPlayer(player: Player) {
    this.currentPlayer = player;
  }

  public getCurrentPlayer() {
    return this.currentPlayer;
  }

  public getPlayers() {
    //return an array of players
    return Array.from(this.players.values());
  }

  public getSocket() {
    return this.socket;
  }

  public getPlayerById(id: string) {
    return this.players.get(id);
  }
}
