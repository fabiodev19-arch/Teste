import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Logs } from './components/Logs';
import { Config } from './components/Config';
import { NewRecordForm } from './components/NewRecordForm';
import { RecordDetails } from './components/RecordDetails';
import { User, MaintenanceLog, MaintenanceStatus } from './types';

const INITIAL_LOGS: MaintenanceLog[] = [
  {
    id: '1',
    code: 'EXCALIBUR-001 [EQ-01]',
    equipmentCode: 'EQ-01',
    title: 'Troca de Óleo',
    time: '10:30',
    date: '2026-01-01',
    startDate: '2026-01-01',
    startTime: '10:30',
    status: MaintenanceStatus.COMPLETED
  },
  {
    id: '2',
    code: 'EXCALIBUR-005 [EQ-03]',
    equipmentCode: 'EQ-03',
    title: 'Manutenção Hidráulica',
    time: '08:15',
    startDate: '2026-01-01',
    startTime: '08:15',
    status: MaintenanceStatus.AWAITING_PARTS
  },
  {
    id: '3',
    code: 'EXCALIBUR-008 [CM-05]',
    equipmentCode: 'CM-05',
    title: 'Inspeção Pneus',
    time: '16:45',
    date: '2023-10-14',
    startDate: '2023-10-14',
    startTime: '16:45',
    status: MaintenanceStatus.AWAITING_PARTS
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    };

    checkInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await fetchProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser({
        username: email,
        role: (profile?.role as UserRole) || 'UNIVERSAL',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const [currentTab, setCurrentTab] = useState<'inicio' | 'logs' | 'config'>('inicio');
  const [logFilter, setLogFilter] = useState<MaintenanceStatus | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<MaintenanceLog[]>(INITIAL_LOGS);
  const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);
  const [editingLog, setEditingLog] = useState<MaintenanceLog | null>(null);
  const [mechanics, setMechanics] = useState<string[]>(['MECÂNICO 01', 'MECÂNICO 02']);
  const [equipment, setEquipment] = useState<string[]>(['EQ-01', 'EQ-02', 'CM-05']);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentTab('inicio');
    setLogFilter(null);
  };

  const handleFilterClick = (status: MaintenanceStatus) => {
    setLogFilter(status);
    setCurrentTab('logs');
  };

  const handleSaveLog = (data: any) => {
    if (editingLog) {
      // Update existing log
      const updatedLogs = logs.map(log =>
        log.id === editingLog.id ? {
          ...log,
          ...data,
          status: data.status as MaintenanceStatus,
          stopType: data.stopType,
          time: data.startTime // Update display time too
        } : log
      );
      setLogs(updatedLogs);
      setEditingLog(null);
    } else {
      // Add new log
      const newLog: MaintenanceLog = {
        id: Date.now().toString(),
        code: data.code,
        equipmentCode: data.equipmentCode,
        title: data.title,
        time: data.startTime,
        startDate: data.startDate,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status as MaintenanceStatus,
        mechanic: data.mechanic,
        endDate: data.endDate,
        totalHours: data.totalHours,
        observations: data.observations,
        stopType: data.stopType
      };
      setLogs([newLog, ...logs]);
    }
    setShowForm(false);
  };

  const handleEditClick = (log: MaintenanceLog) => {
    setSelectedLog(null); // Close details
    setEditingLog(log);   // Set log to edit
    setShowForm(true);    // Open form
  };

  const getNextId = () => {
    const maxNum = logs.reduce((max, log) => {
      const match = log.code.match(/MAN-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    return `MAN-${(maxNum + 1).toString().padStart(3, '0')}`;
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
    if (selectedLog?.id === id) {
      setSelectedLog(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="font-mono font-bold animate-pulse uppercase tracking-[0.5em]">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentTab={currentTab}
      onTabChange={(tab) => {
        setCurrentTab(tab);
        if (tab !== 'logs') setLogFilter(null);
      }}
      user={user}
      onLogout={handleLogout}
    >
      {currentTab === 'inicio' && (
        <Dashboard
          onNewRecord={() => {
            setEditingLog(null);
            setShowForm(true);
          }}
          logs={logs}
          onSelectLog={setSelectedLog}
          onSeeAll={() => {
            setLogFilter(null);
            setCurrentTab('logs');
          }}
          onFilterPending={() => handleFilterClick(MaintenanceStatus.AWAITING_PARTS)}
          onFilterCompleted={() => handleFilterClick(MaintenanceStatus.COMPLETED)}
        />
      )}
      {currentTab === 'logs' && (
        <Logs
          logs={logs}
          onSelectLog={setSelectedLog}
          activeFilter={logFilter}
          onClearFilter={() => setLogFilter(null)}
          onClose={() => {
            setCurrentTab('inicio');
            setLogFilter(null);
          }}
          userRole={user.role}
          onDeleteLog={handleDeleteLog}
        />
      )}
      {currentTab === 'config' && user.role === 'ADMIN' && (
        <Config
          mechanics={mechanics}
          onUpdateMechanics={setMechanics}
          equipment={equipment}
          onUpdateEquipment={setEquipment}
          onSave={() => {
            // Give time for the visual feedback in Config.tsx
            setTimeout(() => setCurrentTab('inicio'), 1000);
          }}
        />
      )}

      {showForm && (
        <NewRecordForm
          onClose={() => {
            setShowForm(false);
            setEditingLog(null);
          }}
          onSubmit={handleSaveLog}
          initialCode={editingLog ? undefined : getNextId()}
          initialData={editingLog || undefined}
          mechanics={mechanics}
          equipment={equipment}
        />
      )}

      {selectedLog && (
        <RecordDetails
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onEdit={handleEditClick}
        />
      )}
    </Layout>
  );
};

export default App;
