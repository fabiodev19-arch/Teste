
import React, { useState } from 'react';
import { X, Check, Wrench, Calendar, Clock, Users } from 'lucide-react';

import { MaintenanceLog } from '../types';
import { APP_VERSION } from '../config';

interface NewRecordFormProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialCode?: string;
    initialData?: MaintenanceLog;
    mechanics?: string[];
    equipment?: string[];
}

export const NewRecordForm: React.FC<NewRecordFormProps> = ({ onClose, onSubmit, initialCode, initialData, mechanics = [], equipment = [] }) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const [formData, setFormData] = useState({
        code: initialData?.code || initialCode || 'MAN-',
        equipmentCode: initialData?.equipmentCode || '',
        title: initialData?.title || '',
        status: initialData?.status || 'PENDENTE',
        startDate: initialData?.startDate || today,
        startTime: initialData?.startTime || currentTime,
        endDate: initialData?.endDate || today,
        endTime: initialData?.endTime || '',
        mechanic: initialData?.mechanic || '',
        totalHours: initialData?.totalHours || '0.00',
        observations: initialData?.observations || '',
        stopType: initialData?.stopType || 'PARADA MECÂNICA'
    });

    const calculateTotalHours = () => {
        if (!formData.startDate || !formData.startTime) {
            return '0.00';
        }

        try {
            const start = new Date(
                ...formData.startDate.split('-').map(Number) as [number, number, number],
                ...formData.startTime.split(':').map(Number) as [number, number]
            );
            // Correct month for JS Date
            start.setMonth(start.getMonth() - 1);

            let end: Date;
            if (formData.status === 'AGUARDANDO PEÇA') {
                end = new Date();
            } else if (formData.endDate && formData.endTime) {
                end = new Date(
                    ...formData.endDate.split('-').map(Number) as [number, number, number],
                    ...formData.endTime.split(':').map(Number) as [number, number]
                );
                end.setMonth(end.getMonth() - 1);
            } else {
                return '0.00';
            }

            if (isNaN(start.getTime()) || isNaN(end.getTime())) return '0.00';

            const diffMs = end.getTime() - start.getTime();
            if (diffMs < 0) return '0.00';

            const diffHours = diffMs / (1000 * 60 * 60);
            return diffHours.toFixed(2);
        } catch (e) {
            return '0.00';
        }
    };

    React.useEffect(() => {
        const updateHours = () => {
            const total = calculateTotalHours();
            setFormData(prev => {
                if (prev.totalHours !== total) {
                    return { ...prev, totalHours: total };
                }
                return prev;
            });
        };

        updateHours();

        // If awaiting parts, update every minute to keep calculation fresh
        let interval: any;
        if (formData.status === 'AGUARDANDO PEÇA') {
            interval = setInterval(updateHours, 60000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [formData.startDate, formData.startTime, formData.endDate, formData.endTime, formData.status]);

    // Reactive Observations Automation
    React.useEffect(() => {
        let newObs = formData.observations;
        const totalTag = `TOTAL DE HORAS: ${formData.totalHours}H`;
        const awaitingPartsTag = 'AGUARDANDO PEÇA';

        // 1. Handle "AGUARDANDO PEÇA" tag
        if (formData.status === 'AGUARDANDO PEÇA') {
            if (!newObs.includes(awaitingPartsTag)) {
                newObs = newObs ? `${newObs} | ${awaitingPartsTag}` : awaitingPartsTag;
            }
        }

        // 2. Handle "TOTAL DE HORAS" tag
        // Update if already present, OR add if status is COMPLETED
        if (newObs.includes('TOTAL DE HORAS:')) {
            newObs = newObs.replace(/TOTAL DE HORAS: [\d.]+H/, totalTag);
        } else if (formData.status === 'CONCLUÍDO') {
            newObs = newObs ? `${newObs} | ${totalTag}` : totalTag;
        }

        if (newObs.toUpperCase() !== formData.observations) {
            setFormData(prev => ({ ...prev, observations: newObs.toUpperCase() }));
        }
    }, [formData.status, formData.totalHours]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (initialData) {
            const confirmed = window.confirm("Deseja realmente atualizar o registro?");
            if (!confirmed) return;
        }

        onSubmit(formData);
        onClose();
    };

    const isCompleted = formData.status === 'CONCLUÍDO';

    return (
        <div className="fixed inset-0 max-w-md mx-auto left-0 right-0 bg-white z-[60] flex flex-col animate-in slide-in-from-bottom duration-300 border-x-4 border-black">
            <header className="bg-excalibur border-b-4 border-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-white brutal-border-sm p-0.5 overflow-hidden w-8 h-8 flex items-center justify-center">
                        <img src="/logo-excalibur.jpg" alt="Logo" className="w-full h-auto" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold tracking-tighter uppercase italic leading-none">EXCALIBUR</h2>
                        <span className="font-mono text-[9px] uppercase font-bold opacity-70 tracking-widest">{initialData ? 'EDITAR' : 'NOVO'} REGISTRO</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white text-black font-mono font-bold px-2 border-2 border-black text-sm">
                        {APP_VERSION}
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors p-1"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto p-4 pb-8 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">ID REGISTRO</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full brutal-border p-3 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
                            placeholder="MAN-000"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">CÓD. EQUIPAMENTO</label>
                        <input
                            type="text"
                            list="equipment-list"
                            value={formData.equipmentCode}
                            onChange={(e) => setFormData({ ...formData, equipmentCode: e.target.value.toUpperCase() })}
                            className="w-full brutal-border p-3 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
                            placeholder="EQ-000"
                            required
                        />
                        <datalist id="equipment-list">
                            {equipment.map((code) => (
                                <option key={code} value={code} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">DESCRIÇÃO DA ATIVIDADE</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value.toUpperCase() })}
                        className="w-full brutal-border p-3 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
                        placeholder="EX: TROCA DE ÓLEO"
                        required
                    />
                </div>

                <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">OBSERVAÇÃO</label>
                    <textarea
                        value={formData.observations}
                        onChange={(e) => setFormData({ ...formData, observations: e.target.value.toUpperCase() })}
                        className="w-full brutal-border p-3 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase min-h-[100px] custom-scrollbar"
                        placeholder="DETALHES ADICIONAIS EX: FILTRO TROCADO"
                    />
                </div>

                <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">MECÂNICO RESPONSÁVEL</label>
                    <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            list="mechanics-list"
                            value={formData.mechanic}
                            onChange={(e) => setFormData({ ...formData, mechanic: e.target.value.toUpperCase() })}
                            className="w-full brutal-border p-3 pl-10 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
                            placeholder="SELECIONE OU DIGITE O NOME"
                        />
                        <datalist id="mechanics-list">
                            {mechanics.map((name) => (
                                <option key={name} value={name} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">TIPO DE PARADA</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'PARADA MECÂNICA', label: 'PARADA MECÂNICA' },
                            { id: 'OPORTUNIDADE', label: 'OPORTUNIDADE' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, stopType: item.id as any })}
                                className={`p-4 brutal-border font-bold text-sm transition-all ${formData.stopType === item.id ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">STATUS INICIAL</label>
                    <select
                        value={formData.status}
                        onChange={(e) => {
                            const newStatus = e.target.value;
                            const update: any = { status: newStatus };

                            if (newStatus === 'CONCLUÍDO') {
                                update.endDate = today;
                                update.endTime = currentTime;
                            }

                            setFormData({ ...formData, ...update });
                        }}
                        className="w-full brutal-border p-4 font-bold text-xl bg-white appearance-none focus:outline-none uppercase"
                    >
                        <option value="AGUARDANDO PEÇA">AGUARDANDO PEÇA</option>
                        <option value="CONCLUÍDO">CONCLUÍDO</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">DATA INICIAL</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full brutal-border p-3 pl-9 font-bold text-lg focus:outline-none focus:bg-gray-50"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">DATA FINAL</label>
                        <div className="relative">
                            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${isCompleted ? 'text-gray-400' : 'text-gray-200'}`} size={18} />
                            <input
                                type="date"
                                value={formData.endDate}
                                disabled={!isCompleted}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className={`w-full brutal-border p-3 pl-9 font-bold text-lg focus:outline-none transition-colors ${isCompleted ? 'bg-white focus:bg-gray-50' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    }`}
                                required={isCompleted}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">HORA INÍCIO</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full brutal-border p-3 pl-9 font-bold text-lg focus:outline-none focus:bg-gray-50"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">HORA FIM</label>
                        <div className="relative">
                            <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isCompleted ? 'text-gray-400' : 'text-gray-200'}`} size={18} />
                            <input
                                type="time"
                                value={formData.endTime}
                                disabled={!isCompleted}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className={`w-full brutal-border p-3 pl-9 font-bold text-lg focus:outline-none transition-colors ${isCompleted ? 'bg-white focus:bg-gray-50' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    }`}
                                required={isCompleted}
                            />
                        </div>
                    </div>
                </div>

                <div className="brutal-border p-4 bg-black text-white">
                    <label className="block font-mono text-[10px] font-bold uppercase mb-1 opacity-70">TOTAL DE HORAS</label>
                    <div className="text-4xl font-black italic">
                        {formData.totalHours} <span className="text-lg opacity-50 not-italic">H</span>
                    </div>
                </div>



                <button
                    type="submit"
                    className="w-full bg-black text-white p-6 brutal-border shadow-brutal flex items-center justify-between hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-8"
                >
                    <span className="font-bold text-2xl uppercase italic">{initialData ? 'ATUALIZAR' : 'SALVAR'} REGISTRO</span>
                    <Check size={36} strokeWidth={3} />
                </button>
            </form>
        </div>
    );
};

