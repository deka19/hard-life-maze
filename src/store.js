import { create } from 'zustand';

export const useStore = create((set) => ({
  gameState: 'MENU', 
  playerPos: [0,0,0], // New: Track position
  setPlayerPos: (pos) => set({ playerPos: pos }),
  
  startGame: () => set({ gameState: 'PLAYING' }),
  endGame: (result) => set({ gameState: result }),
  resetGame: () => set({ gameState: 'MENU' }),
}));
