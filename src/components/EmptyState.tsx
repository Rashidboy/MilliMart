import React from 'react';
import { MessageSquarePlus } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <MessageSquarePlus size={40} className="text-red-400" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-amber-500 text-lg">✨</span>
        </div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-400 text-sm">💬</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
        Hali sharhlar yo&apos;q
      </h3>
      <p className="text-gray-500 text-center max-w-sm">
        Sizning sharhingiz birinchilardan bo&apos;lsin! Mahsulot haqida fikringizni bildiring va boshqalarga yordam bering.
      </p>
    </div>
  );
};

export default EmptyState;
