import React, { useState, useEffect } from 'react';
import { User, Extra, ProfessionalCategory } from './types';
import { 
  LogOut, 
  PlusCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  FileText, 
  Trash2, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Send,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  Briefcase,
  Lock,
  ShieldCheck,
  Users,
  UserPlus,
  List,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const getThemeColors = (lotacao: string) => {
  return {
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    text: 'text-emerald-500',
    textLight: 'text-emerald-400',
    bgLight: 'bg-emerald-900/30',
    border: 'border-emerald-700/50',
    shadow: 'shadow-emerald-900/50',
    ring: 'focus:ring-emerald-500',
    borderHover: 'hover:border-emerald-600'
  };
};

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState({ type: '', text: '' });
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginId, password })
      });
      
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setForgotPasswordMessage({ type: '', text: '' });
    
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      if (data.success) {
        setResetUserId(data.userId);
        setForgotPasswordMessage({ type: '', text: '' });
      } else {
        setForgotPasswordMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setForgotPasswordMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotPasswordMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }
    if (newPassword.length < 6) {
      setForgotPasswordMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setLoading(true);
    setForgotPasswordMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resetUserId, newPassword })
      });

      const data = await res.json();
      if (data.success) {
        setForgotPasswordMessage({ type: 'success', text: 'Senha alterada com sucesso! Faça login.' });
        setTimeout(() => {
          setIsForgotPassword(false);
          setResetUserId(null);
          setForgotPasswordMessage({ type: '', text: '' });
          setEmail('');
          setNewPassword('');
          setConfirmPassword('');
        }, 3000);
      } else {
        setForgotPasswordMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setForgotPasswordMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-800/50"
        >
          <div className="text-center mb-8">
            <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-stone-100">
              {resetUserId ? 'Nova Senha' : 'Recuperar Senha'}
            </h1>
            <p className="text-stone-400">
              {resetUserId ? 'Crie uma nova senha para seu acesso' : 'Informe seu email cadastrado'}
            </p>
          </div>

          {resetUserId ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Nova Senha</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Confirmar Nova Senha</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {forgotPasswordMessage.text && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${forgotPasswordMessage.type === 'success' ? 'text-emerald-400 bg-emerald-900/30' : 'text-red-400 bg-red-900/30'}`}>
                  {forgotPasswordMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{forgotPasswordMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setResetUserId(null);
                  setForgotPasswordMessage({ type: '', text: '' });
                }}
                className="w-full text-stone-400 hover:text-stone-300 text-sm font-medium transition-colors"
              >
                Voltar
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {forgotPasswordMessage.text && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${forgotPasswordMessage.type === 'success' ? 'text-emerald-400 bg-emerald-900/30' : 'text-red-400 bg-red-900/30'}`}>
                  {forgotPasswordMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{forgotPasswordMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Continuar'}
              </button>
              
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-stone-400 hover:text-stone-300 text-sm font-medium transition-colors"
              >
                Voltar para o Login
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-800/50"
      >
        <div className="text-center mb-8">
          <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <TrendingUp className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100">Adm SAMU PVH</h1>
          <p className="text-stone-400">Gestão de Plantões Extras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">Matrícula</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="Digite sua matrícula"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-stone-300">Senha</label>
              <button 
                type="button" 
                onClick={() => setIsForgotPassword(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Esqueceu a senha?
              </button>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Acessar Sistema'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const ChangePasswordPage = ({ user, onPasswordChanged }: { user: User, onPasswordChanged: (updatedUser: User) => void }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registration, setRegistration] = useState(user.registration_number || '');
  const [category, setCategory] = useState<ProfessionalCategory>(user.professional_category || ProfessionalCategory.NURSE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFirstAccess = user.must_change_password === 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (isFirstAccess && !registration) {
      setError('A matrícula é obrigatória no primeiro acesso');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          newPassword,
          ...(isFirstAccess ? { registration_number: registration, professional_category: category } : {})
        })
      });
      
      const data = await res.json();
      if (data.success) {
        onPasswordChanged(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const theme = getThemeColors(user.lotacao_fisica);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-stone-900/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-800/50"
      >
        <div className="text-center mb-8">
          <div className={`${theme.primary} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${theme.shadow}`}>
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100">
            {isFirstAccess ? 'Configuração Inicial' : 'Alteração Obrigatória'}
          </h1>
          <p className="text-stone-400">
            {isFirstAccess 
              ? 'Complete seu cadastro e altere a senha padrão para acessar o sistema.' 
              : 'Por segurança, altere sua senha.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isFirstAccess && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Matrícula Funcional</label>
                <input
                  type="text"
                  required
                  className={`w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 ${theme.ring} focus:border-transparent transition-all outline-none`}
                  placeholder="Digite sua matrícula"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-300 mb-1">Categoria Profissional</label>
                <select 
                  className={`w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={category}
                  onChange={e => setCategory(e.target.value as ProfessionalCategory)}
                >
                  {Object.values(ProfessionalCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              className={`w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 ${theme.ring} focus:border-transparent transition-all outline-none`}
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              required
              className={`w-full px-4 py-3 rounded-xl border border-stone-700/50 bg-stone-900/50 text-stone-100 focus:ring-2 ${theme.ring} focus:border-transparent transition-all outline-none`}
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/30 p-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${theme.primary} ${theme.primaryHover} text-white font-semibold py-3 rounded-xl transition-all shadow-lg ${theme.shadow} disabled:opacity-50`}
          >
            {loading ? 'Salvando...' : (isFirstAccess ? 'Concluir Cadastro' : 'Atualizar Senha')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AdminPanel = ({ user }: { user: User }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    registration_number: '',
    professional_category: ProfessionalCategory.NURSE,
    hourly_rate: 0,
    is_admin: false,
    role_user: 'USER' as 'ADM' | 'USER',
    lotacao_fisica: 'samu pvh'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const theme = getThemeColors(user.lotacao_fisica);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Usuário cadastrado com sucesso!' });
        setShowAddForm(false);
        setNewUser({
          name: '',
          username: '',
          email: '',
          registration_number: '',
          professional_category: ProfessionalCategory.NURSE,
          hourly_rate: 0,
          is_admin: false,
          role_user: 'USER',
          lotacao_fisica: 'samu pvh'
        });
        fetchUsers();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Erro ao cadastrar usuário' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className={theme.text} />
          Painel Administrativo
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2 ${theme.primary} text-white px-4 py-2 rounded-xl text-sm font-semibold ${theme.primaryHover} transition-colors`}
        >
          <UserPlus size={18} />
          Novo Funcionário
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-stone-900/80 backdrop-blur-md p-6 rounded-2xl border border-stone-800/50 shadow-sm"
          >
            <h3 className="font-bold mb-4">Cadastrar Novo Servidor</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Usuário (Login)</label>
                <input 
                  type="text" 
                  required
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Matrícula (Opcional)</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.registration_number}
                  onChange={e => setNewUser({...newUser, registration_number: e.target.value})}
                  placeholder="Preenchido no 1º acesso"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Categoria</label>
                <select 
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.professional_category}
                  onChange={e => setNewUser({...newUser, professional_category: e.target.value as ProfessionalCategory})}
                >
                  {Object.values(ProfessionalCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Valor/Hora (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.hourly_rate}
                  onChange={e => setNewUser({...newUser, hourly_rate: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Lotação Física</label>
                <select 
                  className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                  value={newUser.lotacao_fisica}
                  onChange={e => setNewUser({...newUser, lotacao_fisica: e.target.value})}
                >
                  <option value="samu pvh">SAMU PVH</option>
                  <option value="samu jacy">SAMU Jacy</option>
                  <option value="outros">Outros Locais</option>
                </select>
              </div>
              <div className="flex items-center gap-6 pt-6">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isAdmin"
                    className={`w-4 h-4 ${theme.text} border-stone-700 rounded focus:ring-2 ${theme.ring}`}
                    checked={newUser.is_admin}
                    onChange={e => {
                      const isAdm = e.target.checked;
                      setNewUser({...newUser, is_admin: isAdm, role_user: isAdm ? 'ADM' : 'USER'})
                    }}
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium text-stone-300">Acesso de Administrador</label>
                </div>
              </div>
              <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 text-stone-400 hover:bg-stone-800/50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`px-8 py-2 ${theme.primary} text-white rounded-lg font-semibold ${theme.primaryHover} transition-colors`}
                >
                  Cadastrar
                </button>
              </div>
            </form>
            {message.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? `${theme.bgLight} ${theme.text}` : 'bg-red-900/30 text-red-400'}`}>
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-stone-900/80 backdrop-blur-md rounded-2xl border border-stone-800/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-800/50">
          <h3 className="font-bold flex items-center gap-2">
            <Users size={20} className="text-stone-400" />
            Lista de Funcionários
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-900/50 text-stone-400 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Usuário / Email</th>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Lotação</th>
                <th className="px-6 py-4">Valor/Hora</th>
                <th className="px-6 py-4">Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-stone-400">Carregando...</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-stone-100">{u.username || '-'}</div>
                      <div className="text-xs text-stone-400">{u.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-stone-400">{u.registration_number || <span className="text-amber-500 text-xs italic">Pendente</span>}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-stone-800/50 text-stone-400 rounded text-[10px] font-bold uppercase">
                        {u.professional_category || 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-400 capitalize">{u.lotacao_fisica}</td>
                    <td className="px-6 py-4 font-mono text-stone-300">R$ {u.hourly_rate.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {u.role_user === 'ADM' || u.is_admin === 1 ? (
                        <span className={`flex items-center gap-1 ${theme.text} font-bold text-[10px] uppercase`}>
                          <ShieldCheck size={12} /> Admin
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[10px] uppercase">Servidor</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WeeklySheet = ({ extras, theme }: { extras: Extra[], theme: any }) => {
  // Group extras by week
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const weeks: { [key: number]: Extra[] } = {};
  extras.forEach(extra => {
    const date = new Date(extra.date);
    const week = getWeekNumber(date);
    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(extra);
  });

  const sortedWeeks = Object.keys(weeks).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-2">
        <List className={theme.text} />
        <h2 className="text-xl font-bold">Ficha Semanal de Plantões</h2>
      </div>

      {sortedWeeks.length === 0 ? (
        <div className="bg-stone-900/80 backdrop-blur-md p-12 rounded-2xl border border-stone-800/50 text-center text-stone-400">
          Nenhum plantão registrado para visualização semanal.
        </div>
      ) : (
        sortedWeeks.map(weekNum => {
          const weekExtras = weeks[weekNum].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const weekTotal = weekExtras.reduce((acc, curr) => acc + curr.hours, 0);
          
          return (
            <div key={weekNum} className="bg-stone-900/80 backdrop-blur-md rounded-2xl border border-stone-800/50 shadow-sm overflow-hidden">
              <div className="bg-stone-900/50 px-6 py-4 border-b border-stone-800/50 flex justify-between items-center">
                <h3 className="font-bold text-stone-300">Semana {weekNum}</h3>
                <span className={`text-sm font-semibold ${theme.text}`}>{weekTotal}h totais na semana</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {weekExtras.map(extra => (
                    <div key={extra.id} className="p-4 rounded-xl border border-stone-800/50 bg-stone-900/30">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-stone-400 uppercase">
                          {new Date(extra.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          extra.type === 'rural' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'
                        }`}>
                          {extra.type}
                        </span>
                      </div>
                      <p className="font-bold text-lg">{new Date(extra.date).toLocaleDateString('pt-BR')}</p>
                      <div className="flex items-center gap-1 text-sm text-stone-400 mt-1">
                        <Clock size={14} />
                        <span>{extra.hours} horas</span>
                      </div>
                      {extra.observations && (
                        <p className="text-xs text-stone-400 mt-2 italic line-clamp-2">
                          "{extra.observations}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const Dashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const isAdmin = user.is_admin === 1 || user.role_user === 'ADM';
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'extras' | 'weekly' | 'monthly' | 'admin'>('extras');
  const [activeValueTab, setActiveValueTab] = useState<'urban' | 'rural'>('urban');

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = [2024, 2025, 2026];

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'urban' as 'urban' | 'rural',
    hours: 12,
    observations: 'Plantão na base PVH',
    start_time: '07:00:00',
    end_time: '19:00:00',
    reason: ''
  });

  // Payment Period state
  const [paymentPeriod, setPaymentPeriod] = useState({
    startDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`,
    endDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-25`,
    paymentMonth: months[new Date().getMonth()]
  });

  const fetchExtras = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/extras/${user.id}?month=${currentMonth}&year=${currentYear}`);
      const data = await res.json();
      setExtras(data);
    } catch (err) {
      console.error('Error fetching extras:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtras();
  }, [currentMonth, currentYear]);

  const handleAddExtra = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/extras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: user.id })
      });
      if (res.ok) {
        setShowForm(false);
        fetchExtras();
        setFormData({
          date: new Date().toISOString().split('T')[0],
          type: 'urban',
          hours: 12,
          observations: 'Plantão na base PVH',
          start_time: '07:00',
          end_time: '19:00',
          reason: ''
        });
      }
    } catch (err) {
      console.error('Error adding extra:', err);
    }
  };

  const handleDeleteExtra = async (id: number) => {
    if (!confirm('Deseja excluir este registro?')) return;
    try {
      await fetch(`/api/extras/${id}`, { method: 'DELETE' });
      fetchExtras();
    } catch (err) {
      console.error('Error deleting extra:', err);
    }
  };

  const handleToggleSent = async (id: number) => {
    try {
      const res = await fetch(`/api/extras/${id}/toggle-sent`, { method: 'PATCH' });
      if (res.ok) {
        fetchExtras();
      }
    } catch (err) {
      console.error('Error toggling sent status:', err);
    }
  };

  const handleUpdateExtra = async (id: number, field: string, value: any) => {
    try {
      const res = await fetch(`/api/extras/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
      if (res.ok) {
        fetchExtras();
      }
    } catch (err) {
      console.error('Error updating extra:', err);
    }
  };

  const RATES = {
    [ProfessionalCategory.DOCTOR]: {
      urban: { 6: 630, 12: 1260, 24: 2520 },
      rural: { 6: 810, 12: 1620, 24: 3240 }
    },
    [ProfessionalCategory.NURSE]: {
      urban: { 6: 220.50, 12: 441, 24: 882 },
      rural: { 6: 270, 12: 540, 24: 1080 }
    },
    [ProfessionalCategory.TECHNICIAN]: {
      urban: { 6: 63, 12: 126, 24: 252 },
      rural: { 6: 105, 12: 210, 24: 420 }
    },
    [ProfessionalCategory.ADMIN]: {
      urban: { 6: 63, 12: 126, 24: 252 },
      rural: { 6: 105, 12: 210, 24: 420 }
    },
    [ProfessionalCategory.DRIVER]: {
      urban: { 6: 52.50, 12: 105, 24: 210 },
      rural: { 6: 90, 12: 180, 24: 360 }
    }
  };

  const calculateExtraValue = (extra: Extra) => {
    const hours = Number(extra.hours);
    const type = extra.type === 'rural' ? 'rural' : 'urban';
    
    if (user.professional_category && RATES[user.professional_category]) {
      const categoryRates = RATES[user.professional_category][type];
      if (hours === 6) return categoryRates[6];
      if (hours === 12) return categoryRates[12];
      if (hours === 24) return categoryRates[24];
    }
    
    return extra.hours * user.hourly_rate;
  };

  const filteredByPeriod = extras.filter(extra => {
    const extraDate = new Date(extra.date);
    const start = new Date(paymentPeriod.startDate);
    const end = new Date(paymentPeriod.endDate);
    // Reset hours for comparison
    extraDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return extraDate >= start && extraDate <= end;
  });

  const totalHours = filteredByPeriod.reduce((acc, curr) => acc + curr.hours, 0);
  const totalValue = filteredByPeriod.reduce((acc, curr) => acc + calculateExtraValue(curr), 0);

  const changeMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const theme = getThemeColors(user.lotacao_fisica);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="bg-stone-900/80 backdrop-blur-md border-b border-stone-800 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`${theme.primary} p-1.5 rounded-lg shadow-lg shadow-emerald-900/20`}>
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg hidden sm:inline text-stone-100">Adm SAMU PVH</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-200">{user.name}</p>
              <p className="text-xs text-emerald-400">{user.professional_category}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-900/50 p-1 rounded-2xl mb-8 w-fit border border-stone-800/50 backdrop-blur-sm shadow-xl">
          <button 
            onClick={() => setActiveTab('extras')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'extras' ? `bg-stone-800 text-emerald-400 shadow-md border border-stone-700/50` : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'weekly' ? `bg-stone-800 text-emerald-400 shadow-md border border-stone-700/50` : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
          >
            Ficha Semanal
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'monthly' ? `bg-stone-800 text-emerald-400 shadow-md border border-stone-700/50` : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
          >
            Relatórios Mensais
          </button>
          {(user.is_admin === 1 || user.role_user === 'ADM') && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'admin' ? `bg-stone-800 text-emerald-400 shadow-md border border-stone-700/50` : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'}`}
            >
              <ShieldCheck size={16} />
              Admin
            </button>
          )}
        </div>

        {activeTab === 'admin' && (user.is_admin === 1 || user.role_user === 'ADM') ? (
          <AdminPanel user={user} />
        ) : activeTab === 'weekly' ? (
          <WeeklySheet extras={extras} theme={theme} />
        ) : activeTab === 'monthly' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className={theme.text} />
              <h2 className="text-xl font-bold">Relatórios Mensais</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {months.map((month, index) => (
                <motion.button
                  key={month}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentMonth(index + 1);
                    setActiveTab('extras');
                  }}
                  className={`p-6 rounded-2xl border transition-all text-left ${
                    currentMonth === index + 1 
                      ? `${theme.primary} ${theme.border} text-white shadow-lg ${theme.shadow}` 
                      : `bg-stone-900/80 backdrop-blur-md border-stone-800/50 ${theme.borderHover} text-stone-300`
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentYear}</p>
                  <h3 className="text-xl font-bold">{month}</h3>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <FileText size={16} className={currentMonth === index + 1 ? 'text-white/70' : 'text-stone-400'} />
                    <span className={currentMonth === index + 1 ? 'text-white/90' : 'text-stone-400'}>Ver Plantões</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Payment Period Configuration and Reminders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-stone-900/80 backdrop-blur-md p-6 rounded-2xl border border-stone-800/50 shadow-sm">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-stone-300">
                  <Calendar size={20} className={theme.text} />
                  Configuração do Período de Pagamento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Início do Período</label>
                    <input 
                      type="date" 
                      className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                      value={paymentPeriod.startDate}
                      onChange={e => setPaymentPeriod({...paymentPeriod, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Fim do Período</label>
                    <input 
                      type="date" 
                      className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                      value={paymentPeriod.endDate}
                      onChange={e => setPaymentPeriod({...paymentPeriod, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Mês de Referência do Pagamento</label>
                    <select 
                      className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                      value={paymentPeriod.paymentMonth}
                      onChange={e => setPaymentPeriod({...paymentPeriod, paymentMonth: e.target.value})}
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-stone-900/50 border border-stone-800/50 rounded-lg text-sm text-stone-400 italic">
                  O valor total de <span className={`font-bold ${theme.text}`}>R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> será pago na folha de <span className="font-bold text-stone-300">{paymentPeriod.paymentMonth}</span>.
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="bg-red-900/30 p-4 rounded-2xl border border-red-900/50">
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    Lembretes Importantes
                  </h4>
                  <ul className="text-xs text-red-300 leading-relaxed space-y-3">
                    <li className="flex gap-2">
                      <span className="font-bold text-red-400">1.</span>
                      <span>O ADM desta unidade não se responsabiliza por extras não enviados por não constarem na jornada, exceder a jornada de trabalho, solicitar abono de horas, não registrar entrada e saída, conforme exigência da SEMUSA.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-400">2.</span>
                      <span>Em caso da coluna estar em vermelho, recorrer ao seu respectivo gerente e/ou supervisor para as providências cabíveis e não haver perda dessas horas trabalhadas.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-red-400">3.</span>
                      <span>Observar seus respectivos pontos e a jornada junto com seus gerentes, reforça a garantir que nenhuma hora trabalhada seja perdida por falta de envio!</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-900/30 p-4 rounded-2xl border border-amber-900/50">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-amber-500 text-sm">
                    <AlertCircle size={16} />
                    Atenção
                  </h4>
                  <p className="text-xs text-amber-400 leading-relaxed">
                    Este sistema é exclusivo para controle individual do servidor. Os dados aqui inseridos servem para conferência do contracheque e organização pessoal dos plantões realizados no SAMU Porto Velho.
                  </p>
                </div>

                <div className={`${theme.bgLight} p-4 rounded-2xl border ${theme.border}`}>
                  <h4 className={`font-bold mb-2 text-sm ${theme.text}`}>Dicas de uso</h4>
                  <p className={`text-xs ${theme.text} opacity-90 leading-relaxed`}>
                    Selecione o mês de referência e clique em Gerar PDF para baixar seu relatório de plantões confirmados, com carga horária e valores a receber.
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-stone-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-stone-800/50 flex items-center gap-4"
              >
                <div className="bg-blue-900/30 p-3 rounded-xl text-blue-400">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Servidor</p>
                  <p className="text-lg font-bold">{user.name}</p>
                  <p className="text-sm text-stone-400">Matrícula: {user.registration_number}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-stone-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-stone-800/50 flex items-center gap-4"
              >
                <div className={`${theme.bgLight} p-3 rounded-xl ${theme.textLight}`}>
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Categoria</p>
                  <p className="text-lg font-bold">{user.professional_category}</p>
                  {user.professional_category && RATES[user.professional_category] ? (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <button 
                          onClick={() => setActiveValueTab('urban')}
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${activeValueTab === 'urban' ? 'bg-blue-900/30 text-blue-400' : 'text-stone-400 hover:bg-stone-800/50'}`}
                        >
                          Urbano
                        </button>
                        <button 
                          onClick={() => setActiveValueTab('rural')}
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${activeValueTab === 'rural' ? 'bg-amber-900/30 text-amber-400' : 'text-stone-400 hover:bg-stone-800/50'}`}
                        >
                          Rural
                        </button>
                      </div>
                      {activeValueTab === 'urban' ? (
                        <p className="text-[10px] font-bold text-blue-500 uppercase">
                          06h R${RATES[user.professional_category].urban[6].toFixed(2)} | 12h R${RATES[user.professional_category].urban[12].toFixed(2)} | 24h R${RATES[user.professional_category].urban[24].toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-[10px] font-bold text-amber-500 uppercase">
                          06h R${RATES[user.professional_category].rural[6].toFixed(2)} | 12h R${RATES[user.professional_category].rural[12].toFixed(2)} | 24h R${RATES[user.professional_category].rural[24].toFixed(2)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-400">
                      Valor/Hora: R$ {user.hourly_rate.toFixed(2)}
                    </p>
                  )}
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className={`${theme.primary} p-6 rounded-2xl shadow-lg ${theme.shadow} text-white flex items-center gap-4`}
              >
                <div className="bg-stone-800/50 p-3 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Total a Receber</p>
                  <p className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-sm text-white/80">{totalHours} horas totais</p>
                </div>
              </motion.div>
            </div>

            {isAdmin && (
              <div className="bg-stone-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-stone-800/50 overflow-hidden mb-8">
                <div className="p-6 border-b border-stone-800/50">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Briefcase size={20} className={theme.text} />
                    Tabela de Valores – Extra (Visão Administrativa)
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <MapPin size={18} /> Urbano
                    </h4>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-stone-400 border-b border-stone-800/50">
                          <th className="pb-2">Nível / Escolaridade</th>
                          <th className="pb-2">6 horas</th>
                          <th className="pb-2">12 horas</th>
                          <th className="pb-2">24 horas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/50">
                        <tr>
                          <td className="py-2 text-stone-300">Superior – Médico</td>
                          <td className="py-2">R$ 630,00</td>
                          <td className="py-2">R$ 1.260,00</td>
                          <td className="py-2">R$ 2.520,00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Superior – Outros</td>
                          <td className="py-2">R$ 220,50</td>
                          <td className="py-2">R$ 441,00</td>
                          <td className="py-2">R$ 882,00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Nível Médio</td>
                          <td className="py-2">R$ 63,00</td>
                          <td className="py-2">R$ 126,00</td>
                          <td className="py-2">R$ 252,00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Nível Fundamental</td>
                          <td className="py-2">R$ 52,50</td>
                          <td className="py-2">R$ 105,00</td>
                          <td className="py-2">R$ 210,00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-500 mb-4 flex items-center gap-2">
                      <MapPin size={18} /> Rural
                    </h4>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-stone-400 border-b border-stone-800/50">
                          <th className="pb-2">Nível / Escolaridade</th>
                          <th className="pb-2">6 horas</th>
                          <th className="pb-2">12 horas</th>
                          <th className="pb-2">24 horas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/50">
                        <tr>
                          <td className="py-2 text-stone-300">Superior – Médico</td>
                          <td className="py-2">R$ 810,00</td>
                          <td className="py-2">R$ 1.620,00</td>
                          <td className="py-2">R$ 3.240,00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Superior – Outros</td>
                          <td className="py-2">R$ 270,00</td>
                          <td className="py-2">R$ 540,00</td>
                          <td className="py-2">R$ 1.080,00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Nível Médio</td>
                          <td className="py-2">R$ 105,00</td>
                          <td className="py-2">R$ 210,00</td>
                          <td className="py-2">R$ 420,00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-stone-300">Nível Fundamental</td>
                          <td className="py-2">R$ 90,00</td>
                          <td className="py-2">R$ 180,00</td>
                          <td className="py-2">R$ 360,00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md p-1 rounded-xl border border-stone-800/50 shadow-sm">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-stone-800/50 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-4 font-semibold min-w-[140px] text-center">
                  {months[currentMonth - 1]} {currentYear}
                </div>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-stone-800/50 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg border border-stone-700/50"
                  title="Gerar PDF (Imprimir)"
                >
                  <Printer size={20} />
                  Gerar PDF
                </button>
                {(user.is_admin === 1 || user.role_user === 'ADM') && (
                  <button 
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-2 ${theme.primary} ${theme.primaryHover} text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${theme.shadow}`}
                  >
                    <PlusCircle size={20} />
                    Lançar Novo Extra
                  </button>
                )}
              </div>
            </div>

            {/* Add Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div className={`bg-stone-900/80 backdrop-blur-md p-6 rounded-2xl border ${theme.border} shadow-sm`}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <PlusCircle size={20} className={theme.text} />
                      Novo Registro de Plantão
                    </h3>
                    <form onSubmit={handleAddExtra} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Data</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <input 
                            type="date" 
                            required
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Tipo</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring} appearance-none`}
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as 'urban' | 'rural' | 'other'})}
                          >
                            <option value="urban">Urbano</option>
                            <option value="rural">Rural</option>
                            <option value="other">Outros</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Horas</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring} appearance-none`}
                            value={formData.hours}
                            onChange={e => setFormData({...formData, hours: Number(e.target.value)})}
                          >
                            <option value={6}>06h</option>
                            <option value={12}>12h</option>
                            <option value={24}>24h</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Observações</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring} appearance-none`}
                            value={formData.observations}
                            onChange={e => setFormData({...formData, observations: e.target.value})}
                          >
                            <option value="Plantão na base PVH">Plantão na base PVH</option>
                            <option value="Plantão na base Jacy">Plantão na base Jacy</option>
                            <option value="Plantão Adm TARMS/Frota">Plantão Adm TARMS/Frota</option>
                            <option value="Plantão Adm Geral">Plantão Adm Geral</option>
                            <option value="EVENTOS DIVERSOS">EVENTOS DIVERSOS</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Entrada</label>
                        <input 
                          type="time" 
                          step="1"
                          required
                          className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                          value={formData.start_time}
                          onChange={e => setFormData({...formData, start_time: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Saída</label>
                        <input 
                          type="time" 
                          step="1"
                          required
                          className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                          value={formData.end_time}
                          onChange={e => setFormData({...formData, end_time: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-1">Motivo/Observação</label>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            placeholder="Ex: Substituição de colega, evento especial..."
                            className={`w-full px-4 py-2 rounded-lg border border-stone-700/50 bg-stone-900/50 text-stone-100 outline-none focus:ring-2 ${theme.ring}`}
                            value={formData.reason}
                            onChange={e => setFormData({...formData, reason: e.target.value})}
                          />
                          <div className="flex flex-wrap gap-2 mt-1">
                            {['Solicitou abono de horas', 'Não registrou entrada/saída', 'Não compareceu', 'Excedeu a jornada de trabalho', 'ATM', 'Outros'].map(reason => (
                              <button
                                key={reason}
                                type="button"
                                onClick={() => setFormData({...formData, reason})}
                                className="text-[10px] bg-stone-800/50 hover:bg-stone-700/50 text-stone-300 px-2 py-1 rounded border border-stone-700/50 transition-colors"
                              >
                                {reason}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                        <button 
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-6 py-2 text-stone-400 hover:bg-stone-800/50 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          className={`px-8 py-2 ${theme.primary} text-white rounded-lg font-semibold ${theme.primaryHover} transition-colors shadow-lg ${theme.shadow}`}
                        >
                          Salvar Registro
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Table */}
            <div className="bg-stone-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-stone-800/50 overflow-hidden">
              <div className="p-6 border-b border-stone-800/50 flex items-center justify-between">
                <h3 className="font-bold text-lg">Detalhamento de Plantões</h3>
                <span className="text-sm text-stone-400">{extras.length} registros encontrados</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-900/50 text-stone-400 text-xs uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Entrada</th>
                      <th className="px-6 py-4">Saída</th>
                      <th className="px-6 py-4">Horas</th>
                      <th className="px-6 py-4">Valor Estimado</th>
                      <th className="px-6 py-4">Base/Local</th>
                      <th className="px-6 py-4">Motivo</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-stone-400">Carregando dados...</td>
                      </tr>
                    ) : extras.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-12 text-center text-stone-400">Nenhum plantão registrado neste mês.</td>
                      </tr>
                    ) : (
                      extras.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((extra) => {
                        return (
                          <tr key={extra.id} className={`transition-colors group ${
                            !extra.is_sent ? 'bg-red-900/20 hover:bg-red-900/30 border-l-4 border-l-red-500/50' : 'hover:bg-stone-800/30'
                          }`}>
                            <td className="px-6 py-4 font-medium">
                              {new Date(extra.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => {
                                  if (!isAdmin) return;
                                  const nextType = extra.type === 'urban' ? 'rural' : extra.type === 'rural' ? 'other' : 'urban';
                                  handleUpdateExtra(extra.id, 'type', nextType);
                                }}
                                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                  extra.type === 'rural' ? `bg-amber-900/30 text-amber-400 ${isAdmin ? 'hover:bg-amber-900/50' : 'cursor-default'}` : 
                                  extra.type === 'other' ? `bg-purple-900/30 text-purple-400 ${isAdmin ? 'hover:bg-purple-900/50' : 'cursor-default'}` :
                                  `bg-blue-900/30 text-blue-400 ${isAdmin ? 'hover:bg-blue-900/50' : 'cursor-default'}`
                                }`}
                                title={isAdmin ? "Clique para alterar o tipo" : ""}
                              >
                                {extra.type === 'rural' ? 'Rural' : extra.type === 'other' ? 'Outros' : 'Urbano'}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-stone-300 font-medium">
                              {extra.start_time?.includes(':') ? extra.start_time : `${extra.start_time}:00:00`}
                            </td>
                            <td className="px-6 py-4 text-stone-300 font-medium">
                              {extra.end_time?.includes(':') ? extra.end_time : `${extra.end_time}:00:00`}
                            </td>
                            <td className="px-6 py-4 font-mono text-stone-300">
                              <button
                                onClick={() => {
                                  if (!isAdmin) return;
                                  const nextHours = extra.hours === 6 ? 12 : extra.hours === 12 ? 24 : 6;
                                  handleUpdateExtra(extra.id, 'hours', nextHours);
                                }}
                                className={`px-2 py-1 bg-stone-800/50 rounded text-xs font-bold transition-colors ${isAdmin ? 'hover:bg-stone-700/50' : 'cursor-default'}`}
                                title={isAdmin ? "Clique para alterar as horas" : ""}
                              >
                                {extra.hours}h
                              </button>
                            </td>
                            <td className={`px-6 py-4 font-semibold ${theme.text}`}>
                              R$ {calculateExtraValue(extra).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-400">
                              {extra.observations || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-400 italic">
                              {extra.reason || '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => isAdmin && handleToggleSent(extra.id)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                    extra.is_sent ? `${theme.bgLight} ${theme.text}` : `bg-stone-800/50 text-stone-400 ${isAdmin ? 'hover:text-stone-300' : 'cursor-default'}`
                                  }`}
                                  title={isAdmin ? (extra.is_sent ? 'Marcar como não enviado' : 'Marcar como enviado') : (extra.is_sent ? 'Enviado' : 'Não Enviado')}
                                >
                                  {extra.is_sent ? (
                                    <><CheckCircle2 size={12} /> Enviado</>
                                  ) : (
                                    <><Send size={12} /> Não Enviado</>
                                  )}
                                </button>
                                {isAdmin && (
                                  <button 
                                    onClick={() => handleDeleteExtra(extra.id)}
                                    className="p-2 text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Excluir"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="py-12 text-center text-stone-400 text-xs">
        <p>@2026 Adm SAMU PVH - Sistema de Gestão de Extras</p>
      </footer>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('samu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('samu_user', JSON.stringify(userData));
  };

  const handlePasswordChanged = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('samu_user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('samu_user');
  };

  if (loading) return null;

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.must_change_password === 1) {
    return <ChangePasswordPage user={user} onPasswordChanged={handlePasswordChanged} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
