import { create } from 'zustand';

export const useStore = create((set) => ({
  gameState: 'MENU', // MENU, PLAYING, WON, DEAD
  startGame: () => set({ gameState: 'PLAYING' }),
  endGame: (result) => set({ gameState: result }), // result = 'WON' or 'DEAD'
  resetGame: () => set({ gameState: 'MENU' }),
}));
