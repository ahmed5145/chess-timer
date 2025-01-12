import React, { useState } from 'react';
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
  transition: all 0.3s ease;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 20px;
  font-size: 1.4rem;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    color: #3498db;
  }
`;

const ChevronIcon = styled.span<{ isCollapsed: boolean }>`
  display: inline-block;
  transform: ${props => props.isCollapsed ? 'rotate(-90deg)' : 'rotate(90deg)'};
  transition: transform 0.3s ease;
  &:after {
    content: '›';
    font-size: 1.5rem;
  }
`;

const SettingsGrid = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'grid'};
  gap: 16px;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
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

const ThresholdInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ThresholdControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NumberInput = styled.input`
  width: 60px;
  padding: 8px;
  border: 2px solid rgba(52, 152, 219, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1rem;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;

  &:focus {
    outline: none;
    border-color: #3498db;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 0;
  }
`;

const PresetButton = styled.button<{ isSelected?: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.isSelected 
    ? 'linear-gradient(135deg, #3498db, #2980b9)'
    : 'rgba(52, 152, 219, 0.2)'};
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isSelected 
      ? 'linear-gradient(135deg, #2980b9, #2472a4)'
      : 'rgba(52, 152, 219, 0.3)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StepButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(52, 152, 219, 0.2);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(52, 152, 219, 0.3);
  }

  &:active {
    transform: scale(0.95);
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(parseFloat(e.target.value)));
  };

  const commonThresholds = [10, 30, 60];

  const handleThresholdStep = (step: number) => {
    const newValue = Math.max(1, Math.min(300, lowTimeThreshold / 1000 + step));
    dispatch(setLowTimeThreshold(newValue * 1000));
  };

  return (
    <SettingsContainer>
      <Title onClick={() => setIsCollapsed(!isCollapsed)}>
        <ChevronIcon isCollapsed={isCollapsed} />
        Game Settings
      </Title>
      <SettingsGrid isCollapsed={isCollapsed}>
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
          <ThresholdInputGroup>
            <Label>Low Time Threshold</Label>
            <ThresholdControls>
              <StepButton onClick={() => handleThresholdStep(-5)}>-</StepButton>
              <NumberInput
                type="number"
                min="1"
                max="300"
                value={lowTimeThreshold / 1000}
                onChange={(e) => dispatch(setLowTimeThreshold(parseInt(e.target.value) * 1000))}
                disabled={!isLowTimeWarningEnabled}
              />
              <StepButton onClick={() => handleThresholdStep(5)}>+</StepButton>
              {commonThresholds.map(seconds => (
                <PresetButton
                  key={seconds}
                  isSelected={lowTimeThreshold === seconds * 1000}
                  onClick={() => dispatch(setLowTimeThreshold(seconds * 1000))}
                  disabled={!isLowTimeWarningEnabled}
                >
                  {seconds}s
                </PresetButton>
              ))}
            </ThresholdControls>
          </ThresholdInputGroup>
        </SettingRow>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default Settings; 