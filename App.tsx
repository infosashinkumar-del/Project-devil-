import React, { useEffect, useState } from 'react';
import { supabase, ACTIVATION_COST, ADMIN_ID } from './services/supabase';
import { User, IncomeSummary } from './types';
import { Landing } from './components/Landing';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { WalletView } from './components/Wallet';
import { Team } from './components/Team';
import { Excellence } from './components/Excellence';
import { Tour } from './components/Tour';
import { Profile } from './components/Profile';
import { Admin } from './components/Admin';
import { Referral } from './components/Referral';
import { Earnings } from './components/Earnings';
import { Leaderboard } from './components/Leaderboard';
import { LayoutDashboard, Users, Wallet, Globe, Award, Settings, LogOut, Menu, X, Shield, Link as LinkIcon, TrendingUp, Trophy } from 'lucide-react';

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [view, setView] = useState<'landing'|'login'|'signup'|'dash'>('landing');
    const [subView, setSubView] = useState('overview'); 
    const [user, setUser] = useState<User | null>(null);
    const [income, setIncome] = useState<IncomeSummary | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('ref')) setView('signup');
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
                initUser(session.user.id);
            }
        });
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) initUser(session.user.id);
        });
        
        return () => subscription.unsubscribe();
    }, []);

    const initUser = async (uid: string) => {
        await fetchUserData(uid);
    };

    const fetchUserData = async (uid: string) => {
        try {
            // A. Fetch User Details
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*, levels(name,id)')
                .eq('id', uid)
                .single();
            
            if (userError || !userData) throw new Error("User data not found");
            setUser(userData);

            // B. Fetch Income
            const { data: incomeData, error: incomeError } = await supabase
                .rpc('get_dashboard_income_summary', {user_id_input: uid});
            
            if (incomeError) throw new Error("Income fetch failed");
            setIncome(incomeData);

            // C. Switch View
            setSubView('overview');
            setView('dash');

        } catch (err) {
            console.error("Fatal Error:", err);
            alert("Could not load dashboard data. Please check your connection.");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setView('landing');
        setUser(null);
        setIncome(null);
    };

    const handleActivation = async () => {
        if (!user || !income) return;
        const balance = income.all_time_income - income.all_time_paid;
        if (balance < ACTIVATION_COST) { alert(`Insufficient Balance. Need $${ACTIVATION_COST}.`); return; }
        const { error } = await supabase.rpc('activate_account_with_balance');
        if (error) alert(error.message); else { alert("Activated!"); initUser(user.id); }
    };

    if (view === 'landing') return <Landing onNavigate={setView} />;
    if (view === 'login' || view === 'signup') return <Auth mode={view} onBack={() => setView('landing')} onSuccess={(uid) => initUser(uid)} onToggleMode={() => setView(view === 'login' ? 'signup' : 'login')} />;
    if (!user || !income) return <div className="min-h-screen bg-deep-900 flex flex-col items-center justify-center text-gold-400"><div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4"></div>Loading Dashboard...</div>;

    const NavItem = ({ id, icon, label, colorClass = 'text-gray-400 hover:text-gold-100' }: any) => (
        <button onClick={() => { setSubView(id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${subView === id ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20' : `hover:bg-white/5 ${colorClass}`}`}>
            {icon}<span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-deep-900 text-white flex relative overflow-x-hidden">
            {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
            <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-deep-800 border-r border-gray-800 z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl`}>
                <div className="p-6 border-b border-gray-800 bg-black/20">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-xl tracking-wider text-white flex items-center gap-2">
                            <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center text-black">I</div>
                            <span>INFINITY</span>
                        </div>
                        <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}><X /></button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 sidebar-scroll">
                    <NavItem id="overview" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem id="leaderboard" icon={<Trophy size={20} />} label="Top 10 Leaders" />
                    <NavItem id="earnings" icon={<TrendingUp size={20} />} label="Income History" />
                    <NavItem id="referral" icon={<LinkIcon size={20} />} label="Referral Link" colorClass="text-green-400 hover:text-green-300" />
                    <NavItem id="team" icon={<Users size={20} />} label="Team Stats" />
                    <NavItem id="excellence" icon={<Award size={20} />} label="Excellence Club" colorClass="text-purple-400" />
                    <NavItem id="tour" icon={<Globe size={20} />} label="Luxury Tours" colorClass="text-blue-400" />
                    
                    <div className="px-4 mb-2 mt-6 text-[10px] text-gray-500 uppercase font-bold">Private</div>
                    <NavItem id="wallet" icon={<Wallet size={20} />} label="Wallet & Payout" />
                    <NavItem id="profile" icon={<Settings size={20} />} label="Profile" />
                    {user.referral_code === ADMIN_ID && <NavItem id="admin" icon={<Shield size={20} />} label="Admin Panel" colorClass="text-red-500" />}
                </div>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-colors text-red-400 hover:bg-red-500/10">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 w-full min-w-0 flex flex-col">
                <header className="h-20 border-b border-gray-800 bg-deep-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gold-400"><Menu /></button><h2 className="text-xl font-bold capitalize hidden sm:block">{subView === 'admin' ? 'Admin Panel' : subView}</h2></div>
                    <div className="flex items-center gap-4"><div className="text-right hidden sm:block"><p className="text-sm font-bold text-white">{user.name}</p><p className="text-xs text-gold-400">ID: {user.referral_code}</p></div><div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-black shadow-lg border border-gold-300">{user.name.charAt(0)}</div></div>
                </header>
                <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full flex-1">
                    {subView === 'overview' && <Dashboard user={user} income={income} onActivate={handleActivation} />}
                    {subView === 'leaderboard' && <Leaderboard />}
                    {subView === 'wallet' && <WalletView user={user} income={income} refreshData={() => initUser(user.id)} />}
                    {subView === 'referral' && <Referral user={user} />}
                    {subView === 'team' && <Team user={user} />}
                    {subView === 'excellence' && <Excellence user={user} />}
                    {subView === 'tour' && <Tour user={user} />}
                    {subView === 'profile' && <Profile user={user} />}
                    {subView === 'earnings' && <Earnings user={user} />}
                    {subView === 'admin' && user.referral_code === ADMIN_ID && <Admin />}
                </div>
            </main>
        </div>
    );
};

export default App;