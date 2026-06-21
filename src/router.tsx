import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import CommandCenter from './pages/CommandCenter';
import DigitalTwin from './pages/DigitalTwin';
import TrafficNetwork from './pages/TrafficNetwork';
import JunctionDetail from './pages/JunctionDetail';
import EmergencyCorridor from './pages/EmergencyCorridor';
import EvCharging from './pages/EvCharging';
import Parking from './pages/Parking';
import PublicTransport from './pages/PublicTransport';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Cameras from './pages/Cameras';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <CommandCenter /> },
      { path: '/digital-twin', element: <DigitalTwin /> },
      { path: '/traffic', element: <TrafficNetwork /> },
      { path: '/traffic/:junctionId', element: <JunctionDetail /> },
      { path: '/emergency-corridor', element: <EmergencyCorridor /> },
      { path: '/ev-charging', element: <EvCharging /> },
      { path: '/parking', element: <Parking /> },
      { path: '/transport', element: <PublicTransport /> },
      { path: '/reports', element: <Reports /> },
      { path: '/settings', element: <Settings /> },
      { path: '/cameras', element: <Cameras /> },
    ],
  },
]);
