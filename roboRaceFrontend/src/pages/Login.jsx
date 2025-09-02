import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
    const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    
    if (credentials.username === validUsername && credentials.password === validPassword) {
      onLogin(true);
      navigate('/teams');
    } else {
      setError('Usuário ou senha incorretos');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#40BBD9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto w-32 h-32 mb-6">
            <img src="/publicLogo.png" alt="Roborace Univas" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Roborace Univas</h1>
          <p className="text-gray-500 text-sm">Sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2DA63F]/20 focus:border-[#2DA63F] transition-all duration-200 bg-gray-50/50"
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40BBD9]/20 focus:border-[#40BBD9] transition-all duration-200 bg-gray-50/50"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#40BBD9] text-white py-3.5 px-4 rounded-xl hover:bg-[#40BBD9] focus:outline-none focus:ring-2 focus:ring-[#40BBD9]/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium mt-8"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Credenciais de teste:</p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Usuário:</span> admin • <span className="font-medium">Senha:</span> admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}