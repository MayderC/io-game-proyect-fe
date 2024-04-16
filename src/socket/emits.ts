import { State } from "../state/state";
import { EMIT } from "../contants/constants";
import { Player } from "../game/objects/Player";

type movePlayerType = {
  x: number;
  y: number;
  direction: string;
  id: string;
};
export const movePlayer = (data: movePlayerType) => {
  const socket = State.getInstance().getSocket();
  socket.emit(EMIT.MOVE, data);
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
