import React from 'react';
import { SocketProvider } from './context/SocketProvider';
import MainPage from './pages/MainPage';

function App() {
  return (
    <SocketProvider>
      <MainPage />
    </SocketProvider>
  );
}

export default App;
