import { ReactNode } from 'react';

export default function CardBottom({ children }: { children: ReactNode }) {
  return (
    <div className="bottom-0 w-full rounded-b-2xl border-t border-gray-5 bg-white px-5 py-4 lg:relative">
      {children}
    </div>
  );
}
