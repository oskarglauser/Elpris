import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PrototypeCardProps {
  href: string;
  name: string;
}

export function PrototypeCard({ href, name }: PrototypeCardProps) {
  return (
    <Link href={href} className="block">
      <div className="w-full bg-black hover:bg-black/90 text-white rounded p-6 transition-colors">
        <div className="flex items-center justify-between">
          <span className="font-medium text-lg">{name}</span>
          <ChevronRight className="w-6 h-6 opacity-60" />
        </div>
      </div>
    </Link>
  );
}

