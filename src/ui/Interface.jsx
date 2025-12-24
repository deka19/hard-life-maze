import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';

export const Interface = () => {
  const { gameState, startGame, resetGame } = useStore();
  
  if (gameState === 'MENU') {
    return (
      <div className="fullscreen-ui menu">
        <h1>MAZE OF LIFE</h1>
        <p>SYSTEM READY</p>
        <button onClick={startGame}>INITIALIZE</button>
      </div>
    );
  }

  if (gameState === 'DEAD') {
    return (
      <div className="fullscreen-ui dead">
        <h1 style={{color:'red'}}>CRITICAL FAILURE</h1>
        <button onClick={resetGame}>REBOOT</button>
      </div>
    );
  }

  if (gameState === 'WON') {
    return (
      <div className="fullscreen-ui won">
        <h1 style={{color:'lime'}}>DESTINY ACHIEVED</h1>
        <button onClick={resetGame}>PLAY AGAIN</button>
      </div>
    );
  }

  return (
    <div className="hud">
      <div className="crosshair">+</div>
      <div className="controls-hint">WASD to Move | SPACE to Jump</div>
    </div>
  );
};
