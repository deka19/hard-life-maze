import { create } from 'zustand';

export const useStore = create((set) => ({
  gameState: 'MENU', // This MUST be 'MENU' for the start button to show
  playerPos: [0,0,0],
  setPlayerPos: (pos) => set({ playerPos: pos }),
  startGame: () => set({ gameState: 'PLAYING' }),
  endGame: (result) => set({ gameState: result }),
  resetGame: () => set({ gameState: 'MENU' }),
}));
