import React from 'react';
import { MapPin } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Select } from '../ui/Select';

const cities = [
  { label: 'Indore (Vijay Nagar)', value: 'Indore (Vijay Nagar)' },
  { label: 'Bhopal (MP Nagar)', value: 'Bhopal (MP Nagar)' },
  { label: 'Pune (Hinjewadi)', value: 'Pune (Hinjewadi)' },
];

export const CitySelector: React.FC = () => {
  const { city, setCity } = useAppStore();
  return (
    <Select
      value={city}
      options={cities}
      onChange={setCity}
      icon={<MapPin size={16} />}
    />
  );
};
