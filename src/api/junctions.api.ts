import mockJunctions from '../mock/junctions.json';
import { Junction } from '../types';
import { useAppStore } from '../store/useAppStore';

export const fetchJunctions = async (): Promise<Junction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCity = useAppStore.getState().city;
      const filtered = (mockJunctions as Junction[]).filter(
        (j) => !j.city || j.city === activeCity
      );
      resolve(filtered);
    }, 400); // simulate network latency
  });
};

export const fetchJunctionById = async (id: string): Promise<Junction | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve((mockJunctions as Junction[]).find(j => j.id === id));
    }, 400);
  });
};
