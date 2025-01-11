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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    overflow: hidden;
    background-color: #1a1a1a;
  }
`;

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Timer />
    </Provider>
  );
}

export default App;
