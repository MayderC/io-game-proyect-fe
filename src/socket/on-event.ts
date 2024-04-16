import { ON } from "../contants/constants";
import { Player } from "../game/objects/Player";
import { State } from "../state/state";

const instance = State.getInstance();
const socket = instance.getSocket();

export const onAttack = () => {
  socket.on(ON.ATTACK_ACTION, (data: { player: Player }) => {
    const player = instance.getPlayerById(data.player.id);
    player?.attack(data.player);
  });
};
