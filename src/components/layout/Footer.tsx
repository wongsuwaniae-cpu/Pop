import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="mt-auto border-t border-gray-200/80 bg-white/70 py-6 text-center text-xs text-gray-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-800 font-medium">
          <BookOpen className="w-4 h-4" />
          <span>สื่อการเรียนรู้พฤกษศาสตร์และเภสัชพฤกษศาสตร์ | Botanical Education</span>
        </div>
        <div className="text-gray-400">
          ราก • ลำต้น • ใบ • ดอก • ผล • เมล็ด
        </div>
      </div>
    </footer>
  );
};
