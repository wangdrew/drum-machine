import React from 'react';
import logo from './logo.svg';
import './App.css';
import Sequencer from './Sequencer';

function App() {
  const pads = ['hh_close', 'hh_open', 'snare', 'kick', 'clap', 'tom', 'crash']
  return (
    <>
      <div style={{ height: '100px' }}>
        <Sequencer columns={16} pads={pads} />
      </div>
    </>
  )
}
export default App;
