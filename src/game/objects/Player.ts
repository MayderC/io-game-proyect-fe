import { GameObj } from "kaboom";

export interface IPlayer {
  id: string;
  name: string;
  x: number;
  y: number;
}

export class Player {
  public id: string = "";
  public name: string;
  public score: number;
  public lives: number = 3;
  public livePercentage: number = 100;
  public isAlive: boolean = true;
  public isWinner: boolean = false;
  public iDefending: boolean = false;
  public isReading: boolean = false;
  public team: string = "red";
  public kPlayer: GameObj;

  constructor(name: string, kPlayer: GameObj) {
    this.name = name;
    this.score = 0;
    this.kPlayer = kPlayer;
  }

  public incrementScore() {
    this.score++;
  }

  public decrementLives() {
    this.lives--;
    if (this.lives === 0) {
      this.isAlive = false;
    }
  }

  private incrementLivePercentage() {
    if (this.livePercentage < 100) {
      this.livePercentage += 10;
    }
  }

  private decrementLivePercentage() {
    if (this.livePercentage > 0) {
      this.livePercentage -= 10;
    }
  }

  public eatFood() {
    this.incrementLivePercentage();
  }

  public attack(enemy: Player) {
    if (enemy.iDefending || enemy.isReading) return;
    enemy.decrementLivePercentage();
  }

  public defend() {}
}
