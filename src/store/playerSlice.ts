import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  player1Name: string;
  player2Name: string;
  theme: 'dark' | 'light';
  accentColor: string;
}

const initialState: PlayerState = {
  player1Name: localStorage.getItem('player1Name') || 'Player 1',
  player2Name: localStorage.getItem('player2Name') || 'Player 2',
  theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
  accentColor: localStorage.getItem('accentColor') || '#3498DB'
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer1Name: (state, action: PayloadAction<string>) => {
      state.player1Name = action.payload;
      localStorage.setItem('player1Name', action.payload);
    },
    setPlayer2Name: (state, action: PayloadAction<string>) => {
      state.player2Name = action.payload;
      localStorage.setItem('player2Name', action.payload);
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
      localStorage.setItem('accentColor', action.payload);
    }
  }
});

export const { setPlayer1Name, setPlayer2Name, setTheme, setAccentColor } = playerSlice.actions;
export default playerSlice.reducer; 