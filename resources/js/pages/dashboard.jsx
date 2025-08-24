import { LoadProvider } from '@/components/context/loadContext';
import Dashboard from '@/components/welcome/dashboard';

export default function MainApp({user, productos, pedidos}) {
  return (
    <LoadProvider total={5}>
      <Dashboard user={user} productos={productos} pedidos={pedidos}/>
    </LoadProvider>
  );
}
