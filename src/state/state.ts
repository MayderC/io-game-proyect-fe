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
    this.k = {};
  }

  public static getInstance(): State {
    if (!State.instance) {
      State.instance = new State();
    }

    return State.instance;
  }

  public setKaboom(k: any) {
    this.k = k;
  }

  public setSocket() {
    this.socket = setSocket();
    this.socket.on("connect", () => {
      this.currentPlayer.id = this.socket.id;
      this.socket.emit(EMIT.JOIN, {
        player: this.currentPlayer,
      });

      this.socket.emit(EMIT.GET_ALL_PLAYERS);
    });

    this.socket.on("disconnect", (player) => {
      console.log("disconnect", player);
      //send a leave event to the server with the player object
      this.socket.emit(EMIT.LEAVE, { player });
    });
  }

  public addPlayer(player: Player) {
    if (this.players.has(player.id)) return;
    this.players.set(player.id, player);
  }

  public removePlayer(id: string) {
    this.players.delete(id);
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
