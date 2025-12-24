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
          <ambientLight intensity={0.2} />
          <Physics gravity={[0, -25, 0]}>
            <Suspense fallback={null}>
              {gameState === 'PLAYING' && <Player />}
              <Maze />
              <Hazards />
            </Suspense>
          </Physics>
          
          {gameState === 'PLAYING' && <PointerLockControls />}
          
          {/* Player Flashlight attached to camera */}
          {gameState === 'PLAYING' && (
             <group>
                <spotLight position={[0,5,0]} intensity={10} angle={0.5} penumbra={1} castShadow />
             </group>
          )}
        </Canvas>
      </KeyboardControls>
    </>
  );
}
