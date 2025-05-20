import { create } from 'zustand';
import { supabase } from '@/lib/supabase'; // Import Supabase client

// Reuse or define a proper KPI type (ensure it matches Supabase table structure)
// Assuming you have an 'id' column that's a primary key (e.g., UUID or number)
export interface KPI {
  id: string; // Or number, depending on your Supabase schema
  name: string;
  description: string;
  value: number; // Current value might be dynamic, maybe fetch separately or not store here
  target: number;
  unit: string;
  format: string;
  category: string;
  visible: boolean;
  chartType: string;
  // Add any other fields matching your Supabase table (e.g., created_at)
  // 'trend' and 'change' seem dynamic, maybe calculate in component?
}


// Define interfaces for state and actions
interface AdminDataState {
  kpiSettings: KPI[]; // Use the defined KPI type
  progressImages: any[]; // Keep other parts as they were for now
  unitData: any[];
  lastUpdated: Date | null;
  isLoadingKpis: boolean;
  kpiError: string | null;
}

interface AdminDataActions {
  fetchKpiSettings: () => Promise<void>;
  addKpi: (newKpiData: Omit<KPI, 'id'>) => Promise<void>;
  updateKpi: (updatedKpi: KPI) => Promise<void>;
  deleteKpi: (kpiId: string) => Promise<void>; // Use string or number based on KPI['id'] type
  // Keep existing actions for other data types
  addProgressImage: (image: any) => void;
  setUnitData: (data: any[]) => void;
  setProgressImages: (images: any[]) => void;
}

// Create the Zustand store
const useAdminDataStore = create<AdminDataState & AdminDataActions>((set, get) => ({
  // Initial state
  kpiSettings: [],
  progressImages: [],
  unitData: [],
  lastUpdated: null,
  isLoadingKpis: false,
  kpiError: null,

  // --- KPI Actions ---
  fetchKpiSettings: async () => {
    set({ isLoadingKpis: true, kpiError: null });
    try {
      const { data, error } = await supabase
        .from('kpis') // *** Ensure your table name is 'kpis' ***
        .select('*');

      if (error) throw error;

      set({ kpiSettings: data || [], isLoadingKpis: false, lastUpdated: new Date() });
    } catch (error: any) {
      console.error("Error fetching KPIs:", error, JSON.stringify(error));
      set({ kpiError: error.message || JSON.stringify(error), isLoadingKpis: false });
    }
  },

  addKpi: async (newKpiData) => {
    set({ isLoadingKpis: true, kpiError: null }); // Indicate loading
    try {
      // Add created_at or other default fields if needed by your table
      const { data, error } = await supabase
        .from('kpis')
        .insert([
          { ...newKpiData } // Spread the new KPI data
        ])
        .select(); // Select to get the newly created row including the ID

      if (error) throw error;

      if (data) {
        // Add the new KPI to the existing state
         set((state) => ({
           kpiSettings: [...state.kpiSettings, ...(data as KPI[])],
           isLoadingKpis: false,
           lastUpdated: new Date(),
         }));
      } else {
         // Fallback: refetch all if insert didn't return data (less optimal)
         await get().fetchKpiSettings();
      }

    } catch (error: any) {
      console.error("Error adding KPI:", error, JSON.stringify(error));
      set({ kpiError: error.message || JSON.stringify(error), isLoadingKpis: false });
      // Optionally re-throw or handle differently
    }
  },

  updateKpi: async (updatedKpi) => {
     set({ isLoadingKpis: true, kpiError: null });
    try {
      const { id, ...updateData } = updatedKpi; // Separate ID from the rest of the data

      const { error } = await supabase
        .from('kpis')
        .update(updateData)
        .eq('id', id); // Match the KPI by its ID

      if (error) throw error;

      // Update the specific KPI in the local state for immediate UI feedback
       set((state) => ({
         kpiSettings: state.kpiSettings.map((kpi) =>
           kpi.id === id ? updatedKpi : kpi
         ),
         isLoadingKpis: false,
         lastUpdated: new Date(),
       }));
       // Optionally refetch all for consistency: await get().fetchKpiSettings();

    } catch (error: any) {
      console.error("Error updating KPI:", error);
      set({ kpiError: error.message, isLoadingKpis: false });
    }
  },

 deleteKpi: async (kpiId) => {
     set({ isLoadingKpis: true, kpiError: null });
    try {
      const { error } = await supabase
        .from('kpis')
        .delete()
        .eq('id', kpiId); // Match the KPI by its ID

      if (error) throw error;

      // Remove the KPI from the local state
       set((state) => ({
         kpiSettings: state.kpiSettings.filter((kpi) => kpi.id !== kpiId),
         isLoadingKpis: false,
         lastUpdated: new Date(),
       }));

    } catch (error: any) {
      console.error("Error deleting KPI:", error);
      set({ kpiError: error.message, isLoadingKpis: false });
    }
  },


  // --- Other Existing Actions ---
  addProgressImage: (image) => set((state) => ({
    progressImages: [...state.progressImages, image],
    lastUpdated: new Date()
  })),
  setUnitData: (data) => set({ unitData: data, lastUpdated: new Date() }),
  setProgressImages: (images) => set({ progressImages: images, lastUpdated: new Date() }),
}));

export default useAdminDataStore; 