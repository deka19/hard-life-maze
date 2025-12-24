import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { KeyboardControls, PointerLockControls } from '@react-three/drei';
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
  ];

  return (
    <>
      <Interface />
      <KeyboardControls map={keyboardMap}>
        <Canvas shadows camera={{ fov: 75 }}>
          {/* 1. Add Background Color so you don't see "Void" */}
          <color attach="background" args={['#101010']} />
          
          {/* 2. Super Bright Lights */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1} />

          {/* 3. Physics Debug Mode: Draws red boxes around everything */}
          <Physics gravity={[0, -25, 0]}> 
            <Suspense fallback={null}>
              {gameState === 'PLAYING' && <Player />}
              <Maze />
              <Hazards />
            </Suspense>
          </Physics>
          
          {gameState === 'PLAYING' && <PointerLockControls />}
        </Canvas>
      </KeyboardControls>
    </>
  );
}
