import { GameObj } from "kaboom";

export class Player {
  public id: string = window.crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16);
  public name: string;
  public score: number;
  public lives: number = 3;
  public livePercentage: number = 100;
  public isAlive: boolean = true;
  public isWinner: boolean = false;
  public iDefending: boolean = false;
  public isReading: boolean = false;
  public team: string = "red";
  public x: number = 0;
  public y: number = 0;
  public kPlayer: GameObj;

  constructor(name: string, kPlayer: GameObj) {
    this.name = name;
    this.score = 0;
    this.kPlayer = kPlayer;
  }

  public incrementScore() {
    this.score++;
  }

  public move(x: number, y: number) {
    // move player to x, y

    this.x = x;
    this.y = y;
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
