
import React from 'react';
import { StatsCards } from './StatsCards';
import { RecentActivity } from './RecentActivity';
import { MaintenanceAlert } from './MaintenanceAlert';
import { Plus } from 'lucide-react';
import { MaintenanceLog } from '../types';

interface DashboardProps {
  onNewRecord: () => void;
  logs: MaintenanceLog[];
  onSelectLog: (log: MaintenanceLog) => void;
  onSeeAll: () => void;
  onFilterPending: () => void;
  onFilterCompleted: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewRecord,
  logs,
  onSelectLog,
  onSeeAll,
  onFilterPending,
  onFilterCompleted
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title Section */}
      <section>
        <h2 className="text-4xl font-extrabold text-black uppercase leading-none">
          DASHBOARD
        </h2>
        <h3 className="text-2xl font-bold text-excalibur-light uppercase mb-4">
          VISÃO GERAL DA MANUTENÇÃO
        </h3>
      </section>

      {/* Stats */}
      <StatsCards
        pending={logs.filter(l => l.status === 'AGUARDANDO PEÇA').length}
        completed={logs.filter(l => l.status === 'CONCLUÍDO').length}
        onFilterPending={onFilterPending}
        onFilterCompleted={onFilterCompleted}
      />

      {/* Action Button */}
      <button
        onClick={onNewRecord}
        className="w-full bg-black text-white p-6 brutal-border shadow-brutal flex items-center justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
      >
        <div>
          <span className="block font-bold text-xl uppercase leading-none">NOVO REGISTRO</span>
          <span className="font-mono text-[10px] uppercase opacity-70">INICIAR FORMULÁRIO</span>
        </div>
        <Plus size={36} strokeWidth={3} />
      </button>

      {/* Recent List */}
      <RecentActivity logs={logs} onSelectLog={onSelectLog} onSeeAll={onSeeAll} />

      {/* Alert */}
      <MaintenanceAlert logs={logs} onSelectLog={onSelectLog} />

      <footer className="text-center pb-8">
        <p className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          EXCALIBUR SYSTEMS &copy; 2023
        </p>
      </footer>
    </div>
  );
};
