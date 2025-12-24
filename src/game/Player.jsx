import React, { useRef, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useStore } from '../store';
import * as THREE from 'three';

export const Player = () => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    position: [0, 2, 0], 
    fixedRotation: true, 
    linearDamping: 0.9 
  }));
  
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);

  useFrame(() => {
    if (useStore.getState().gameState !== 'PLAYING') return;

    const { forward, backward, left, right, jump } = getKeys();
    
    // Sync Camera
    camera.position.copy(ref.current.position);

    // Movement Logic
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
    const direction = new THREE.Vector3();
    const speed = 15;

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
    
    // Apply camera rotation
    const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
    direction.applyEuler(euler);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 10, velocity.current[2]);
    }
  });

  return (
    <mesh ref={ref} /> // Invisible collider
  );
};
