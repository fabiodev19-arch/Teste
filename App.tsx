import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Logs } from './components/Logs';
import { Config } from './components/Config';
import { NewRecordForm } from './components/NewRecordForm';
import { RecordDetails } from './components/RecordDetails';
import { User, MaintenanceLog, MaintenanceStatus, UserRole } from './types';

const INITIAL_LOGS: MaintenanceLog[] = [];

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
      // Load logs regardless of auth for now, or maybe only if auth? User asked to persist.
      // Assuming public read for now as per schema policy, or protected.
      // Better to fetch logs here.
      // Better to fetch logs here.
      await fetchLogs();
      await fetchAuxData();
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

      if (error) {
        // If profile doesn't exist, just set default
        console.log('Profile fetch error (optimistic defaults used):', error.message);
      }

      setUser({
        username: email,
        role: (profile?.role as UserRole) || 'UNIVERSAL',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedLogs: MaintenanceLog[] = (data || []).map((item: any) => ({
        id: item.id,
        code: item.code,
        equipmentCode: item.equipment_code,
        title: item.title,
        time: item.start_time, // Display time usually start time
        date: item.start_date,
        startDate: item.start_date,
        startTime: item.start_time,
        endDate: item.end_date,
        endTime: item.end_time,
        status: item.status as MaintenanceStatus,
        mechanic: item.mechanic,
        totalHours: item.total_hours,
        observations: item.observations,
        stopType: item.stop_type
      }));

      setLogs(mappedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchAuxData = async () => {
    try {
      const { data: mechData } = await supabase.from('mechanics').select('name').eq('active', true);
      const { data: eqData } = await supabase.from('equipments').select('code').eq('active', true);

      if (mechData) setMechanics(mechData.map(m => m.name));
      if (eqData) setEquipment(eqData.map(e => e.code));
    } catch (error) {
      console.error('Error fetching aux data:', error);
    }
  };

  const [currentTab, setCurrentTab] = useState<'inicio' | 'logs' | 'config'>('inicio');
  const [logFilter, setLogFilter] = useState<MaintenanceStatus | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [logs, setLogs] = useState<MaintenanceLog[]>(INITIAL_LOGS);
  const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);
  const [editingLog, setEditingLog] = useState<MaintenanceLog | null>(null);
  const [mechanics, setMechanics] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);

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

  const handleSaveLog = async (data: any) => {
    // NewRecordForm already handles the insert/upsert to Supabase
    // We just need to refresh the list
    await fetchLogs();
    setShowForm(false);
    setEditingLog(null);
  };

  const handleEditClick = (log: MaintenanceLog) => {
    setSelectedLog(null);
    setEditingLog(log);
    setShowForm(true);
  };

  const getNextId = () => {
    const maxNum = logs.reduce((max, log) => {
      // Extract number from MAN-XXX
      const match = log.code.match(/MAN-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      // Also check standard integer IDs if migration old data
      return max;
    }, 0);
    return `MAN-${(maxNum + 1).toString().padStart(3, '0')}`;
  };

  const handleDeleteLog = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      const { error } = await supabase
        .from('maintenance_logs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchLogs();

      if (selectedLog?.id === id) {
        setSelectedLog(null);
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      alert('Erro ao excluir registro.');
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
          onSave={() => {
            // Give time for the visual feedback in Config.tsx
            setTimeout(async () => {
              await fetchAuxData(); // Refresh data after config changes
              setCurrentTab('inicio');
            }, 1000);
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
