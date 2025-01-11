import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import {
  toggleMute,
  setVolume,
  toggleLowTimeWarning,
  setLowTimeThreshold,
} from '../store/settingsSlice.ts';

const SettingsContainer = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 20px;
  font-size: 1.4rem;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  font-weight: 600;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Toggle = styled.button<{ isActive: boolean }>`
  background: ${props => props.isActive 
    ? 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
    : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'};
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 24px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isActive ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
`;

const Slider = styled.input`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #2980b9;
      transform: scale(1.1);
    }
  }
`;

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const {
    isMuted,
    volume,
    isLowTimeWarningEnabled,
    lowTimeThreshold,
  } = useSelector((state: RootState) => state.settings);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(parseFloat(e.target.value)));
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLowTimeThreshold(parseInt(e.target.value) * 1000)); // Convert to milliseconds
  };

  return (
    <SettingsContainer>
      <Title>Settings</Title>
      <SettingsGrid>
        <SettingRow>
          <Label>Sound</Label>
          <Toggle
            isActive={!isMuted}
            onClick={() => dispatch(toggleMute())}
            aria-label="Toggle sound"
          />
        </SettingRow>

        <SettingRow>
          <Label>Volume</Label>
          <Slider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={isMuted}
          />
        </SettingRow>

        <SettingRow>
          <Label>Low Time Warning</Label>
          <Toggle
            isActive={isLowTimeWarningEnabled}
            onClick={() => dispatch(toggleLowTimeWarning())}
            aria-label="Toggle low time warning"
          />
        </SettingRow>

        <SettingRow>
          <Label>Low Time Threshold (seconds)</Label>
          <Slider
            type="range"
            min="5"
            max="60"
            step="5"
            value={lowTimeThreshold / 1000}
            onChange={handleThresholdChange}
            disabled={!isLowTimeWarningEnabled}
          />
        </SettingRow>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings; 