import { State } from "../state/state";
import { EMIT } from "../contants/constants";
import { Player } from "../game/objects/Player";

const socket = State.getInstance().getSocket();

export const movePlayer = (x: number, y: number) => {
  socket.emit(EMIT.MOVE, { x, y });
};

export const attack = (player: Player) => {
  socket.emit(EMIT.ATTACK, { player });
};

export const defendStart = () => {
  socket.emit(EMIT.DEFEND_START);
};

export const defendEnd = () => {
  socket.emit(EMIT.DEFEND_END);
};

export const sumScore = (score: number) => {
  socket.emit(EMIT.SUM_SCORE, { score });
};
