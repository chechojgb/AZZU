import { LoadProvider } from '@/components/context/loadContext';
import Dashboard from '@/components/welcome/dashboard';

export default function MainApp({user}) {
  return (
    <LoadProvider total={5}>
      <Dashboard user={user}/>
    </LoadProvider>
  );
}
