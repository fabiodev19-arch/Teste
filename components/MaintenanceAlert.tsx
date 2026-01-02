import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { MaintenanceLog, MaintenanceStatus } from '../types';

interface MaintenanceAlertProps {
  logs: MaintenanceLog[];
  onSelectLog: (log: MaintenanceLog) => void;
}

export const MaintenanceAlert: React.FC<MaintenanceAlertProps> = ({ logs, onSelectLog }) => {
  const [alerts, setAlerts] = useState<MaintenanceLog[]>([]);

  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const qualifyingLogs = logs.filter(log => {
        if (log.status !== MaintenanceStatus.AWAITING_PARTS || !log.startDate || !log.startTime) {
          return false;
        }

        try {
          // Manual parsing for maximum browser compatibility
          const [y, m, d] = log.startDate.split('-').map(Number);
          const [h, min] = log.startTime.split(':').map(Number);
          const start = new Date(y, m - 1, d, h, min);

          if (isNaN(start.getTime())) return false;

          const diffMs = now.getTime() - start.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);

          return diffHours >= 1; // 1 hour or more
        } catch (e) {
          return false;
        }
      });

      setAlerts(qualifyingLogs);
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [logs]);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      {alerts.map(log => {
        const [y, m, d] = (log.startDate || '').split('-').map(Number);
        const [h, min] = (log.startTime || '').split(':').map(Number);
        const start = new Date(y, m - 1, d, h, min);

        const now = new Date();
        const diffMs = now.getTime() - start.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return (
          <div
            key={log.id}
            onClick={() => onSelectLog(log)}
            className="border-4 border-[#FF4D4D] bg-[#FFF5F5] p-4 flex gap-4 animate-pulse cursor-pointer hover:bg-red-100 transition-colors"
          >
            <div className="shrink-0 pt-1">
              <AlertTriangle className="text-[#FF4D4D]" size={32} strokeWidth={3} />
            </div>
            <div>
              <h4 className="font-bold text-[#FF4D4D] uppercase text-lg leading-tight">ATENÇÃO NECESSÁRIA</h4>
              <p className="font-mono text-xs text-red-900 mt-1 uppercase leading-tight font-bold">
                {log.code} ({log.equipmentCode}) REQUER ATENÇÃO. PARADA HÁ {diffHours}H {diffMins}M.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
