import { LoadProvider } from '@/components/context/loadContext';
import Dashboard from '@/components/welcome/dashboard';

export default function MainApp() {
  return (
    <LoadProvider total={4}>
      <Dashboard />
    </LoadProvider>
  );
}
