import { KaboomCtx } from "kaboom";
import { State } from "../../state/state";
import { Player } from "../objects/Player";

export const createPlayer = (k: KaboomCtx, playerState: Player, spawn: any) => {
  const player = k.make([
    k.sprite("test", {
      anim: "idle-down",
    }),
    k.area({
      shape: new k.Rect(k.vec2(0, 0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(k.vec2(spawn.x, spawn.y)),
    k.scale(4),
    {
      speed: 120,
      direction: "down",
      isInDialog: false,
    },
    playerState.id,
  ]);

  k.add(player);
  console.log(player, "CREANDO PLAYER");

  playerState.kPlayer = player;
  State.getInstance().addPlayer(playerState);
  console.log(State.getInstance().players);
};

export const createPlayers = (k: KaboomCtx, players: Player[]) => {
  console.log("PLAYERS", players);

  players.forEach((player) => {
    createPlayer(k, player, {
      x: player.kPlayer.pos.x,
      y: player.kPlayer.pos.y,
    });
  });
};
