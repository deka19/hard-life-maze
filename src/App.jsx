import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { KeyboardControls, PointerLockControls } from '@react-three/drei';

// These imports work because App.jsx is now in src/
import { Maze } from './game/Maze';
import { Player } from './game/Player';
import { Hazards } from './game/Hazards';
import { Interface } from './ui/Interface';
import { useStore } from './store';
import './index.css';

export default function App() {
  const gameState = useStore((state) => state.gameState);

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'map', keys: ['m', 'M'] }
  ];

  return (
    <>
      <Interface />
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ fov: 75 }}>
          {/* Atmosphere */}
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 0, 25]} />
          <ambientLight intensity={0.1} />

          {/* Physics World */}
          <Physics gravity={[0, -30, 0]}> 
            <Suspense fallback={null}>
              {gameState === 'PLAYING' && <Player />}
              <Maze />
              <Hazards />
            </Suspense>
          </Physics>
          
          {gameState === 'PLAYING' && <PointerLockControls selector="#root" />}
        </Canvas>
      </KeyboardControls>
    </>
  );
}
