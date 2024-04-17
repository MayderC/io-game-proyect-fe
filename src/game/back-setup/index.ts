import kaboom from "kaboom";

const k = kaboom({
  canvas: document.getElementById("game") as HTMLCanvasElement,
  global: false,
  touchToMouse: true,
});

k.loadSprite("test", "spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    "idle-down": 936,
    "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
    "idle-right": 975,
    "walk-right": { from: 975, to: 978, loop: true, speed: 8 },
    "idle-left": 1053,
    "walk-left": { from: 1053, to: 1056, loop: true, speed: 8 },
    "idle-up": 1014,
    "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
    "attack-down": { from: 1092, to: 1092, loop: false, speed: 8 },
    "attack-left": { from: 1093, to: 1093, loop: false, speed: 8 },
    "attack-up": { from: 1094, to: 1094, loop: false, speed: 8 },
    "attack-right": { from: 1095, to: 1095, loop: false, speed: 8 },
  },
});

k.loadSprite("vault", "spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    open: { from: 137, to: 138, loop: false, speed: 8 },
  },
});

k.loadSprite("key", "spritesheet.png", {
  sliceX: 39,
  sliceY: 31,
  anims: {
    idle: 99,
  },
});

k.loadSprite("map", "map.png");

k.setBackground(k.Color.fromHex("#311047"));

export { k };
