import { EMIT } from "../contants/constants";
import { IPlayer, Player } from "../game/objects/Player";
import { io } from "socket.io-client";
import { GameObj } from "kaboom";
const URL = import.meta.env.VITE_API_URL;

const setSocket = () => {
  return io(URL);
};

//create a singleton class to store the state
export class State {
  public static instance: State;
  public players: Map<string, Player> = new Map();
  public coins: GameObj[];
  public currentPlayer: any;
  public socket: any;
  public dialog = document.getElementById("options") as HTMLDivElement;
  public topPlayers = document.getElementById("top-players") as HTMLDivElement;

  private constructor() {
    this.players = new Map();
    this.currentPlayer = {};
    this.socket = {};
    this.coins = [];
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
      this.currentPlayer.id = this.socket.id;
      const data: IPlayer = {
        id: this.socket.id,
        name: this.currentPlayer.name,
        x: this.currentPlayer.kPlayer.pos.x,
        y: this.currentPlayer.kPlayer.pos.y,
      };
      this.socket.emit(EMIT.JOIN, data);
      this.socket.emit(EMIT.GET_ALL_PLAYERS);
    });

    this.socket.on("disconnect", (player: any) => {
      //send a leave event to the server with the player object
      const data = JSON.stringify({ player });
      this.socket.emit(EMIT.LEAVE, data);
    });
  }

  public addPoints(id: string, points: number) {
    const player = this.players.get(id);
    if (player) {
      player.score += points;
      this.updatePlayerScoreTop();
    } else if (this.currentPlayer.id === id) {
      this.currentPlayer.score += points;
    }
  }

  public updatePlayerScoreTop() {
    const players = this.getPlayers();
    players.push(this.currentPlayer);
    players.sort((a, b) => b.score - a.score);
    const top = players;
    console.log(top);
    let tempHTML = "";
    top.forEach((player) => {
      tempHTML += `<p>${player.name}: ${player.score}</p>`;
    });

    this.topPlayers.innerHTML = tempHTML;
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
