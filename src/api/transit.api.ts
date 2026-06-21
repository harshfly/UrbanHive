import mockTransit from '../mock/transitFleet.json';
import { TransitVehicle } from '../types';
import { useAppStore } from '../store/useAppStore';

export const fetchTransitFleet = async (): Promise<TransitVehicle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCity = useAppStore.getState().city;
      const filtered = (mockTransit as TransitVehicle[]).filter(
        (v) => !v.city || v.city === activeCity
      );
      resolve(filtered);
    }, 300);
  });
};
