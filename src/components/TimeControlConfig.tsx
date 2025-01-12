import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import { setTimeControl } from '../store/timerSlice.ts';
import { TimeFormat } from '../types/timer.ts';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const ConfigContainer = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #3498db, #2ecc71, #3498db);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite linear;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 20px;
  font-size: 1.4rem;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  font-weight: 600;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    color: #2ecc71;
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

const ContentContainer = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'block'};
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 10px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
  }
`;

const PresetButton = styled.button<{ isSelected: boolean }>`
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: ${props => props.isSelected 
    ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
    : 'linear-gradient(135deg, rgba(52, 152, 219, 0.3) 0%, rgba(41, 128, 185, 0.3) 100%)'};
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: ${props => props.isSelected 
    ? '0 6px 16px rgba(231, 76, 60, 0.3)'
    : '0 4px 12px rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.isSelected 
    ? 'rgba(231, 76, 60, 0.5)'
    : 'rgba(255, 255, 255, 0.1)'};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: translateX(-100%);
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.isSelected 
      ? '0 8px 20px rgba(231, 76, 60, 0.4)'
      : '0 6px 16px rgba(0, 0, 0, 0.3)'};

    &:before {
      transform: translateX(100%);
      transition: transform 0.6s ease;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const CustomInputs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 0.9rem;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #3498db;
    background: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3), 
                inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    border-color: rgba(52, 152, 219, 0.5);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const timePresets: { [key in TimeFormat]: { minutes: number; seconds: number; increment: number } } = {
  '1+0': { minutes: 1, seconds: 0, increment: 0 },
  '1+1': { minutes: 1, seconds: 0, increment: 1 },
  '3+0': { minutes: 3, seconds: 0, increment: 0 },
  '3+2': { minutes: 3, seconds: 0, increment: 2 },
  '5+0': { minutes: 5, seconds: 0, increment: 0 },
  '5+3': { minutes: 5, seconds: 0, increment: 3 },
  '10+0': { minutes: 10, seconds: 0, increment: 0 },
  '15+10': { minutes: 15, seconds: 0, increment: 10 },
  'custom': { minutes: 5, seconds: 0, increment: 0 },
};

const TimeControlConfig: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedPreset, setSelectedPreset] = useState<TimeFormat>('5+3');
  const [customTime, setCustomTime] = useState({
    minutes: 5,
    seconds: 0,
    increment: 0,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePresetSelect = (preset: TimeFormat) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      dispatch(setTimeControl(timePresets[preset]));
    }
  };

  const handleCustomTimeChange = (
    field: 'minutes' | 'seconds' | 'increment',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const newCustomTime = { ...customTime, [field]: numValue };
    setCustomTime(newCustomTime);
    if (selectedPreset === 'custom') {
      dispatch(setTimeControl(newCustomTime));
    }
  };

  return (
    <ConfigContainer>
      <Title onClick={() => setIsCollapsed(!isCollapsed)}>
        <ChevronIcon isCollapsed={isCollapsed} />
        Time Control
      </Title>
      <ContentContainer isCollapsed={isCollapsed}>
        <PresetGrid>
          {(Object.keys(timePresets) as TimeFormat[]).map(preset => (
            <PresetButton
              key={preset}
              isSelected={selectedPreset === preset}
              onClick={() => handlePresetSelect(preset)}
            >
              {preset}
            </PresetButton>
          ))}
        </PresetGrid>

        {selectedPreset === 'custom' && (
          <CustomInputs>
            <InputGroup>
              <Label>Minutes</Label>
              <Input
                type="number"
                min="0"
                value={customTime.minutes}
                onChange={(e) => handleCustomTimeChange('minutes', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Seconds</Label>
              <Input
                type="number"
                min="0"
                max="59"
                value={customTime.seconds}
                onChange={(e) => handleCustomTimeChange('seconds', e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Label>Increment (sec)</Label>
              <Input
                type="number"
                min="0"
                value={customTime.increment}
                onChange={(e) => handleCustomTimeChange('increment', e.target.value)}
              />
            </InputGroup>
          </CustomInputs>
        )}
      </ContentContainer>
    </ConfigContainer>
  );
};

export default TimeControlConfig; 