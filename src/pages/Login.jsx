import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@motopecas.pro');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      // Simulate/call login auth context
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg('Credenciais inválidas. Use admin@motopecas.pro e admin123 para acessar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
      
      {/* Login Card */}
      <div className="bg-white rounded-[2rem] border border-outline-variant p-8 max-w-md w-full shadow-2xl relative z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary-fixed text-primary rounded-3xl flex items-center justify-center mb-4 border border-primary/20 shadow-inner">
            <span className="material-symbols-outlined text-[36px]">motorcycle</span>
          </div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">MotoPeças Pro</h2>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mt-1.5">Acesse o seu portal de gestão</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-error rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-relaxed">
            <span className="material-symbols-outlined text-[16px] mt-0.5">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">E-mail Comercial</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 transform -translate-y-1/2 text-outline text-[18px]">mail</span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface placeholder-outline font-mono"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase">Senha de Acesso</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 transform -translate-y-1/2 text-outline text-[18px]">lock</span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm font-semibold text-on-surface placeholder-outline font-mono"
              />
            </div>
          </div>

          {/* Quick instructions alert */}
          <div className="p-4 bg-primary-fixed/30 border border-primary-fixed-dim/40 rounded-2xl text-[11px] font-semibold text-on-primary-fixed-variant leading-relaxed">
            <p className="font-extrabold flex items-center gap-1 mb-0.5">
              <span className="material-symbols-outlined text-[14px]">info</span> Acesso de Demonstração:
            </p>
            <p>E-mail: <strong className="font-mono">admin@motopecas.pro</strong></p>
            <p>Senha: <strong className="font-mono">admin123</strong></p>
          </div>

          {/* Submit button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center transition-all shadow-md shadow-primary/20 hover:shadow-lg active:scale-98 disabled:opacity-50 text-xs tracking-wider uppercase"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
            ) : (
              <>
                Entrar no Painel
                <span className="material-symbols-outlined ml-2 text-[18px]">login</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xxs text-outline font-extrabold tracking-wider uppercase">MotoPeças Pro SaaS v2.5 • Unidade Centro</p>
        </div>

      </div>

    </div>
  );
};

export default Login;
