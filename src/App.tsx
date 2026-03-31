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
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const LoginPage = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [registration, setRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: registration, password })
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-200"
      >
        <div className="text-center mb-8">
          <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
            <TrendingUp className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Adm SAMU PVH</h1>
          <p className="text-stone-500">Gestão de Plantões Extras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Matrícula</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="Digite sua matrícula"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
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
        
        <div className="mt-8 text-center text-xs text-stone-400">
          <p>Demo: Matrículas 123456, 654321, 111222</p>
          <p>Senha: senha123</p>
        </div>
      </motion.div>
    </div>
  );
};

const ChangePasswordPage = ({ user, onPasswordChanged }: { user: User, onPasswordChanged: (updatedUser: User) => void }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, newPassword })
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-stone-200"
      >
        <div className="text-center mb-8">
          <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Alteração Obrigatória</h1>
          <p className="text-stone-500">Por segurança, altere sua senha no primeiro acesso.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
          >
            {loading ? 'Alterando...' : 'Atualizar Senha'}
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
    registration_number: '',
    professional_category: ProfessionalCategory.NURSE,
    hourly_rate: 0,
    is_admin: false
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
          registration_number: '',
          professional_category: ProfessionalCategory.NURSE,
          hourly_rate: 0,
          is_admin: false
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
          <ShieldCheck className="text-emerald-600" />
          Painel Administrativo
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
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
            className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm"
          >
            <h3 className="font-bold mb-4">Cadastrar Novo Servidor</h3>
            <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Matrícula</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newUser.registration_number}
                  onChange={e => setNewUser({...newUser, registration_number: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Categoria</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newUser.professional_category}
                  onChange={e => setNewUser({...newUser, professional_category: e.target.value as ProfessionalCategory})}
                >
                  {Object.values(ProfessionalCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Valor/Hora (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newUser.hourly_rate}
                  onChange={e => setNewUser({...newUser, hourly_rate: Number(e.target.value)})}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox" 
                  id="isAdmin"
                  className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                  checked={newUser.is_admin}
                  onChange={e => setNewUser({...newUser, is_admin: e.target.checked})}
                />
                <label htmlFor="isAdmin" className="text-sm font-medium text-stone-700">Acesso de Administrador</label>
              </div>
              <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Cadastrar
                </button>
              </div>
            </form>
            {message.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h3 className="font-bold flex items-center gap-2">
            <Users size={20} className="text-stone-400" />
            Lista de Funcionários
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Matrícula</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Valor/Hora</th>
                <th className="px-6 py-4">Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-400">Carregando...</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-stone-500">{u.registration_number}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-[10px] font-bold uppercase">
                        {u.professional_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-stone-600">R$ {u.hourly_rate.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {u.is_admin ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase">
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

const WeeklySheet = ({ extras }: { extras: Extra[] }) => {
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
        <List className="text-emerald-600" />
        <h2 className="text-xl font-bold">Ficha Semanal de Plantões</h2>
      </div>

      {sortedWeeks.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-stone-400">
          Nenhum plantão registrado para visualização semanal.
        </div>
      ) : (
        sortedWeeks.map(weekNum => {
          const weekExtras = weeks[weekNum].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const weekTotal = weekExtras.reduce((acc, curr) => acc + curr.hours, 0);
          
          return (
            <div key={weekNum} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                <h3 className="font-bold text-stone-700">Semana {weekNum}</h3>
                <span className="text-sm font-semibold text-emerald-600">{weekTotal}h totais na semana</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {weekExtras.map(extra => (
                    <div key={extra.id} className="p-4 rounded-xl border border-stone-100 bg-stone-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-stone-400 uppercase">
                          {new Date(extra.date).toLocaleDateString('pt-BR', { weekday: 'long' })}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          extra.type === 'rural' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {extra.type}
                        </span>
                      </div>
                      <p className="font-bold text-lg">{new Date(extra.date).toLocaleDateString('pt-BR')}</p>
                      <div className="flex items-center gap-1 text-sm text-stone-600 mt-1">
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
  const [extras, setExtras] = useState<Extra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'extras' | 'weekly' | 'monthly' | 'admin'>('extras');

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

  const calculateExtraValue = (extra: Extra) => {
    if (user.professional_category === ProfessionalCategory.NURSE) {
      const hours = Number(extra.hours);
      if (extra.type === 'rural') {
        if (hours === 6) return 550;
        if (hours === 12) return 990;
        if (hours === 24) return 2000;
      } else {
        if (hours === 6) return 440;
        if (hours === 12) return 880;
        if (hours === 24) return 1880;
      }
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

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="bg-white border-bottom border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">Adm SAMU PVH</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-stone-500">{user.professional_category}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-2xl mb-8 w-fit">
          <button 
            onClick={() => setActiveTab('extras')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'extras' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Plantões
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'weekly' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Ficha Semanal
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'monthly' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Relatórios Mensais
          </button>
          {user.is_admin === 1 && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              <ShieldCheck size={16} />
              Admin
            </button>
          )}
        </div>

        {activeTab === 'admin' && user.is_admin === 1 ? (
          <AdminPanel user={user} />
        ) : activeTab === 'weekly' ? (
          <WeeklySheet extras={extras} />
        ) : activeTab === 'monthly' ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-emerald-600" />
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
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                      : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-700'
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentYear}</p>
                  <h3 className="text-xl font-bold">{month}</h3>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <FileText size={16} className={currentMonth === index + 1 ? 'text-white/70' : 'text-stone-400'} />
                    <span className={currentMonth === index + 1 ? 'text-white/90' : 'text-stone-500'}>Ver Plantões</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Payment Period Configuration */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-8">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-stone-700">
                <Calendar size={20} className="text-emerald-600" />
                Configuração do Período de Pagamento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Início do Período</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentPeriod.startDate}
                    onChange={e => setPaymentPeriod({...paymentPeriod, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Fim do Período</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentPeriod.endDate}
                    onChange={e => setPaymentPeriod({...paymentPeriod, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Mês de Referência do Pagamento</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={paymentPeriod.paymentMonth}
                    onChange={e => setPaymentPeriod({...paymentPeriod, paymentMonth: e.target.value})}
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4 p-3 bg-stone-50 rounded-lg text-sm text-stone-500 italic">
                O valor total de <span className="font-bold text-emerald-600">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> será pago na folha de <span className="font-bold text-stone-700">{paymentPeriod.paymentMonth}</span>.
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4"
              >
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Servidor</p>
                  <p className="text-lg font-bold">{user.name}</p>
                  <p className="text-sm text-stone-400">Matrícula: {user.registration_number}</p>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-4"
              >
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                  <Briefcase size={24} />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Categoria</p>
                  <p className="text-lg font-bold">{user.professional_category}</p>
                  {user.professional_category === ProfessionalCategory.NURSE ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-bold text-blue-600 uppercase">Urbano: 06h R$440 | 12h R$880 | 24h R$1880</p>
                      <p className="text-[10px] font-bold text-amber-600 uppercase">Rural: 06h R$550 | 12h R$990 | 24h R$2000</p>
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
                className="bg-emerald-600 p-6 rounded-2xl shadow-lg shadow-emerald-100 text-white flex items-center gap-4"
              >
                <div className="bg-white/20 p-3 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/70 uppercase tracking-wider font-semibold">Total a Receber</p>
                  <p className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-sm text-white/80">{totalHours} horas totais</p>
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200 shadow-sm">
                <button 
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="px-4 font-semibold min-w-[140px] text-center">
                  {months[currentMonth - 1]} {currentYear}
                </div>
                <button 
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-100"
              >
                <PlusCircle size={20} />
                Lançar Novo Extra
              </button>
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
                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <PlusCircle size={20} className="text-emerald-600" />
                      Novo Registro de Plantão
                    </h3>
                    <form onSubmit={handleAddExtra} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Data</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <input 
                            type="date" 
                            required
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Tipo</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <select 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as 'urban' | 'rural'})}
                          >
                            <option value="urban">Urbano</option>
                            <option value="rural">Rural</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Horas</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <select 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
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
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Observações</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                          <select 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                            value={formData.observations}
                            onChange={e => setFormData({...formData, observations: e.target.value})}
                          >
                            <option value="Plantão na base PVH">Plantão na base PVH</option>
                            <option value="Plantão na base Jacy">Plantão na base Jacy</option>
                            <option value="Plantão Adm TARMS/Frota">Plantão Adm TARMS/Frota</option>
                            <option value="Plantão Adm Geral">Plantão Adm Geral</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Entrada</label>
                        <input 
                          type="time" 
                          step="1"
                          required
                          className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                          value={formData.start_time}
                          onChange={e => setFormData({...formData, start_time: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Saída</label>
                        <input 
                          type="time" 
                          step="1"
                          required
                          className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                          value={formData.end_time}
                          onChange={e => setFormData({...formData, end_time: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Motivo/Observação</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Substituição de colega, evento especial..."
                          className="w-full px-4 py-2 rounded-lg border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500"
                          value={formData.reason}
                          onChange={e => setFormData({...formData, reason: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                        <button 
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="px-6 py-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
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
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">Detalhamento de Plantões</h3>
                <span className="text-sm text-stone-500">{extras.length} registros encontrados</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
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
                            !extra.is_sent ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500' : 'hover:bg-stone-50'
                          }`}>
                            <td className="px-6 py-4 font-medium">
                              {new Date(extra.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                extra.type === 'rural' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {extra.type === 'rural' ? 'Rural' : 'Urbano'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-stone-600 font-medium">
                              {extra.start_time?.includes(':') ? extra.start_time : `${extra.start_time}:00:00`}
                            </td>
                            <td className="px-6 py-4 text-stone-600 font-medium">
                              {extra.end_time?.includes(':') ? extra.end_time : `${extra.end_time}:00:00`}
                            </td>
                            <td className="px-6 py-4 font-mono text-stone-600">{extra.hours}h</td>
                            <td className="px-6 py-4 font-semibold text-emerald-600">
                              R$ {calculateExtraValue(extra).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-500">
                              {extra.observations || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-stone-500 italic">
                              {extra.reason || '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleToggleSent(extra.id)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                                    extra.is_sent ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400 hover:text-stone-600'
                                  }`}
                                  title={extra.is_sent ? 'Marcar como não enviado' : 'Marcar como enviado'}
                                >
                                  {extra.is_sent ? (
                                    <><CheckCircle2 size={12} /> Enviado</>
                                  ) : (
                                    <><Send size={12} /> Não Enviado</>
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleDeleteExtra(extra.id)}
                                  className="p-2 text-stone-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Excluir"
                                >
                                  <Trash2 size={18} />
                                </button>
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

            {/* Reminders Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-amber-600">
                  <AlertCircle size={20} />
                  Lembretes Importantes
                </h4>
                <ul className="space-y-3 text-sm text-stone-600">
                  <li className="flex gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Em caso da coluna estar em vermelho, recorrer ao seu respectivo gerente e/ou supervisor para as providências cabíveis e não haver perda dessas horas trabalhadas!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-bold mb-2 text-emerald-800">Dica de Uso</h4>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  Este sistema é exclusivo para controle individual do servidor. Os dados aqui inseridos servem para conferência do contracheque e organização pessoal dos plantões realizados no SAMU Porto Velho.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="py-12 text-center text-stone-400 text-xs">
        <p>© 2024 Adm SAMU PVH - Sistema de Gestão de Extras</p>
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
