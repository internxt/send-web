import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomeView from './views/HomeView';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <HomeView></HomeView>
      </header>
    </div>
  );
}

export default App;
