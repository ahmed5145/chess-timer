import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice.ts';
import settingsReducer from './settingsSlice.ts';
import playerReducer from './playerSlice.ts';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    settings: settingsReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 