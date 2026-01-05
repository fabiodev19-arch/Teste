
import React from 'react';
import { X, Wrench, Calendar, Clock, User, MapPin } from 'lucide-react';
import { MaintenanceLog } from '../types';
import { StatusBadge } from './RecentActivity';
import { formatDateToBR } from '../utils/dateUtils';

interface RecordDetailsProps {
    log: MaintenanceLog;
    onClose: () => void;
    onEdit: (log: MaintenanceLog) => void;
}

export const RecordDetails: React.FC<RecordDetailsProps> = ({ log, onClose, onEdit }) => {
    return (
        <div className="fixed inset-0 max-w-md mx-auto left-0 right-0 bg-white z-[70] flex flex-col animate-in fade-in zoom-in duration-300 border-x-4 border-black">
            <header className="bg-excalibur border-b-4 border-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-white brutal-border-sm p-0.5 overflow-hidden w-8 h-8 flex items-center justify-center">
                        <img src="/logo-excalibur.jpg" alt="Logo" className="w-full h-auto" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-xl tracking-tighter uppercase italic leading-none">EXCALIBUR</h1>
                        <span className="font-mono text-[9px] uppercase font-bold opacity-70 tracking-widest">DETALHES DO REGISTRO</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white text-black font-mono font-bold px-2 border-2 border-black text-sm">
                        V1
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors p-1"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </header>

            <div className="flex-1 space-y-8 overflow-y-auto p-4 pb-8 custom-scrollbar">
                {/* Main Info Card */}
                <div className="brutal-border p-6 bg-excalibur text-white shadow-brutal">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-4xl font-black italic tracking-tighter uppercase">{log.code}</h4>
                        <StatusBadge status={log.status} />
                    </div>
                    <p className="text-2xl font-bold uppercase leading-tight mb-4">
                        {log.title}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-xs opacity-80 uppercase">
                        <div className="brutal-border-sm p-1 bg-white text-black">
                            <Wrench size={16} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold uppercase leading-none">EQUIPAMENTO: {log.equipmentCode || 'N/A'}</span>
                            {log.stopType && (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold uppercase leading-none text-[10px] opacity-70">TIPO:</span>
                                    <span className="bg-black text-[9px] px-2 py-0.5 rounded-none font-bold w-fit uppercase">
                                        {log.stopType}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailItem
                        icon={<MapPin size={20} />}
                        label="CÓDIGO DO EQUIPAMENTO"
                        value={log.equipmentCode || 'N/A'}
                    />
                    <DetailItem
                        icon={<User size={20} />}
                        label="MECÂNICO RESPONSÁVEL"
                        value={log.mechanic || 'SISTEMA AUTOMÁTICO'}
                    />
                    <DetailItem
                        icon={<Clock size={20} />}
                        label="DATA/HORA INÍCIO"
                        value={`${formatDateToBR(log.startDate || log.date)} ${log.startTime || log.time}`}
                    />
                    <DetailItem
                        icon={<Clock size={20} />}
                        label="DATA/HORA FIM"
                        value={log.endDate && log.endTime ? `${formatDateToBR(log.endDate)} ${log.endTime}` : 'EM ANDAMENTO'}
                    />
                    <DetailItem
                        icon={<Clock size={20} />}
                        label="TOTAL DE HORAS"
                        value={log.totalHours ? `${log.totalHours} H` : 'N/A'}
                    />
                    {log.stopType && (
                        <DetailItem
                            icon={<MapPin size={20} />}
                            label="TIPO DE PARADA"
                            value={log.stopType}
                        />
                    )}
                </div>

                {/* Technical Notes Section */}
                <div className="brutal-border p-4 bg-gray-50">
                    <h5 className="font-mono text-[10px] font-black uppercase mb-2 border-b-2 border-black inline-block">NOTAS TÉCNICAS</h5>
                    <div className="space-y-4">
                        {log.observations && (
                            <div className="border-b-2 border-black border-dashed pb-4">
                                <span className="block font-mono text-[10px] font-black text-gray-400 uppercase leading-none mb-2">OBSERVAÇÕES DO REGISTRO</span>
                                <p className="font-mono text-xs text-gray-800 leading-relaxed uppercase whitespace-pre-wrap">
                                    {log.observations}
                                </p>
                            </div>
                        )}
                        <p className="font-mono text-[10px] text-gray-500 leading-relaxed uppercase italic">
                            ESTE REGISTRO FOI GERADO VIA DASHBOARD PÁGINA DE TESTE. TODOS OS CAMPOS FORAM VALIDADOS PELO PROTOCOLO DE SEGURANÇA V1.
                        </p>
                    </div>
                </div>
            </div>

            <footer className="mt-auto border-t-4 border-black pt-4 flex gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 bg-black text-white p-4 font-bold uppercase hover:bg-excalibur transition-colors"
                >
                    FECHAR
                </button>
                <button
                    onClick={() => onEdit(log)}
                    className="brutal-border p-4 hover:bg-gray-100 italic font-bold"
                >
                    EDITAR
                </button>
            </footer>
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 border-b-2 border-black border-dashed last:border-0">
        <div className="text-excalibur">{icon}</div>
        <div>
            <span className="block font-mono text-[10px] font-black text-gray-400 uppercase leading-none">{label}</span>
            <span className="font-bold text-lg uppercase">{value}</span>
        </div>
    </div>
);
