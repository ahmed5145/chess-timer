import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, TimeControl } from '../types/timer';

const initialState: GameState = {
  player1Timer: {
    initialTime: 5 * 60 * 1000, // 5 minutes in milliseconds
    currentTime: 5 * 60 * 1000,
    increment: 3 * 1000, // 3 seconds increment
    isActive: false,
    playerId: 1,
  },
  player2Timer: {
    initialTime: 5 * 60 * 1000,
    currentTime: 5 * 60 * 1000,
    increment: 3 * 1000,
    isActive: false,
    playerId: 2,
  },
  isGameActive: false,
  activePlayer: null,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setTimeControl: (state, action: PayloadAction<TimeControl>) => {
      const { minutes, seconds, increment } = action.payload;
      const totalTime = (minutes * 60 + seconds) * 1000;
      const incrementMs = increment * 1000;
      
      state.player1Timer.initialTime = totalTime;
      state.player1Timer.currentTime = totalTime;
      state.player1Timer.increment = incrementMs;
      
      state.player2Timer.initialTime = totalTime;
      state.player2Timer.currentTime = totalTime;
      state.player2Timer.increment = incrementMs;
    },
    
    startGame: (state) => {
      state.isGameActive = true;
      state.activePlayer = 1;
      state.player1Timer.isActive = true;
      state.player2Timer.isActive = false;
    },
    
    stopGame: (state) => {
      state.isGameActive = false;
      state.activePlayer = null;
      state.player1Timer.isActive = false;
      state.player2Timer.isActive = false;
    },
    
    switchPlayer: (state) => {
      if (!state.isGameActive) return;
      
      const currentPlayer = state.activePlayer;
      const nextPlayer = currentPlayer === 1 ? 2 : 1;
      
      // Add increment to the player who just completed their move
      if (currentPlayer === 1) {
        state.player1Timer.currentTime += state.player1Timer.increment;
        state.player1Timer.isActive = false;
        state.player2Timer.isActive = true;
      } else {
        state.player2Timer.currentTime += state.player2Timer.increment;
        state.player2Timer.isActive = false;
        state.player1Timer.isActive = true;
      }
      
      state.activePlayer = nextPlayer;
    },
    
    updateTime: (state, action: PayloadAction<number>) => {
      const elapsedMs = action.payload;
      if (state.activePlayer === 1) {
        state.player1Timer.currentTime = Math.max(0, state.player1Timer.currentTime - elapsedMs);
      } else if (state.activePlayer === 2) {
        state.player2Timer.currentTime = Math.max(0, state.player2Timer.currentTime - elapsedMs);
      }
    },
    
    resetGame: (state) => {
      state.player1Timer.currentTime = state.player1Timer.initialTime;
      state.player2Timer.currentTime = state.player2Timer.initialTime;
      state.isGameActive = false;
      state.activePlayer = null;
      state.player1Timer.isActive = false;
      state.player2Timer.isActive = false;
    },
  },
});

export const {
  setTimeControl,
  startGame,
  stopGame,
  switchPlayer,
  updateTime,
  resetGame,
} = timerSlice.actions;

export default timerSlice.reducer; 