import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { setPlayer1Name, setPlayer2Name, setTheme, setAccentColor } from '../store/playerSlice.ts';

const SettingsContainer = styled.div`
  background: rgba(44, 62, 80, 0.95);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const Title = styled.h2`
  color: #ECF0F1;
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    color: #3498DB;
  }
`;

const SettingsGrid = styled.div<{ isCollapsed: boolean }>`
  display: ${props => props.isCollapsed ? 'none' : 'grid'};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: #ECF0F1;
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid rgba(52, 152, 219, 0.3);
  border-radius: 8px;
  background: rgba(44, 62, 80, 0.5);
  color: #ECF0F1;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498DB;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ThemeToggle = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${props => props.isActive ? '#3498DB' : 'rgba(44, 62, 80, 0.5)'};
  color: #ECF0F1;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isActive ? '#2980B9' : 'rgba(44, 62, 80, 0.8)'};
  }
`;

const ColorPicker = styled.input`
  -webkit-appearance: none;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 8px;
  background: none;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: 2px solid rgba(52, 152, 219, 0.3);
    border-radius: 8px;
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

const PlayerSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { player1Name, player2Name, theme, accentColor } = useSelector(
    (state: RootState) => state.player
  );
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <SettingsContainer>
      <Title onClick={() => setIsCollapsed(!isCollapsed)}>
        <ChevronIcon isCollapsed={isCollapsed} />
        Player & Theme Settings
      </Title>
      <SettingsGrid isCollapsed={isCollapsed}>
        <div>
          <InputGroup>
            <Label>Player 1 Name</Label>
            <Input
              type="text"
              value={player1Name}
              onChange={(e) => dispatch(setPlayer1Name(e.target.value))}
              placeholder="Enter Player 1 name"
              maxLength={20}
            />
          </InputGroup>
          <InputGroup>
            <Label>Player 2 Name</Label>
            <Input
              type="text"
              value={player2Name}
              onChange={(e) => dispatch(setPlayer2Name(e.target.value))}
              placeholder="Enter Player 2 name"
              maxLength={20}
            />
          </InputGroup>
        </div>
        <div>
          <InputGroup>
            <Label>Theme</Label>
            <div>
              <ThemeToggle
                isActive={theme === 'dark'}
                onClick={() => dispatch(setTheme('dark'))}
              >
                Dark
              </ThemeToggle>
              <ThemeToggle
                isActive={theme === 'light'}
                onClick={() => dispatch(setTheme('light'))}
              >
                Light
              </ThemeToggle>
            </div>
          </InputGroup>
          <InputGroup>
            <Label>Accent Color</Label>
            <ColorPicker
              type="color"
              value={accentColor}
              onChange={(e) => dispatch(setAccentColor(e.target.value))}
            />
          </InputGroup>
        </div>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default PlayerSettings; 