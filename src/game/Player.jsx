import React, { useRef, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useStore } from '../store';
import * as THREE from 'three';

export const Player = () => {
  const { camera } = useThree();
  
  // FIX: Spawn at [-35, 5, -35] (Top Left Corner) instead of [0,2,0] (Center Wall)
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position: [-35, 5, -35], 
    fixedRotation: true, 
    linearDamping: 0.9 
  }));
  
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  useFrame(() => {
    // Force Game State to PLAYING if it's stuck
    if (useStore.getState().gameState !== 'PLAYING') return;

    const { forward, backward, left, right, jump } = getKeys();
    
    // Sync Camera to Physics Body
    camera.position.copy(ref.current.position);

    // Movement Logic
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
    const direction = new THREE.Vector3();
    const speed = 15;

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
    
    const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
    direction.applyEuler(euler);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 10, velocity.current[2]);
    }
  });

  return (
    <>
      <mesh ref={ref} />
      {/* Add a bright light attached to player so you can ALWAYS see */}
      <pointLight position={[0, 1, 0]} intensity={1.5} distance={20} color="white" />
    </>
  );
};
