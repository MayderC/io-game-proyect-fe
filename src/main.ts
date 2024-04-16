import "./style.css";
import { k } from "./game/back-setup";
import { State } from "./state/state";
import { Player } from "./game/objects/Player";
import { EMIT, ON } from "./contants/constants";
import { createPlayer } from "./game/back-setup/create-player";
import { movePlayer } from "./socket/emits";

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
  "player",
]);

State.getInstance().setCurrentPlayer(new Player("player", player));
State.getInstance().setSocket();

console.log("current player", State.getInstance().getCurrentPlayer());

k.scene("game", async () => {
  const mapData = await fetch("/map.json").then((res) => res.json());

  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(-1200, -600), k.scale(4)]);

  let mySpawnpoint = {
    x: 0,
    y: 0,
  };

  for (const layer of layers) {
    if (layer.name === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);
      }
    }

    if (layer.name == "spawnpoint") {
      for (const spawnpoint of layer.objects) {
        if (spawnpoint.id === 1) {
          player.pos = k.vec2(
            map.pos.x + spawnpoint.x * 4,
            map.pos.y + spawnpoint.y * 4
          );

          mySpawnpoint.x = map.pos.x + spawnpoint.x * 4;
          mySpawnpoint.y = map.pos.y + spawnpoint.y * 4;
        }
        k.add(player);
      }
    }
  }

  k.onUpdate(() => {
    //move more smooth came
    k.camPos(player.pos);
  });

  k.onCollide("player", "key", (player, boundary) => {
    console.log("collide");
  });

  k.onCollide("player", "vault", (player, boundary) => {
    console.log("collide");
  });

  //use dt() to make movement framerate independent

  k.onKeyPress("left", () => {
    player.play("walk-left");
  });
  k.onKeyDown("left", () => {
    player.direction = "left";
    player.moveTo(player.pos.x - player.speed * k.dt(), player.pos.y);
    movePlayer({
      direction: player.direction,
      x: player.pos.x,
      y: player.pos.y,
      id: State.getInstance().getCurrentPlayer().id,
    });
  });

  k.onKeyPress("right", () => {
    player.play("walk-right");
  });
  k.onKeyDown("right", () => {
    player.direction = "right";
    player.moveTo(player.pos.x + player.speed * k.dt(), player.pos.y);
    movePlayer({
      direction: player.direction,
      x: player.pos.x,
      y: player.pos.y,
      id: State.getInstance().getCurrentPlayer().id,
    });
  });

  k.onKeyPress("up", () => {
    player.play("walk-up");
  });

  k.onKeyDown("up", () => {
    player.direction = "up";
    player.moveTo(player.pos.x, player.pos.y - player.speed * k.dt());
    movePlayer({
      direction: player.direction,
      x: player.pos.x,
      y: player.pos.y,
      id: State.getInstance().getCurrentPlayer().id,
    });
  });

  k.onKeyPress("down", () => {
    player.play("walk-down");
  });

  k.onKeyDown("down", () => {
    player.direction = "down";
    //use dt() to make movement framerate independent
    player.moveTo(player.pos.x, player.pos.y + player.speed * k.dt());
    movePlayer({
      direction: player.direction,
      x: player.pos.x,
      y: player.pos.y,
      id: State.getInstance().getCurrentPlayer().id,
    });
  });

  State.getInstance()
    .getSocket()
    .on(ON.MOVE, (data) => {
      const player = State.getInstance().players.get(data.id);
      //player?.kPlayer.moveTo(data.x, data.y);
      player?.kPlayer.play(`walk-${data.direction}`);
      player?.kPlayer.moveTo(data.x, data.y);
    });

  State.getInstance()
    .getSocket()
    .on(ON.JOINED, (data) => {
      createPlayer(k, data.player, mySpawnpoint);
    });
});

State.getInstance()
  .getSocket()
  .on(ON.LEAVE, (data) => {
    const player = State.getInstance().getPlayerById(data.id);

    player?.kPlayer.destroy();

    State.getInstance().removePlayer(data.id);
  });

k.go("game");
