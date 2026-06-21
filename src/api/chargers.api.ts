import mockChargers from '../mock/chargers.json';
import { Charger } from '../types';
import { useAppStore } from '../store/useAppStore';

export const fetchChargers = async (): Promise<Charger[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCity = useAppStore.getState().city;
      const filtered = (mockChargers as Charger[]).filter(
        (c) => !c.city || c.city === activeCity
      );
      resolve(filtered);
    }, 350);
  });
};
