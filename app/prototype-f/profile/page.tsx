import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="p-4">
        <h2 className="text-2xl font-normal mb-4">Profil</h2>
        <p className="text-muted-foreground">Placeholder for profile page</p>
      </main>

      <BottomNav prototypePrefix="/prototype-f" />
    </div>
  );
}

