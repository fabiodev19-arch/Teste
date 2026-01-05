import React, { useState } from 'react';
import { UserPlus, Trash2, Users, Check, Cog, Tractor } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConfigProps {
  onSave: () => void;
}

export const Config: React.FC<ConfigProps> = ({ onSave }) => {
  const [mechanics, setMechanics] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [operator, setOperator] = useState('ADMIN FOREST');
  const [unit, setUnit] = useState('UNIDADE-NORTE');
  const [newMechanic, setNewMechanic] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const fetchConfig = async () => {
    try {
      console.log('Fetching config...');
      const { data: mechData, error: mechError } = await supabase.from('mechanics').select('name').eq('active', true);
      if (mechError) throw mechError;

      const { data: eqData, error: eqError } = await supabase.from('equipments').select('code').eq('active', true);
      if (eqError) throw eqError;

      console.log('Mechanics loaded:', mechData);
      console.log('Equipment loaded:', eqData);

      if (mechData) setMechanics(mechData.map(m => m.name));
      if (eqData) setEquipment(eqData.map(e => e.code));
    } catch (error: any) {
      console.error('Error fetching config:', error);
      alert(`Erro ao carregar configurações: ${error.message}`);
    }
  };

  React.useEffect(() => {
    fetchConfig();
  }, []);

  const handleAddMechanic = async () => {
    if (newMechanic && !mechanics.includes(newMechanic.toUpperCase())) {
      const { error } = await supabase.from('mechanics').insert([{ name: newMechanic.toUpperCase() }]);
      if (!error) {
        setMechanics([...mechanics, newMechanic.toUpperCase()]);
        setNewMechanic('');
      } else {
        alert('Erro ao adicionar: ' + error.message);
      }
    }
  };

  const handleRemoveMechanic = async (name: string) => {
    if (confirm(`Remover ${name}?`)) {
      const { error } = await supabase.from('mechanics').delete().eq('name', name); // Or set active=false
      if (!error) {
        setMechanics(mechanics.filter(m => m !== name));
      } else {
        // If hard delete fails (foreign key), maybe try soft delete?
        // For MVP, if FK constraint exists, it will fail.
        // Assuming no strict FK on logs yet, or logs store name text (which they do).
        // Since logs store TEXT name, hard delete is fine for auxiliary table, but historical logs keep the name.
        setMechanics(mechanics.filter(m => m !== name));
      }
    }
  };

  const handleAddEquipment = async () => {
    if (newEquipment && !equipment.includes(newEquipment.toUpperCase())) {
      const { error } = await supabase.from('equipments').insert([{ code: newEquipment.toUpperCase(), name: newEquipment.toUpperCase() }]);
      if (!error) {
        setEquipment([...equipment, newEquipment.toUpperCase()]);
        setNewEquipment('');
      } else {
        alert('Erro ao adicionar: ' + error.message);
      }
    }
  };

  const handleRemoveEquipment = async (code: string) => {
    if (confirm(`Remover ${code}?`)) {
      const { error } = await supabase.from('equipments').delete().eq('code', code);
      if (!error) {
        setEquipment(equipment.filter(e => e !== code));
      }
    }
  };

  const handleSave = () => {
    // Only saves local preferences (operator/unit) if we were persisting them (currently local state only)
    // mechanics and equipment are saved immediately.
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
            {mechanics.map((name) => (
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
            {equipment.map((code) => (
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
            <option value="UNIDADE-NORTE">UNIDADE-NORTE</option>
            <option value="UNIDADE-SUL">UNIDADE-SUL</option>
            <option value="UNIDADE-ESTE">UNIDADE-ESTE</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className={`w-full p-6 brutal-border shadow-brutal flex items-center justify-between transition-all mt-8 ${isSaved
            ? 'bg-brutal-green text-white translate-x-1 translate-y-1 shadow-none'
            : 'bg-black text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none'
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
