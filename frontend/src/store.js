import {create} from 'zustand';

const useStore = create((set) => ({
  selectedPeriod: localStorage.getItem('selectedPeriod') || '1 week',
  setSelectedPeriod: (selectedValue) => {
    set({ selectedPeriod: selectedValue });
    localStorage.setItem('selectedPeriod', selectedValue);
  },
}));

export default useStore;