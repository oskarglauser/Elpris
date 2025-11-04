import Image from 'next/image';
import { PrototypeCard } from '@/components/shared/PrototypeCard';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-muted">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/fonts/Greenely-symbol.svg"
              alt="Greenely"
              width={32}
              height={0}
              style={{ width: '32px', height: 'auto' }}
            />
            <Image
              src="/fonts/Greenely-logotype.svg"
              alt="greenely"
              width={100}
              height={0}
              style={{ width: '100px', height: 'auto' }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-normal mb-3">Spotpris - Prototyper</h2>
        </div>

        <div className="space-y-4">
          <PrototypeCard
            href="/prototype-a"
            name="Prototyp A - 12 timmar"
          />

          <PrototypeCard
            href="/prototype-a2"
            name="Prototyp A2 - Alla priser"
          />

          <PrototypeCard
            href="/prototype-g"
            name="Prototyp G - 18 timmar"
          />

          <PrototypeCard 
            href="/prototype-b"
            name="Prototyp B - Klockan"
          />

          <PrototypeCard 
            href="/prototype-c"
            name="Prototyp C - Enkel #1"
          />

          <PrototypeCard
            href="/prototype-d"
            name="Prototyp D - Enkel #2"
          />

          <PrototypeCard
            href="/prototype-e"
            name="Prototyp E - Rekommendation"
          />

          <PrototypeCard
            href="/prototype-f"
            name="Prototyp F - Alla priser"
          />
        </div>

      </div>
    </main>
  );
}
