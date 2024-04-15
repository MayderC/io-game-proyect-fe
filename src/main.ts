import "./style.css";
import { k } from "./game/back-setup";

//State.getInstance().setCurrentPlayer(new Player("player"));
//State.getInstance().setSocket();

k.scene("game", async () => {
  const mapData = await fetch("/map.json").then((res) => res.json());

  const layers = mapData.layers;

  const map = k.add([k.sprite("map"), k.pos(-1200, -600), k.scale(4)]);

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

  for (const layer of layers) {
    if (layer.type === "boundaries") {
      for (const boundary of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
          }),
          k.body({ isStatic: true }),
          k.pos(boundary.x, boundary.y),
          boundary.name,
        ]);

        if (boundary.name) {
          player.onCollide(boundary.name, () => {
            player.isInDialog = true;
            //todo: show dialog
          });
        }
      }
      continue;
    }

    if (layer.name == "spawnpoint") {
      for (const spawnpoint of layer.objects) {
        if (spawnpoint.id === 1) {
          player.pos = k.vec2(
            map.pos.x + spawnpoint.x * 3,
            map.pos.y + spawnpoint.y * 3
          );
        }
        k.add(player);
      }
    }
  }

  k.onUpdate(() => {
    //move more smooth came
    k.camPos(player.pos);
  });

  //use dt() to make movement framerate independent

  k.onKeyPress("left", () => {
    player.play("walk-left");
  });
  k.onKeyDown("left", () => {
    player.direction = "left";
    player.moveTo(player.pos.x - player.speed * k.dt(), player.pos.y);
  });

  k.onKeyPress("right", () => {
    player.play("walk-right");
  });
  k.onKeyDown("right", () => {
    player.direction = "right";
    player.moveTo(player.pos.x + player.speed * k.dt(), player.pos.y);
  });

  k.onKeyPress("up", () => {
    player.play("walk-up");
  });

  k.onKeyDown("up", () => {
    player.direction = "up";
    player.moveTo(player.pos.x, player.pos.y - player.speed * k.dt());
  });

  k.onKeyPress("down", () => {
    player.play("walk-down");
  });

  k.onKeyDown("down", () => {
    player.direction = "down";
    //use dt() to make movement framerate independent
    player.moveTo(player.pos.x, player.pos.y + player.speed * k.dt());
  });
});

k.go("game");
