import React, { useEffect, useState } from 'react';
import { User, IncomeSummary } from '../types';
import { CountUp } from './CountUp';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, Award, Activity, Crown, ShieldCheck, Send, Users, Zap, Layers, Star, DollarSign, Calendar } from 'lucide-react';

interface DashboardProps {
    user: User;
    income: IncomeSummary;
    onActivate: () => void;
    isPreview?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, income, onActivate, isPreview }) => {
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const data = [];
        const base = income.all_time_income / 30; 
        let current = 0;
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dailyVal = base + (Math.random() * base * 0.8 - base * 0.3);
            current += Math.max(0, dailyVal);
            data.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                amount: parseFloat(current.toFixed(2))
            });
        }
        setChartData(data);
    }, [income]);

    const balance = income.all_time_income - income.all_time_paid;

    const StatCard = ({ title, amount, icon, colorClass, subText }: any) => (
        <div className="glass-panel p-6 rounded-2xl border-t border-white/5 hover:border-gold-400/30 transition-all duration-300 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-16 opacity-5 transform translate-x-4 -translate-y-4 rounded-full ${colorClass.replace('bg-', 'bg-')}`}></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-1">
                        $<CountUp end={amount} />
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                    {React.cloneElement(icon, { className: `${colorClass.replace('bg-', 'text-')}` })}
                </div>
            </div>
            {subText && <p className="text-xs text-gray-500 relative z-10">{subText}</p>}
        </div>
    );

    const SmallCard = ({ title, amount, icon, color }: any) => (
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div>
                <p className="text-gray-400 text-xs uppercase font-bold mb-1">{title}</p>
                <h4 className={`text-lg font-bold ${color}`}>$<CountUp end={amount || 0} /></h4>
            </div>
            <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Telegram Button - Hide in Preview */}
            {!isPreview && (
                <a href="https://t.me/infinitysuccesss" target="_blank" rel="noopener noreferrer" className="block w-full">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 p-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 transform hover:-translate-y-1 transition-all group">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Send size={20} className="text-white group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-white font-bold tracking-wide uppercase">Join Official Telegram Channel</span>
                    </div>
                </a>
            )}

            {/* Status Banner */}
            {!user.is_active ? (
                <div className="bg-gradient-to-r from-red-900/80 to-red-600/20 border border-red-500/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/20 rounded-full text-red-400 animate-pulse">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Account Inactive</h3>
                            <p className="text-red-200 text-sm">Activate your ID to enable withdrawals, transfers, and team earning.</p>
                        </div>
                    </div>
                    {!isPreview && (
                        <button onClick={onActivate} className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/40 transform hover:-translate-y-1">
                            ACTIVATE NOW ($150)
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-gradient-to-r from-green-900/40 to-green-600/10 border border-green-500/30 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                     <ShieldCheck className="text-green-400" />
                     <span className="text-green-100 font-medium tracking-wide">Status: <span className="text-green-400 font-bold">ACTIVE & QUALIFIED</span></span>
                </div>
            )}

            {/* Main Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Earnings" amount={income.all_time_income} icon={<Award />} colorClass="bg-gold-400" />
                <StatCard title="Wallet Balance" amount={balance} icon={<Wallet />} colorClass="bg-green-500" />
                <StatCard title="Total Paid" amount={income.all_time_paid} icon={<DollarSign />} colorClass="bg-red-500" />
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Income" amount={income.today_income || 0} icon={<Activity />} colorClass="bg-blue-500" />
                <StatCard title="Last 7 Days" amount={income.last_7_day_income || 0} icon={<Calendar />} colorClass="bg-teal-500" />
                <StatCard title="Last 30 Days" amount={income.last_30_day_income || 0} icon={<Calendar />} colorClass="bg-indigo-500" />
                <StatCard title="Top Ten Fund" amount={income.top_ten_income || 0} icon={<Crown />} colorClass="bg-purple-500" />
            </div>

            {/* Income Sources */}
            <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Layers size={18} className="text-gold-400"/> Income Sources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SmallCard title="Direct Income" amount={income.direct_income} icon={<Users size={18}/>} color="text-blue-400" />
                    <SmallCard title="Team Income" amount={income.team_income} icon={<Users size={18}/>} color="text-purple-400" />
                    <SmallCard title="Passive Income" amount={income.passive_income} icon={<Zap size={18}/>} color="text-yellow-400" />
                    <SmallCard title="Excellence Bonus" amount={income.excellence_income} icon={<Star size={18}/>} color="text-pink-400" />
                </div>
            </div>

            {/* Charts */}
            <div className="glass-panel p-6 rounded-2xl border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-gold-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Income Growth</h3>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">Last 7 Days</div>
                </div>
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} dy={10}/>
                            <YAxis stroke="#666" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} dx={-10}/>
                            <Tooltip contentStyle={{backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: '#333', borderRadius: '12px', color: '#fff'}} itemStyle={{color: '#D4AF37'}} formatter={(value: number) => [`$${value}`, 'Income']}/>
                            <Area type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};