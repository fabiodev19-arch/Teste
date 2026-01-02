import React from 'react';
import { Settings, ThumbsUp } from 'lucide-react';

interface StatsProps {
  pending: number;
  completed: number;
  onFilterPending: () => void;
  onFilterCompleted: () => void;
}

export const StatsCards: React.FC<StatsProps> = ({ pending, completed, onFilterPending, onFilterCompleted }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Pending Card */}
      <div
        onClick={onFilterPending}
        className="bg-brutal-red brutal-border p-4 shadow-brutal flex flex-col justify-between h-36 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      >
        <div className="flex justify-between items-start">
          <div className="bg-white/20 p-1 brutal-border-sm">
            <Settings size={28} className="text-black animate-spin-slow" />
          </div>
          <span className="bg-black text-white font-mono text-[10px] px-1 font-bold uppercase">PEÇA</span>
        </div>
        <div>
          <span className="text-5xl font-extrabold block leading-none">{pending}</span>
          <span className="font-mono text-[10px] font-bold text-black uppercase opacity-60">AGUARDANDO PEÇA</span>
        </div>
      </div>

      {/* Completed Card */}
      <div
        onClick={onFilterCompleted}
        className="bg-brutal-green brutal-border p-4 shadow-brutal flex flex-col justify-between h-36 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      >
        <div className="flex justify-between items-start">
          <div className="bg-white/20 p-1 brutal-border-sm">
            <ThumbsUp size={28} className="text-black" />
          </div>
          <span className="bg-black text-white font-mono text-[10px] px-1 font-bold uppercase">OK</span>
        </div>
        <div>
          <span className="text-5xl font-extrabold block leading-none">{completed}</span>
          <span className="font-mono text-[10px] font-bold text-black uppercase opacity-60">CONCLUÍDAS</span>
        </div>
      </div>
    </div>
  );
};
