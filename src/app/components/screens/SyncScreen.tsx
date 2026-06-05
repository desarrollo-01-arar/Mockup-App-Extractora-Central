import { useState } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Clock, WifiOff, CloudUpload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { syncItems } from '../../data/mockData';
import type { SyncItem } from '../../data/mockData';

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

export function SyncScreen() {
  const { isDark } = useApp();
  const [items, setItems] = useState(syncItems);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  const pendingCount = items.filter(s => s.syncStatus === 'pending').length;
  const errorCount = items.filter(s => s.syncStatus === 'error').length;
  const syncedCount = items.filter(s => s.syncStatus === 'synced').length;

  const handleSync = () => {
    if (isOffline || isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);

    const interval = setInterval(() => {
      setSyncProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setItems(prev =>
            prev.map(item =>
              item.syncStatus === 'pending' || item.syncStatus === 'error'
                ? { ...item, syncStatus: 'synced', syncedAt: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) }
                : item
            )
          );
          return 100;
        }
        return p + 8;
      });
    }, 80);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'synced') return <CheckCircle2 size={18} className="text-success flex-shrink-0" />;
    if (status === 'error') return <XCircle size={18} className="text-destructive flex-shrink-0" />;
    return <Clock size={18} className="text-warning flex-shrink-0" />;
  };

  const StatusBadge = ({ item }: { item: SyncItem }) => {
    const configs = {
      synced: { className: 'bg-success/10 text-success', label: 'Sincronizado' },
      error: { className: 'bg-destructive/10 text-destructive', label: 'Error' },
      pending: { className: 'bg-warning/10 text-warning', label: 'Pendiente' },
    };
    const c = configs[item.syncStatus];
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.className}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* App bar */}
      <div className="flex-shrink-0 px-4 py-4 bg-primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">Sincronización</h1>
            <p className="text-white/70 text-xs mt-0.5">
              Formularios pendientes de subir
            </p>
          </div>
          <button
            onClick={() => setIsOffline(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-none cursor-pointer text-white"
            style={{ background: isOffline ? 'rgba(198,40,40,0.3)' : 'rgba(255,255,255,0.15)' }}
          >
            {isOffline ? <WifiOff size={14} /> : <RefreshCw size={14} />}
            <span className="text-xs font-semibold">{isOffline ? 'Sin red' : 'En línea'}</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          {[
            { label: 'Pendientes', count: items.filter(i => i.syncStatus === 'pending').length, className: 'text-warning bg-warning/15' },
            { label: 'Errores', count: items.filter(i => i.syncStatus === 'error').length, className: 'text-destructive bg-destructive/15' },
            { label: 'Sincronizados', count: items.filter(i => i.syncStatus === 'synced').length, className: 'text-success bg-success/15' },
          ].map(stat => (
            <div key={stat.label} className={`flex-1 flex flex-col items-center py-2 rounded-xl ${stat.className}`}>
              <span className="text-xl font-extrabold">{stat.count}</span>
              <span className="text-[10px] text-white/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 border-b border-destructive/30">
          <WifiOff size={14} className="text-destructive flex-shrink-0" />
          <span className="text-xs text-destructive">
            Modo sin conexión activo. Los formularios se sincronizarán cuando haya internet.
          </span>
        </div>
      )}

      {/* Sync button */}
      <div className="px-4 py-3 flex-shrink-0">
        {isSyncing ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Sincronizando...</span>
              <span className="text-xs font-bold text-ring">{syncProgress}%</span>
            </div>
            <div className="h-1.5 rounded-sm bg-border overflow-hidden">
              <div
                className="h-full rounded-sm"
                style={{ background: 'var(--color-primary)', transition: 'width 0.1s', width: `${syncProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleSync}
            disabled={isOffline || (pendingCount === 0 && errorCount === 0)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-none text-[15px] font-bold cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: (isOffline || (pendingCount === 0 && errorCount === 0))
                ? 'var(--color-border)' : 'var(--color-primary)',
              color: (isOffline || (pendingCount === 0 && errorCount === 0)) ? 'var(--color-muted-foreground)' : 'white',
              boxShadow: (isOffline || (pendingCount === 0 && errorCount === 0)) ? 'none' : '0 4px 15px rgba(46,117,182,0.35)',
            }}
          >
            <CloudUpload size={18} />
            {pendingCount === 0 && errorCount === 0 ? 'Todo sincronizado' : `Sincronizar ahora (${pendingCount + errorCount})`}
          </button>
        )}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2.5">
          Historial de formularios
        </p>

        {items.map(item => (
          <div
            key={item.id}
            className="mb-3 bg-card rounded-xl shadow-sm overflow-hidden"
            style={{
              borderLeft: `4px solid ${item.syncStatus === 'synced' ? 'var(--color-success)' : item.syncStatus === 'error' ? 'var(--color-destructive)' : 'var(--color-warning)'}`,
            }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <StatusIcon status={item.syncStatus} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-foreground truncate">{item.farmName}</p>
                    <StatusBadge item={item} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.providerName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.date)}
                    </span>
                    {item.syncedAt && (
                      <span className="text-xs text-success">Sync: {item.syncedAt}</span>
                    )}
                  </div>
                  {item.errorMessage && (
                    <div className="mt-2 px-2 py-1.5 rounded-lg bg-destructive/10">
                      <span className="text-xs text-destructive">{item.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
