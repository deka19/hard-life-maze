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
    position: [-35, 5, -35], // Safe Spawn Point
    fixedRotation: true, 
    linearDamping: 0.95,
    args: [0.8] 
  }));
  
  const [, getKeys] = useKeyboardControls();
  const velocity = useRef([0, 0, 0]);
  const pos = useRef([0, 0, 0]);

  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);
  useEffect(() => api.position.subscribe((p) => {
      pos.current = p;
      // Update store for Map to see
      useStore.getState().setPlayerPos(p);
  }), [api.position]);

  useFrame(() => {
    if (useStore.getState().gameState !== 'PLAYING') return;

    const { forward, backward, left, right, jump } = getKeys();
    
    // 1. SYNC CAMERA
    camera.position.copy(ref.current.position);
    // Add slight head bob
    if (Math.abs(velocity.current[0]) > 0.1 || Math.abs(velocity.current[2]) > 0.1) {
        camera.position.y += Math.sin(Date.now() / 100) * 0.05;
    }

    // 2. MOVEMENT
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
    const direction = new THREE.Vector3();
    const speed = 15;

    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(speed);
    
    const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
    direction.applyEuler(euler);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], 12, velocity.current[2]);
    }
  });

  return (
    <>
      <mesh ref={ref} />
      {/* FLASHLIGHT: Attached to Camera */}
      <group position={camera.position} rotation={camera.rotation}>
        <spotLight position={[0.5, 0, 0]} intensity={15} angle={0.6} penumbra={0.5} castShadow distance={40} color="#ffffaa" />
        <pointLight intensity={1} distance={5} color="#white" />
      </group>
    </>
  );
};
