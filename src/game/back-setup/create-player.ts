import { KaboomCtx } from "kaboom";

export const createPlayer = (k: KaboomCtx, name: string) => {
  k.make([
    k.sprite("spritesheet", {
      anim: "idle-down",
    }),
    k.area({
      shape: new k.Rect(k.vec2(0, 0), 10, 10),
    }),
    k.body(),
    k.anchor("center"),
    k.pos(100, 100),
    k.scale(3),
    {
      speed: 120,
      direction: "down",
      isInDialog: false,
    },
    name,
  ]);
};
