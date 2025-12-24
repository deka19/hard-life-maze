import React, { useLayoutEffect, useRef } from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

// 1 = Wall, 0 = Path
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

const CELL_SIZE = 4;
const WALL_HEIGHT = 5;

export const Maze = () => {
  const meshRef = useRef();
  const walls = [];

  // Parse Grid
  for (let i = 0; i < MAZE_GRID.length; i++) {
    for (let j = 0; j < MAZE_GRID[0].length; j++) {
      if (MAZE_GRID[i][j] === 1) {
        walls.push([ (j - 10.5) * CELL_SIZE, WALL_HEIGHT / 2, (i - 10.5) * CELL_SIZE ]);
      }
    }
  }

  // Physics for Walls
  // Note: For simplicity in cannon, we create individual boxes for physics, 
  // but use one mesh for rendering.
  const WallPhysics = ({ position }) => {
    useBox(() => ({ type: 'Static', position, args: [CELL_SIZE, WALL_HEIGHT, CELL_SIZE] }));
    return null;
  };

  useLayoutEffect(() => {
    const tempObject = new THREE.Object3D();
    walls.forEach((pos, i) => {
      tempObject.position.set(...pos);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [walls]);

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, walls.length]}>
        <boxGeometry args={[CELL_SIZE, WALL_HEIGHT, CELL_SIZE]} />
        <meshStandardMaterial color="#000000" emissive="#00ff00" emissiveIntensity={0.5} wireframe />
      </instancedMesh>
      {walls.map((pos, i) => <WallPhysics key={i} position={pos} />)}
      
      {/* Floor */}
      <Floor />
    </group>
  );
};

const Floor = () => {
  useBox(() => ({ type: 'Static', rotation: [-Math.PI/2, 0, 0], args: [100, 100, 0.1] }));
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#050505" />
    </mesh>
  );
};
