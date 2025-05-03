import { create } from 'zustand';

// Define interfaces for state and actions
interface AdminDataState {
  // Example state properties - add more as needed
  kpiSettings: Record<string, any>; // Replace 'any' with a specific KPI type if available
  progressImages: any[]; // Replace 'any' with a specific image type
  unitData: any[]; // Replace 'any' with a specific unit type
  lastUpdated: Date | null;
}

interface AdminDataActions {
  setKpiSettings: (settings: Record<string, any>) => void;
  addProgressImage: (image: any) => void;
  setUnitData: (data: any[]) => void;
  setProgressImages: (images: any[]) => void;
  // Add more actions as needed
}

// Create the Zustand store
const useAdminDataStore = create<AdminDataState & AdminDataActions>((set) => ({
  // Initial state
  kpiSettings: {},
  progressImages: [],
  unitData: [],
  lastUpdated: null,

  // Actions
  setKpiSettings: (settings) => set({ kpiSettings: settings, lastUpdated: new Date() }),
  addProgressImage: (image) => set((state) => ({ 
    progressImages: [...state.progressImages, image], 
    lastUpdated: new Date() 
  })),
  setUnitData: (data) => set({ unitData: data, lastUpdated: new Date() }),
  setProgressImages: (images) => set({ progressImages: images, lastUpdated: new Date() }),
}));

export default useAdminDataStore; 