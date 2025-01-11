export interface TimerState {
  initialTime: number;
  currentTime: number;
  increment: number;
  isActive: boolean;
  playerId: number;
}

export interface GameState {
  player1Timer: TimerState;
  player2Timer: TimerState;
  isGameActive: boolean;
  activePlayer: number | null;
}

export interface TimeControl {
  minutes: number;
  seconds: number;
  increment: number;
}

export type TimeFormat = '1+0' | '1+1' | '3+0' | '3+2' | '5+0' | '5+3' | '10+0' | '15+10' | 'custom'; 