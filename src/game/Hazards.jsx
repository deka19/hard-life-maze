import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';

const Hazard = ({ position, color, type }) => {
  const ref = useRef();
  const endGame = useStore(state => state.endGame);
  const playerPos = useRef(new THREE.Vector3());

  useFrame((state) => {
    // Animation
    if (type === 'blade') ref.current.rotation.y += 0.1;
    if (type === 'fire') ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.5;

    // Simple distance check for collision (simulating interaction)
    const player = state.camera.position; // Player is at camera position
    const dist = player.distanceTo(ref.current.position);
    
    if (dist < 2) {
      if (type === 'goal') endGame('WON');
      else endGame('DEAD');
    }
  });

  return (
    <mesh ref={ref} position={position}>
      {type === 'blade' && <boxGeometry args={[0.2, 2, 6]} />}
      {type === 'fire' && <dodecahedronGeometry args={[0.5]} />}
      {type === 'goal' && <cylinderGeometry args={[0, 1, 4, 32]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      <pointLight color={color} intensity={2} distance={5} />
    </mesh>
  );
};

export const Hazards = () => {
  return (
    <group>
      {/* Fire */}
      <Hazard position={[8, 1, 8]} color="orange" type="fire" />
      <Hazard position={[-10, 1, -5]} color="red" type="fire" />
      
      {/* Blades */}
      <Hazard position={[-15, 2, -15]} color="cyan" type="blade" />
      
      {/* Goal */}
      <Hazard position={[30, 2, 30]} color="lime" type="goal" />
    </group>
  );
};

import * as THREE from 'three';
