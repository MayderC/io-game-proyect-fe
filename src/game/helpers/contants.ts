export enum OBJECT_TYPES {
  PLAYER = 'player',
  FOOD = 'food',
  ENEMY = 'enemy',
  EXAM = 'exam'
}

export enum PLAYER_STATES {
  IDLE = 'idle',
  WALKING = 'walking',
  ATTACKING = 'attacking',
  DEAD = 'dead',
  WIN = 'win',
  DEFEND = 'defend'
}

export enum PLAYER_TEAMS {
  RED = 'red',
  BLUE = 'blue'
}

export const KEY_CODES = {
  keyArrowUp: 'w',
  keyArrowDown: 's',
  keyArrowLeft: 'a',
  keyArrowRight: 'd',
  keyW: 'w',
  keyA: 'a',
  keyS: 's',
  keyD: 'd',
  shift: 'Shift',
  enter: 'Enter'
}

export const CODES_ACTION = {}
