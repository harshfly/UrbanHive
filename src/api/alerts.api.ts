import mockAlerts from '../mock/alerts.json';
import { Alert } from '../types';

export const fetchAlerts = async (): Promise<Alert[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAlerts as Alert[]);
    }, 300);
  });
};
