import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';

export default function DevicesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="p-4">
        <h2 className="text-2xl font-normal mb-4">Enheter</h2>
        <p className="text-muted-foreground">Placeholder for devices page</p>
      </main>

      <BottomNav prototypePrefix="/prototype-b" />
    </div>
  );
}

