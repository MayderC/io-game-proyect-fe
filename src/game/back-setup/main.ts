import Phaser from "phaser";
import { KEY } from "./keys";

const game = new Phaser.Game({
  parent: "app",
});

class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: KEY.PRELOAD_SCENE,
    });
  }

  create() {
    //create map
    //ground layer
  }
}

game.scene.add(KEY.PRELOAD_SCENE, MainScene);

export default game;
