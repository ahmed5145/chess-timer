import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice.ts';
import settingsReducer from './settingsSlice.ts';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 