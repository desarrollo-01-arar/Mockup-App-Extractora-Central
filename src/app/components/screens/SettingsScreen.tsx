import { useState } from 'react';
import { UserCircle, Lock, LogOut, WifiOff, Bell, Moon, Sun, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { currentUser } from '../../data/mockData';

export function SettingsScreen() {
  const { navigate, isDark, toggleTheme } = useApp();

  const [offlineMode, setOfflineMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChanged, setPassChanged] = useState(false);

  const handlePasswordSave = () => {
    if (newPass && newPass === confirmPass) {
      setPassChanged(true);
      setTimeout(() => {
        setPassChanged(false);
        setShowPasswordModal(false);
        setCurrentPass(''); setNewPass(''); setConfirmPass('');
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* App bar */}
      <div className="flex-shrink-0 px-4 pt-4 pb-5 bg-primary">
        <h1 className="text-white font-bold text-lg mb-4">Perfil y Ajustes</h1>

        {/* Profile card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/12" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center justify-center rounded-2xl bg-white/25" style={{ width: 52, height: 52 }}>
            <UserCircle size={32} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[15px] truncate">{currentUser.name}</p>
            <p className="text-white/75 text-xs">{currentUser.role}</p>
            <p className="text-white/55 text-xs truncate">{currentUser.email}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-success/40">
            <span className="text-white text-[10px] font-bold">Activo</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <MapPin size={12} className="text-white/60" />
          <span className="text-white/60 text-xs">{currentUser.zone}</span>
        </div>
      </div>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Cuenta section */}
        <SettingsSection title="Cuenta">
          <SettingsButton
            icon={<Lock size={18} className="text-ring" />}
            label="Cambiar contraseña"
            description="Requiere conexión a internet"
            onPress={() => setShowPasswordModal(true)}
            last
          />
        </SettingsSection>

        {/* Conectividad section */}
        <SettingsSection title="Conectividad">
          <SettingsToggle
            icon={<WifiOff size={18} className="text-warning" />}
            label="Modo sin conexión"
            description="Evita búsqueda de red en zonas sin señal"
            value={offlineMode}
            onChange={setOfflineMode}
            last
          />
        </SettingsSection>

        {/* Notificaciones section */}
        {/* <SettingsSection title="Notificaciones">
          <SettingsToggle
            icon={<Bell size={18} className="text-success" />}
            label="Nuevas visitas asignadas"
            description="Notificaciones push al recibir visitas"
            value={notifications}
            onChange={setNotifications}
            last
          />
        </SettingsSection> */}

        {/* Apariencia section */}
        <SettingsSection title="Apariencia">
          <SettingsToggle
            icon={isDark ? <Moon size={18} className="text-ring" /> : <Sun size={18} className="text-warning" />}
            label="Tema oscuro"
            description={isDark ? 'Modo oscuro activado' : 'Modo claro activado'}
            value={isDark}
            onChange={() => toggleTheme()}
            last
          />
        </SettingsSection>

        {/* Logout */}
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-4 bg-transparent border-none cursor-pointer"
          >
            <div className="flex items-center justify-center rounded-xl bg-destructive/10 w-9 h-9 flex-shrink-0">
              <LogOut size={18} className="text-destructive" />
            </div>
            <span className="text-sm font-semibold text-destructive">Cerrar sesión</span>
          </button>
        </div>

        {/* App version */}
        <p className="text-center pb-2 text-xs text-muted-foreground">
          Extractora Central v1.0.0 · {new Date().getFullYear()}
        </p>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="absolute inset-0 z-50 flex flex-col bg-black/50">
          <div className="flex-1" onClick={() => setShowPasswordModal(false)} />
          <div className="bg-card rounded-t-3xl px-5 pt-5 pb-6">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-sm bg-border" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-4">Cambiar contraseña</h3>

            <div className="space-y-3">
              {[
                { label: 'Contraseña actual', value: currentPass, onChange: setCurrentPass },
                { label: 'Nueva contraseña', value: newPass, onChange: setNewPass },
                { label: 'Confirmar nueva contraseña', value: confirmPass, onChange: setConfirmPass },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">{f.label}</label>
                  <input
                    type="password"
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3 py-2.5 outline-none"
                    style={{ borderWidth: 1.5, boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </div>

            {newPass && confirmPass && newPass !== confirmPass && (
              <p className="text-xs text-destructive mt-2">Las contraseñas no coinciden</p>
            )}

            <button
              onClick={handlePasswordSave}
              disabled={!currentPass || !newPass || !confirmPass || newPass !== confirmPass}
              className="w-full py-3.5 rounded-xl border-none mt-4 cursor-pointer text-sm font-bold disabled:cursor-not-allowed"
              style={{
                background: passChanged ? 'var(--color-success)' : (!currentPass || !newPass || !confirmPass || newPass !== confirmPass) ? 'var(--color-border)' : 'var(--color-primary)',
                color: (!currentPass || !newPass || !confirmPass || newPass !== confirmPass) && !passChanged ? 'var(--color-muted-foreground)' : 'white',
              }}
            >
              {passChanged ? '¡Contraseña actualizada!' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      )}

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="bg-card rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="w-13 h-13 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut size={24} className="text-destructive" />
              </div>
            </div>
            <h3 className="text-base font-bold text-foreground text-center mb-2">Cerrar sesión</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              ¿Estás seguro que deseas cerrar sesión? Los formularios no sincronizados quedarán guardados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border bg-transparent text-sm font-semibold text-muted-foreground cursor-pointer"
                style={{ borderWidth: 1.5 }}
              >
                Cancelar
              </button>
              <button
                onClick={() => navigate('login')}
                className="flex-1 py-2.5 rounded-xl border-none bg-destructive text-sm font-bold text-white cursor-pointer"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSection({ title, children }: {
  title: string; children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 pl-1">
        {title}
      </p>
      <div className="bg-card rounded-xl shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingsButton({ icon, label, description, onPress, last }: {
  icon: React.ReactNode; label: string; description: string;
  onPress?: () => void; last?: boolean;
}) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-transparent border-none cursor-pointer"
      style={{ borderBottom: last ? 'none' : '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-center rounded-xl w-9 h-9 flex-shrink-0 bg-ring/10">
        {icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {onPress && <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />}
    </button>
  );
}

function SettingsToggle({ icon, label, description, value, onChange, last }: {
  icon: React.ReactNode; label: string; description: string;
  value: boolean; onChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: last ? 'none' : '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-center rounded-xl w-9 h-9 flex-shrink-0 bg-ring/10">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {/* Toggle switch */}
      <button
        onClick={() => onChange(!value)}
        className="w-11 h-[26px] rounded-full border-none cursor-pointer relative flex-shrink-0 p-0"
        style={{
          background: value ? 'var(--color-ring)' : 'var(--color-border)',
          transition: 'background 0.2s',
        }}
      >
        <div
          className="absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-sm"
          style={{ left: value ? 21 : 3, transition: 'left 0.2s' }}
        />
      </button>
    </div>
  );
}
