import React, { useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { updateTime, switchPlayer, startGame, stopGame, resetGame } from '../store/timerSlice.ts';
import TimeControlConfig from './TimeControlConfig.tsx';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  70% {
    transform: scale(1.01);
    box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
  }
`;

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  color: white;
  padding: 16px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #fff;
  text-shadow: 0 2px 10px rgba(52, 152, 219, 0.5);
  letter-spacing: 1.5px;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    border-radius: 2px;
  }
`;

const TimerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 700px;
  margin-top: 16px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    gap: 12px;
    padding: 12px;
  }
`;

const activeTimerStyles = css`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  box-shadow: 0 8px 32px rgba(52, 152, 219, 0.3);
  animation: ${glowAnimation} 2s infinite ease-in-out;
  transform: scale(1.02);
`;

const PlayerTimer = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  padding: 24px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${props => props.isActive && activeTimerStyles}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    transform: scaleX(${props => props.isActive ? 1 : 0});
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: ${props => props.isActive ? 'scale(1.02)' : 'scale(1.01)'};
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PlayerName = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #ecf0f1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const TimeDisplay = styled.div<{ isLowTime: boolean }>`
  font-size: 3rem;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  color: ${props => props.isLowTime ? '#e74c3c' : '#fff'};
  text-shadow: ${props => props.isLowTime 
    ? '0 0 10px rgba(231, 76, 60, 0.5)'
    : '0 0 10px rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  animation: ${props => props.isLowTime ? pulse : 'none'} 1s infinite;
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => props.isLowTime 
    ? 'rgba(231, 76, 60, 0.1)'
    : 'rgba(255, 255, 255, 0.05)'};

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const buttonGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); }
  50% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.8); }
  100% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); }
`;

const Button = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
  }

  &:hover {
    transform: translateY(-2px);
    animation: ${buttonGlow} 2s infinite;

    &:before {
      transform: translateX(100%);
      transition: transform 0.6s ease;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
    cursor: not-allowed;
    transform: none;
  }
`;

const ResetButton = styled(Button)`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);

  &:hover {
    background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
  }
`;

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
};

const Timer: React.FC = () => {
  const dispatch = useDispatch();
  const { player1Timer, player2Timer, isGameActive, activePlayer } = useSelector(
    (state: RootState) => state.timer
  );

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (isGameActive) {
        dispatch(switchPlayer());
      }
    }
  }, [dispatch, isGameActive]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGameActive) {
      interval = setInterval(() => {
        dispatch(updateTime(100)); // Update every 100ms
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isGameActive, dispatch]);

  const handleTimerClick = (playerId: number) => {
    if (!isGameActive) return;
    if (activePlayer === playerId) {
      dispatch(switchPlayer());
    }
  };

  const handleStart = () => {
    dispatch(startGame());
  };

  const handleStop = () => {
    dispatch(stopGame());
  };

  const handleReset = () => {
    dispatch(resetGame());
  };

  const isLowTime = (time: number) => time < 30000; // Less than 30 seconds

  return (
    <TimerContainer>
      <Title>Chess Timer</Title>
      {!isGameActive && <TimeControlConfig />}
      <TimerGrid>
        <PlayerTimer
          isActive={activePlayer === 1}
          onClick={() => handleTimerClick(1)}
        >
          <PlayerName>Player 1</PlayerName>
          <TimeDisplay isLowTime={isLowTime(player1Timer.currentTime)}>
            {formatTime(player1Timer.currentTime)}
          </TimeDisplay>
        </PlayerTimer>
        
        <PlayerTimer
          isActive={activePlayer === 2}
          onClick={() => handleTimerClick(2)}
        >
          <PlayerName>Player 2</PlayerName>
          <TimeDisplay isLowTime={isLowTime(player2Timer.currentTime)}>
            {formatTime(player2Timer.currentTime)}
          </TimeDisplay>
        </PlayerTimer>
      </TimerGrid>

      <Controls>
        {!isGameActive ? (
          <Button onClick={handleStart}>Start Game</Button>
        ) : (
          <Button onClick={handleStop}>Pause</Button>
        )}
        <ResetButton onClick={handleReset}>Reset</ResetButton>
      </Controls>
    </TimerContainer>
  );
};

export default Timer; 