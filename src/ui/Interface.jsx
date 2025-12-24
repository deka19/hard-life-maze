import React from 'react';
import { useStore } from '../store';
import { useKeyboardControls } from '@react-three/drei';

// MAZE GRID DATA (Must be present for map to work)
const MAZE_GRID = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export const Interface = () => {
  const { gameState, startGame, resetGame, playerPos } = useStore();
  const mapActive = useKeyboardControls((state) => state.map);

  console.log("INTERFACE RENDERED. Game State:", gameState); // DEBUG LOG

  if (gameState === 'MENU') {
    return (
      <div className="fullscreen-ui menu">
        <h1>MAZE OF LIFE</h1>
        <p>SYSTEM READY</p>
        <button onClick={() => { console.log("CLICKED START"); startGame(); }}>INITIALIZE</button>
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

  // --- MAP LOGIC ---
  const gridX = Math.floor((playerPos[0] / 4) + 10.5);
  const gridY = Math.floor((playerPos[2] / 4) + 10.5);

  return (
    <div className="hud">
      <div className="crosshair">+</div>
      <div className="controls-hint">Hold [M] for Map</div>
      
      {mapActive && (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '400px', height: '400px', background: 'rgba(0,10,0,0.95)', 
            border: '2px solid #0f0', display: 'grid', 
            gridTemplateColumns: `repeat(21, 1fr)`, gridTemplateRows: `repeat(21, 1fr)`,
            zIndex: 200
        }}>
            {MAZE_GRID.map((row, rI) => (
                row.map((cell, cI) => {
                    const isPlayer = (rI === gridY && cI === gridX);
                    return (
                        <div key={`${rI}-${cI}`} style={{
                            background: isPlayer ? '#00f' : (cell === 1 ? '#004400' : 'transparent'),
                            border: cell === 1 ? '1px solid #002200' : 'none',
                            borderRadius: isPlayer ? '50%' : '0'
                        }} />
                    )
                })
            ))}
            <div style={{position:'absolute', top: -30, width: '100%', textAlign: 'center', color: '#0f0'}}>TACTICAL GRID</div>
        </div>
      )}
    </div>
  );
};
