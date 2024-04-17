import "./style.css";
import { k } from "./game/back-setup";
import { State } from "./state/state";
import { IPlayer, Player } from "./game/objects/Player";
import { EMIT, ON } from "./contants/constants";
import {
  createCoin,
  createCoins,
  createPlayer,
  createPlayers,
} from "./game/back-setup/create-player";
import { movePlayer } from "./socket/emits";
import { getPlayerName } from "./game/helpers/get-players";
import { generateHtml } from "./game/logic/getRandomOperation";

export default () => {
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
    getPlayerName(),
  ]);

  State.getInstance().setCurrentPlayer(new Player(getPlayerName()!, player));
  State.getInstance().setSocket();
  State.getInstance().currentPlayer.name = getPlayerName();

  k.scene("game", async () => {
    const mapData = await fetch("/map.json").then((res) => res.json());

    const layers = mapData.layers;

    const map = k.add([k.sprite("map"), k.pos(-1200, -600), k.scale(4)]);

    player.onCollide("coin", (coin) => {
      console.log("coin collected");

      State.getInstance().socket.emit(EMIT.COIN_COLLECTED, {
        x: coin.pos.x,
        y: coin.pos.y,
      });

      const html = generateHtml();
      document.getElementById("dialog")!.classList.remove("hidden");
      State.getInstance().dialog.innerHTML = html;

      coin.destroy();
    });

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
            k.add(player);
          }
        }
      }
    }

    k.onUpdate(() => {
      k.camPos(player.pos);
    });

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
      .on(ON.GET_OBJECTS, (data: { positions: { x: number; y: number }[] }) => {
        createCoins(k, data.positions);
        console.log(State.getInstance().coins);
      });

    State.getInstance()
      .getSocket()
      .on(ON.MOVE, (data: { id: string; direction: any; x: any; y: any }) => {
        const player = State.getInstance().players.get(data.id);
        //player?.kPlayer.moveTo(data.x, data.y);
        player?.kPlayer.play(`walk-${data.direction}`);
        player?.kPlayer.moveTo(data.x, data.y);
      });

    State.getInstance()
      .getSocket()
      .on(ON.JOINED, (data: { player: IPlayer }) => {
        console.log("joined", data.player);
        createPlayer(k, data.player, mySpawnpoint);
        State.getInstance().updatePlayerScoreTop();
      });

    State.getInstance()
      .getSocket()
      .on(ON.GET_ALL_PLAYERS, (data: { clients: string }) => {
        const players: IPlayer[] = JSON.parse(data.clients);
        createPlayers(k, players);
        State.getInstance().updatePlayerScoreTop();
      });
  });

  State.getInstance()
    .getSocket()
    .on(ON.LEAVE, (data: { id: string }) => {
      const player = State.getInstance().getPlayerById(data.id);
      player?.kPlayer.destroy();
      State.getInstance().removePlayer(data.id);
    });

  State.getInstance()
    .getSocket()
    .on(
      ON.NEW_OBJECT,
      (data: { x: number; y: number; remove: { x: number; y: number } }) => {
        if (State.getInstance().coins.length > 0) {
          const coin = State.getInstance().coins.find(
            (x) => x.pos.x === data.remove.x && x.pos.y === data.remove.y
          );
          coin?.destroy();
        }

        State.getInstance().coins.filter(
          (x) => x.pos.x !== data.remove.x && x.pos.y !== data.remove.y
        );
        createCoin(k, { x: data.x, y: data.y });
      }
    );

  State.getInstance()
    .getSocket()
    .on(ON.REMOVE_COIN, (data: { x: number; y: number }) => {
      const coin = State.getInstance().coins.find(
        (x) => x.pos.x === data.x && x.pos.y === data.y
      );
      coin?.destroy();
      State.getInstance().coins.filter(
        (coin) => coin.pos.x !== data.x && coin.pos.y !== data.y
      );
    });

  State.getInstance()
    .getSocket()
    .on(ON.SUM_SCORE, (data: { id: string; points: number }) => {
      console.log("sum score", data);
      const player = State.getInstance();
      player?.addPoints(data.id, data.points);
    });

  k.go("game");
};
