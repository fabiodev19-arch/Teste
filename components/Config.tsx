import React, { useState } from 'react';
import { UserPlus, Trash2, Users, Check, Cog, Tractor } from 'lucide-react';

interface ConfigProps {
  mechanics: string[];
  onUpdateMechanics: (mechanics: string[]) => void;
  equipment: string[];
  onUpdateEquipment: (equipment: string[]) => void;
  onSave: () => void;
}

export const Config: React.FC<ConfigProps> = ({ mechanics, onUpdateMechanics, equipment, onUpdateEquipment, onSave }) => {
  const [localMechanics, setLocalMechanics] = useState(mechanics);
  const [localEquipment, setLocalEquipment] = useState(equipment);
  const [operator, setOperator] = useState('ADMIN FOREST');
  const [unit, setUnit] = useState('EXCALIBUR-NORTE');
  const [newMechanic, setNewMechanic] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleAddMechanic = () => {
    if (newMechanic && !localMechanics.includes(newMechanic.toUpperCase())) {
      setLocalMechanics([...localMechanics, newMechanic.toUpperCase()]);
      setNewMechanic('');
    }
  };

  const handleRemoveMechanic = (name: string) => {
    setLocalMechanics(localMechanics.filter(m => m !== name));
  };

  const handleAddEquipment = () => {
    if (newEquipment && !localEquipment.includes(newEquipment.toUpperCase())) {
      setLocalEquipment([...localEquipment, newEquipment.toUpperCase()]);
      setNewEquipment('');
    }
  };

  const handleRemoveEquipment = (code: string) => {
    setLocalEquipment(localEquipment.filter(e => e !== code));
  };

  const hasChanges =
    JSON.stringify(localMechanics) !== JSON.stringify(mechanics) ||
    JSON.stringify(localEquipment) !== JSON.stringify(equipment) ||
    operator !== 'ADMIN FOREST' ||
    unit !== 'EXCALIBUR-NORTE';

  const handleSave = () => {
    if (!hasChanges) return;

    onUpdateMechanics(localMechanics);
    onUpdateEquipment(localEquipment);
    setIsSaved(true);
    onSave();
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <section>
        <h2 className="text-4xl font-extrabold text-black uppercase leading-none">CONFIGURAÇÕES</h2>
        <h3 className="text-2xl font-bold text-excalibur-light uppercase mb-6">DO SISTEMA</h3>
      </section>

      <div className="space-y-6">
        {/* Operator Profile */}
        <div className="brutal-border p-4 bg-white shadow-brutal">
          <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">PERFIL DO OPERADOR</label>
          <input
            type="text"
            value={operator}
            onChange={(e) => setOperator(e.target.value.toUpperCase())}
            className="w-full brutal-border p-3 font-bold text-lg focus:outline-none focus:bg-gray-50 uppercase"
          />
        </div>

        {/* Mechanics Management */}
        <div className="brutal-border p-4 bg-white shadow-brutal">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
            <Users size={20} className="text-excalibur" />
            <label className="block font-mono text-sm font-bold uppercase">GERENCIAR MECÂNICOS</label>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newMechanic}
              onChange={(e) => setNewMechanic(e.target.value.toUpperCase())}
              placeholder="NOME DO NOVO MECÂNICO"
              className="flex-1 brutal-border p-2 font-bold text-sm focus:outline-none uppercase"
            />
            <button
              onClick={handleAddMechanic}
              className="bg-black text-white px-4 brutal-border hover:bg-excalibur transition-colors"
            >
              <UserPlus size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {localMechanics.map((name) => (
              <div key={name} className="flex justify-between items-center p-2 border-b border-gray-100 last:border-0">
                <span className="font-bold text-sm uppercase">{name}</span>
                <button
                  onClick={() => handleRemoveMechanic(name)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Management */}
        <div className="brutal-border p-4 bg-white shadow-brutal">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
            <Cog size={20} className="text-excalibur" />
            <label className="block font-mono text-sm font-bold uppercase">GERENCIAR EQUIPAMENTOS</label>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newEquipment}
              onChange={(e) => setNewEquipment(e.target.value.toUpperCase())}
              placeholder="CÓDIGO DA MÁQUINA"
              className="flex-1 brutal-border p-2 font-bold text-sm focus:outline-none uppercase"
            />
            <button
              onClick={handleAddEquipment}
              className="bg-black text-white px-4 brutal-border hover:bg-excalibur transition-colors"
            >
              <Tractor size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {localEquipment.map((code) => (
              <div key={code} className="flex justify-between items-center p-2 border-b border-gray-100 last:border-0">
                <span className="font-bold text-sm uppercase">{code}</span>
                <button
                  onClick={() => handleRemoveEquipment(code)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Selection */}
        <div className="brutal-border p-4 bg-white shadow-brutal">
          <label className="block font-mono text-xs font-bold uppercase mb-2 text-gray-400">UNIDADE REGIONAL</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full brutal-border p-3 font-bold text-lg bg-white appearance-none focus:outline-none uppercase"
          >
            <option value="EXCALIBUR-NORTE">EXCALIBUR-NORTE</option>
            <option value="EXCALIBUR-SUL">EXCALIBUR-SUL</option>
            <option value="EXCALIBUR-ESTE">EXCALIBUR-ESTE</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={!hasChanges && !isSaved}
          className={`w-full p-6 brutal-border shadow-brutal flex items-center justify-between transition-all mt-8 ${isSaved
              ? 'bg-brutal-green text-white translate-x-1 translate-y-1 shadow-none'
              : hasChanges
                ? 'bg-black text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none'
            }`}
        >
          <span className="font-bold text-2xl uppercase italic">
            {isSaved ? 'CONFIGURAÇÕES SALVAS!' : 'SALVAR CONFIGURAÇÕES'}
          </span>
          <Check size={36} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
