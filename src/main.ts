import "./style.css";
import { game } from "./game/back-setup/main";
import { State } from "./state/state";
console.log("Hello from main.ts!");
game.scene.start("GameScene");

State.getInstance().setSocket();
