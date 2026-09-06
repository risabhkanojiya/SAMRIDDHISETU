import { create } from 'zustand';

interface AppState {
  user: any | null;
  recommendedScheme: string | null;
  emiDetails: any | null;
  vaultDocuments: any[];
  setUser: (user: any) => void;
  setRecommendedScheme: (scheme: string) => void;
  setEmiDetails: (details: any) => void;
  setVaultDocuments: (docs: any[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  recommendedScheme: null,
  emiDetails: null,
  vaultDocuments: [],
  setUser: (user) => set({ user }),
  setRecommendedScheme: (scheme) => set({ recommendedScheme: scheme }),
  setEmiDetails: (details) => set({ emiDetails: details }),
  setVaultDocuments: (docs) => set({ vaultDocuments: docs }),
}));
