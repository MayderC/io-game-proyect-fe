import { GameObj, KaboomCtx } from "kaboom";
import { State } from "../../state/state";
import { Player } from "../objects/Player";

export const createPlayer = (
  k: KaboomCtx,
  playerState: Player,
  spawn: GameObj
) => {
  const player = k.make([
    k.sprite("test", {
      anim: "idle-down",
    }),
    k.area({
      shape: new k.Rect(k.vec2(0, 0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(100, 100),
    k.scale(4),
    {
      speed: 120,
      direction: "down",
      isInDialog: false,
    },
    playerState.id,
  ]);

  player.pos = k.vec2(spawn.x, spawn.y);
  k.add(player);
  console.log(player, "player");

  player.onUpdate(() => {});

  playerState.kPlayer = player;
  State.getInstance().addPlayer(playerState);
  console.log(State.getInstance().players);
};
