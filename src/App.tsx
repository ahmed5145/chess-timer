import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import Timer from './components/Timer.tsx';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'JetBrains Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
    color: white;
    min-height: 100vh;
  }

  /* Custom Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 12px;
    background: rgba(0, 0, 0, 0.2);
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    margin: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
    }
  }

  /* Firefox Scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #3498db rgba(0, 0, 0, 0.1);
  }
`;

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Timer />
    </Provider>
  );
};

export default App;
