
import React from 'react';
import { Wrench } from 'lucide-react';
import { MaintenanceLog, MaintenanceStatus } from '../types';
import { formatDateToBR } from '../utils/dateUtils';

interface RecentActivityProps {
  logs: MaintenanceLog[];
  onSelectLog: (log: MaintenanceLog) => void;
  onSeeAll?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ logs, onSelectLog, onSeeAll }) => {
  return (
    <div className="bg-white brutal-border shadow-brutal p-4">
      <div className="flex justify-between items-end border-b-4 border-black mb-4 pb-2">
        <h4 className="text-xl font-bold uppercase">RECENTES</h4>
        <button
          onClick={onSeeAll}
          className="text-[10px] font-mono font-bold underline uppercase tracking-wider"
        >
          VER TUDO
        </button>
      </div>

      <div className="space-y-6 max-h-[280px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
        {logs.map((log) => (
          <div
            key={log.id}
            onClick={() => onSelectLog(log)}
            className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0 cursor-pointer hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="brutal-border-sm p-2 bg-gray-50">
                <Wrench size={20} />
              </div>
              <div>
                <h5 className="font-bold text-base leading-tight uppercase">{log.code}</h5>
                <p className="font-mono text-[9px] text-excalibur font-bold uppercase leading-none mt-1">
                  EQ: {log.equipmentCode}
                </p>
                <p className="font-mono text-[10px] text-gray-500 font-bold uppercase">
                  {log.title} • {log.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <StatusBadge status={log.status} />
              <div className="font-mono text-[10px] font-bold mt-1 uppercase">
                {log.date || log.startDate ? formatDateToBR(log.date || log.startDate) : 'HOJE'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export const StatusBadge: React.FC<{ status: MaintenanceStatus }> = ({ status }) => {
  const styles = {
    [MaintenanceStatus.COMPLETED]: 'bg-green-100 text-green-700 border-green-700',
    [MaintenanceStatus.AWAITING_PARTS]: 'bg-red-100 text-red-700 border-red-700',
    [MaintenanceStatus.YESTERDAY]: 'bg-gray-100 text-gray-700 border-gray-700',
  };

  return (
    <span className={`text-[8px] font-mono font-bold px-1 py-0 border-2 uppercase whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
};
