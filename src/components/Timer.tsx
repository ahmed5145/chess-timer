import React, { useEffect, useCallback } from 'react';
import styled, { ThemeProvider, keyframes, css } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import TimeControlConfig from './TimeControlConfig.tsx';
import Settings from './Settings.tsx';
import PlayerSettings from './PlayerSettings.tsx';
import { useSound } from '../utils/sound.ts';
import { updateTime, switchPlayer, startGame, stopGame, resetGame } from '../store/timerSlice.ts';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const buttonGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
  }
`;

interface GlowProps {
  accentColor?: string;
}

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const glowAnimation = keyframes<GlowProps>`
  0% {
    box-shadow: 0 0 5px ${props => props.accentColor || '#3498DB'};
  }
  50% {
    box-shadow: 0 0 20px ${props => props.accentColor || '#3498DB'};
  }
  100% {
    box-shadow: 0 0 5px ${props => props.accentColor || '#3498DB'};
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: ${props => props.theme.mode === 'dark' ? '#2C3E50' : '#ECF0F1'};
  color: ${props => props.theme.mode === 'dark' ? '#ECF0F1' : '#2C3E50'};
  transition: background-color 0.3s, color 0.3s;
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

const PlayerTimer = styled.div<{ isActive: boolean; isLowTime: boolean; theme: string; accentColor: string }>`
  background-color: ${props => props.theme === 'dark' ? '#2c3e50' : '#ecf0f1'};
  color: ${props => props.theme === 'dark' ? '#ecf0f1' : '#2c3e50'};
  border: 2px solid ${props => props.isActive ? props.accentColor : 'transparent'};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  
  ${props => props.isActive && activeTimerStyles}
  
  &:hover {
    transform: ${props => props.isActive ? 'scale(1.02)' : 'none'};
    box-shadow: ${props => props.isActive ? `0 0 15px ${props.accentColor}` : 'none'};
  }

  ${props => props.isLowTime && props.isActive && css`
    animation: ${buttonGlow} 1.5s infinite;
  `}
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

const Button = styled.button<{ theme: string; accentColor: string; variant?: 'start' | 'reset' }>`
  background: ${props => {
    if (props.variant === 'start') return 'linear-gradient(135deg, #2ecc71, #27ae60)';
    if (props.variant === 'reset') return 'linear-gradient(135deg, #e74c3c, #c0392b)';
    return props.theme === 'dark' ? '#34495e' : '#bdc3c7';
  }};
  color: #ecf0f1;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    background: ${props => {
      if (props.variant === 'start') return 'linear-gradient(135deg, #27ae60, #219a52)';
      if (props.variant === 'reset') return 'linear-gradient(135deg, #c0392b, #a93226)';
      return props.accentColor;
    }};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  ${props => props.variant === 'start' && css`
    animation: ${buttonGlow} 2s infinite;
  `}
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
  const { isMuted, isLowTimeWarningEnabled, lowTimeThreshold } = useSelector(
    (state: RootState) => state.settings
  );
  const { player1Name, player2Name, theme, accentColor } = useSelector(
    (state: RootState) => state.player
  );
  
  const themeObject = {
    mode: theme,
    accentColor: accentColor
  };

  const { playSound } = useSound(isMuted);
  
  // Add state to track if low time warning has been played
  const [hasPlayedLowTimeWarning1, setHasPlayedLowTimeWarning1] = React.useState(false);
  const [hasPlayedLowTimeWarning2, setHasPlayedLowTimeWarning2] = React.useState(false);

  // Reset warning flags when game is reset or stopped
  React.useEffect(() => {
    if (!isGameActive) {
      setHasPlayedLowTimeWarning1(false);
      setHasPlayedLowTimeWarning2(false);
    }
  }, [isGameActive]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (isGameActive) {
        playSound('switch');
        dispatch(switchPlayer());
      }
    }
  }, [dispatch, isGameActive, playSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGameActive) {
      interval = setInterval(() => {
        dispatch(updateTime(100)); // Update every 100ms
        
        // Check for low time warning
        if (isLowTimeWarningEnabled) {
          const activeTime = activePlayer === 1 
            ? player1Timer.currentTime 
            : player2Timer.currentTime;
            
          // Check if we should play the low time warning
          if (activePlayer === 1 && !hasPlayedLowTimeWarning1 && activeTime <= lowTimeThreshold && activeTime > 0) {
            playSound('lowTime');
            setHasPlayedLowTimeWarning1(true);
          } else if (activePlayer === 2 && !hasPlayedLowTimeWarning2 && activeTime <= lowTimeThreshold && activeTime > 0) {
            playSound('lowTime');
            setHasPlayedLowTimeWarning2(true);
          } else if (activeTime <= 0) {
            playSound('timeUp');
            dispatch(stopGame());
          }
        }
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isGameActive, dispatch, activePlayer, player1Timer.currentTime, player2Timer.currentTime, 
      isLowTimeWarningEnabled, lowTimeThreshold, playSound, hasPlayedLowTimeWarning1, hasPlayedLowTimeWarning2]);

  // Reset warning flags when switching players
  const handleTimerClick = (playerId: number) => {
    if (!isGameActive) return;
    if (activePlayer === playerId) {
      playSound('switch');
      dispatch(switchPlayer());
      // Reset warning flag for the player who's getting more time (via increment)
      if (playerId === 1) {
        setHasPlayedLowTimeWarning1(false);
      } else {
        setHasPlayedLowTimeWarning2(false);
      }
    }
  };

  const handleStart = () => {
    playSound('gameStart');
    dispatch(startGame());
  };

  const handleStop = () => {
    playSound('click');
    dispatch(stopGame());
  };

  const handleReset = () => {
    playSound('gameEnd');
    dispatch(resetGame());
    setHasPlayedLowTimeWarning1(false);
    setHasPlayedLowTimeWarning2(false);
  };

  const isLowTime = (time: number) => time < lowTimeThreshold;

  return (
    <ThemeProvider theme={themeObject}>
      <TimerContainer>
        <Title>Chess Timer</Title>
        {!isGameActive && (
          <>
            <TimeControlConfig />
            <PlayerSettings />
            <Settings />
          </>
        )}
        <TimerGrid>
          <PlayerTimer 
            isActive={activePlayer === 1} 
            isLowTime={isLowTime(player1Timer.currentTime)}
            theme={theme}
            accentColor={accentColor}
            onClick={() => handleTimerClick(1)}
          >
            <PlayerName>{player1Name}</PlayerName>
            <TimeDisplay isLowTime={isLowTime(player1Timer.currentTime)}>
              {formatTime(player1Timer.currentTime)}
            </TimeDisplay>
          </PlayerTimer>
          
          <PlayerTimer 
            isActive={activePlayer === 2}
            isLowTime={isLowTime(player2Timer.currentTime)}
            theme={theme}
            accentColor={accentColor}
            onClick={() => handleTimerClick(2)}
          >
            <PlayerName>{player2Name}</PlayerName>
            <TimeDisplay isLowTime={isLowTime(player2Timer.currentTime)}>
              {formatTime(player2Timer.currentTime)}
            </TimeDisplay>
          </PlayerTimer>
        </TimerGrid>

        <Controls>
          {!isGameActive ? (
            <Button 
              theme={theme}
              accentColor={accentColor}
              variant="start"
              onClick={handleStart}
            >
              Start Game
            </Button>
          ) : (
            <Button 
              theme={theme}
              accentColor={accentColor}
              onClick={handleStop}
            >
              Pause
            </Button>
          )}
          <Button 
            theme={theme}
            accentColor={accentColor}
            variant="reset"
            onClick={handleReset}
          >
            Reset
          </Button>
        </Controls>
      </TimerContainer>
    </ThemeProvider>
  );
};

export default Timer; 