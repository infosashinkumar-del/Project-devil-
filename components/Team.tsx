import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { Users, Trophy, Search, ShieldAlert, UserCheck, UserPlus, Globe, Smartphone } from 'lucide-react';

interface TeamProps {
    user: User;
    isPreview?: boolean;
}

export const Team: React.FC<TeamProps> = ({ user, isPreview }) => {
    const [directs, setDirects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [nextLevel, setNextLevel] = useState<any>(null);

    useEffect(() => {
        const fetchTeamData = async () => {
            setLoading(true);
            const { data: directsData } = await supabase.from('users').select('name, mobile, is_active, joining_date, levels(name, id)').eq('sponsor_id', user.id).order('joining_date', { ascending: false });
            setDirects(directsData || []);
            const currentLevelId = user.current_level_id || 0;
            const { data: nextLvl } = await supabase.from('levels').select('*').eq('id', currentLevelId + 1).single();
            setNextLevel(nextLvl);
            setLoading(false);
        };
        fetchTeamData();
    }, [user.id]);

    const filteredDirects = directs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || (d.mobile && d.mobile.includes(search)));
    const activeDirects = directs.filter(d => d.is_active).length;

    const StatCard = ({ icon, label, value, color, bg }: any) => (
        <div className={`glass-panel p-6 rounded-2xl border-t border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-transform`}>
             <div className={`absolute top-0 right-0 p-16 ${bg} rounded-full blur-2xl opacity-10 -mr-6 -mt-6`}></div>
             <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-3xl font-extrabold text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${bg} bg-opacity-20 ${color}`}>{icon}</div>
             </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Directs" value={user.direct_referrals_count} icon={<UserPlus size={24} />} color="text-blue-400" bg="bg-blue-500" />
                <StatCard label="Active Directs" value={activeDirects} icon={<UserCheck size={24} />} color="text-green-400" bg="bg-green-500" />
                <StatCard label="Total Team" value={user.team_size} icon={<Globe size={24} />} color="text-purple-400" bg="bg-purple-500" />
            </div>

            {/* Rank Section */}
            <div className="glass-panel p-0 rounded-2xl overflow-hidden border-t border-white/5">
                <div className="bg-gradient-to-r from-gold-600 to-gold-400 p-6 text-black flex justify-between items-center">
                    <div>
                        <p className="font-bold opacity-70 uppercase tracking-widest text-xs mb-1">Current Rank</p>
                        <h2 className="text-4xl font-extrabold">{user.levels?.name || 'Starter'}</h2>
                    </div>
                    <Trophy size={48} className="opacity-80" />
                </div>
                <div className="p-8">
                    {nextLevel ? (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white">Next Target: <span className="text-gold-400">{nextLevel.name}</span></h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Directs</span><span className="font-bold text-gold-400">{user.direct_referrals_count} / {nextLevel.direct_req}</span></div>
                                    <div className="h-3 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${Math.min(100, (user.direct_referrals_count/nextLevel.direct_req)*100)}%`}}></div></div>
                                </div>
                                <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                    <div className="flex justify-between text-sm mb-2"><span className="text-gray-300">Team</span><span className="font-bold text-gold-400">{user.team_size} / {nextLevel.team_size_req}</span></div>
                                    <div className="h-3 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{width: `${Math.min(100, (user.team_size/nextLevel.team_size_req)*100)}%`}}></div></div>
                                </div>
                            </div>
                        </div>
                    ) : <div className="text-center font-bold text-gold-400 text-xl">Max Rank Achieved! 👑</div>}
                </div>
            </div>

            {/* Table */}
            {isPreview ? (
                <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center">
                    <ShieldAlert size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Privacy Protected</h3>
                    <p className="text-gray-500 max-w-md">Partner details are hidden in Preview Mode. Please login to view your team hierarchy.</p>
                </div>
            ) : (
                <div className="glass-panel rounded-2xl overflow-hidden border-t border-white/5">
                    <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users size={20} className="text-gold-400" /> Direct Partners</h3>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 bg-black/40 border border-gray-700 rounded-xl py-2 pl-10 text-sm focus:border-gold-400 outline-none text-white"/>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="p-4">Partner</th>
                                    <th className="p-4">Mobile</th>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr> : filteredDirects.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-gray-500">No partners found.</td></tr> : filteredDirects.map((d, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4"><div className="font-bold text-white">{d.name}</div><div className="text-xs text-gray-500">{new Date(d.joining_date).toLocaleDateString()}</div></td>
                                        <td className="p-4 text-gray-300 text-sm flex items-center gap-2"><Smartphone size={14}/> {d.mobile || 'N/A'}</td>
                                        <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${d.levels?.id > 1 ? 'bg-gold-400/20 text-gold-400' : 'bg-gray-800 text-gray-400'}`}>{d.levels?.name || 'Starter'}</span></td>
                                        <td className="p-4 text-center">{d.is_active ? <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded">Active</span> : <span className="text-red-400 text-xs font-bold bg-red-400/10 px-2 py-1 rounded">Free</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};