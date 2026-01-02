
import React from 'react';
import { MaintenanceLog, MaintenanceStatus, UserRole } from '../types';
import { StatusBadge } from './RecentActivity';
import { formatDateToBR } from '../utils/dateUtils';
import { Wrench, Trash2 } from 'lucide-react';

interface LogsProps {
  logs: MaintenanceLog[];
  onSelectLog: (log: MaintenanceLog) => void;
  activeFilter?: MaintenanceStatus | null;
  onClearFilter?: () => void;
  onClose: () => void;
  userRole: UserRole;
  onDeleteLog: (id: string) => void;
}

export const Logs: React.FC<LogsProps> = ({ logs, onSelectLog, activeFilter, onClearFilter, onClose, userRole, onDeleteLog }) => {
  const filteredLogs = activeFilter
    ? logs.filter(log => log.status === activeFilter)
    : logs;

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <section className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-extrabold text-black uppercase leading-none">
            HISTÓRICO
          </h2>
          <h3 className="text-2xl font-bold text-forest-light uppercase">
            DE REGISTROS
          </h3>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {activeFilter && (
            <button
              onClick={onClearFilter}
              className="bg-black text-white px-3 py-1 brutal-border shadow-brutal text-[10px] font-mono font-bold uppercase hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Limpar Filtro ({activeFilter})
            </button>
          )}
        </div>
      </section>

      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            onClick={() => onSelectLog(log)}
            className="brutal-border p-4 bg-white shadow-brutal flex justify-between items-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="brutal-border-sm p-2 bg-gray-50">
                <Wrench size={20} />
              </div>
              <div>
                <div className="flex flex-col">
                  <span className="font-bold text-base leading-none">{log.code}</span>
                  <span className="text-[9px] font-mono text-excalibur font-bold uppercase mt-1">EQ: {log.equipmentCode}</span>
                </div>
                <p className="text-[10px] font-mono font-bold text-gray-500 uppercase">{log.title}</p>
                <p className="text-[10px] font-mono text-gray-400">{log.time} • {formatDateToBR(log.date || log.startDate || 'HOJE')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={log.status} />
              {userRole === 'ADMIN' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`DESEJA REALMENTE EXCLUIR O REGISTRO ${log.code}?`)) {
                      onDeleteLog(log.id);
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors brutal-border-sm"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 border-4 border-dashed border-gray-200">
            <p className="font-mono text-gray-400 font-bold uppercase">Nenhum registro encontrado</p>
          </div>
        )}
      </div>
      <div className="pt-8">
        <button
          onClick={onClose}
          className="w-full bg-black text-white p-4 brutal-border shadow-brutal font-black text-2xl uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
};
