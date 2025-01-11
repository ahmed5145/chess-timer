import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  isMuted: boolean;
  volume: number;
  isLowTimeWarningEnabled: boolean;
  lowTimeThreshold: number; // in milliseconds
}

const initialState: SettingsState = {
  isMuted: false,
  volume: 0.7,
  isLowTimeWarningEnabled: true,
  lowTimeThreshold: 30000, // 30 seconds
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
    toggleLowTimeWarning: (state) => {
      state.isLowTimeWarningEnabled = !state.isLowTimeWarningEnabled;
    },
    setLowTimeThreshold: (state, action: PayloadAction<number>) => {
      state.lowTimeThreshold = action.payload;
    },
  },
});

export const {
  toggleMute,
  setVolume,
  toggleLowTimeWarning,
  setLowTimeThreshold,
} = settingsSlice.actions;

export default settingsSlice.reducer; 