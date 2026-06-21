import mockParking from '../mock/parkingZones.json';
import { ParkingZone } from '../types';
import { useAppStore } from '../store/useAppStore';

export const fetchParkingZones = async (): Promise<ParkingZone[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCity = useAppStore.getState().city;
      const filtered = (mockParking as ParkingZone[]).filter(
        (pz) => !pz.city || pz.city === activeCity
      );
      resolve(filtered);
    }, 400);
  });
};
