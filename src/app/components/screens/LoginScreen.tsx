import { useState } from 'react';
import { Eye, EyeOff, Wifi, WifiOff, Leaf } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function LoginScreen() {
  const { navigate } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('home');
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full bg-primary">
      {/* Top decorative circles */}
      <div className="absolute top-0 right-0 opacity-10">
        <div className="bg-white rounded-full" style={{ width: 200, height: 200, transform: 'translate(60px, -60px)' }} />
      </div>
      <div className="absolute top-50 left-0 opacity-5">
        <div className="bg-white rounded-full" style={{ width: 150, height: 150, transform: 'translate(-60px, 0)' }} />
      </div>

      {/* Logo area */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 pb-8 relative z-10">
        <img src="/Logo.png" alt="Logo" className="mb-4" />
        <p className="text-white/70 text-center text-sm">
          Sistema de Control de Calidad
        </p>
      </div>

      {/* Login card */}
      <div className="mx-4 mb-6 relative z-10 bg-card rounded-3xl px-6 py-7 shadow-2xl shadow-black/25">
        <h2 className="text-primary font-bold text-lg mb-1">Iniciar Sesión</h2>
        <p className="text-muted-foreground text-xs mb-5">Ingrese sus credenciales para continuar</p>

        {/* Username */}
        <div className="mb-4">
          <label className="text-foreground text-xs font-semibold block mb-1.5">
            Usuario
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            className="w-full bg-input-background text-foreground border-border text-sm rounded-xl px-3.5 py-2.5 outline-none"
            style={{ borderWidth: 1.5, boxSizing: 'border-box' }}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-foreground text-xs font-semibold block mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-input-background text-foreground border-border text-sm rounded-xl pl-3.5 pr-10 py-2.5 outline-none"
              style={{ borderWidth: 1.5, boxSizing: 'border-box' }}
            />
            <button
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground bg-transparent border-none cursor-pointer p-0.5"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-destructive text-xs mb-3 bg-destructive/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 rounded-xl border-none font-bold text-sm tracking-wide text-white cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: loading ? 'var(--color-muted-foreground)' : 'var(--color-primary)',
            boxShadow: loading ? 'none' : '0 4px 15px rgba(46,117,182,0.4)',
          }}
        >
          {loading ? 'Verificando...' : 'Iniciar Sesión'}
        </button>

        {/* Offline hint */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Wifi size={12} className="text-success" />
          <span className="text-muted-foreground text-xs">
            Primer ingreso requiere conexión a internet
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 relative z-10 text-white/45 text-xs">
        © {new Date().getFullYear()} • Extractora Central
      </div>
    </div>
  );
}
