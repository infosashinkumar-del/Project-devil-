import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { LeaderboardUser } from '../types';
import { Trophy, Crown, Medal, Users } from 'lucide-react';
import { CountUp } from './CountUp';

export const Leaderboard: React.FC = () => {
    const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            const { data } = await supabase.rpc('get_real_leaderboard');
            if (data) setLeaders(data.slice(0, 10));
            setLoading(false);
        };
        fetchLeaders();
    }, []);

    const RankIcon = ({ index }: { index: number }) => {
        if (index === 0) return <Crown className="text-gold-400 w-8 h-8 fill-gold-400 animate-pulse" />;
        if (index === 1) return <Medal className="text-gray-300 w-8 h-8 fill-gray-300" />;
        if (index === 2) return <Medal className="text-orange-400 w-8 h-8 fill-orange-400" />;
        return <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400">{index + 1}</div>;
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-10">
            <div className="text-center mb-10">
                <div className="inline-block p-4 bg-gold-400/10 rounded-full mb-4 border border-gold-400/30"><Trophy size={48} className="text-gold-400" /></div>
                <h2 className="text-3xl font-bold text-white mb-2">Top 10 Leaders</h2>
                <p className="text-gray-400">Top achievers of the month based on real income.</p>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden border border-gold-400/20 shadow-2xl">
                <div className="grid grid-cols-12 gap-4 p-5 bg-gradient-to-r from-gold-600/20 to-transparent border-b border-gold-400/10 text-xs font-bold uppercase tracking-wider text-gold-400">
                    <div className="col-span-2 text-center">Rank</div>
                    <div className="col-span-5">Partner</div>
                    <div className="col-span-3 text-right">Income</div>
                    <div className="col-span-2 text-right">Team</div>
                </div>
                <div className="divide-y divide-white/5">
                    {loading ? <div className="p-10 text-center text-gray-500 animate-pulse">Loading...</div> : leaders.map((l, i) => (
                        <div key={i} className={`grid grid-cols-12 gap-4 p-5 items-center hover:bg-white/5 transition-colors ${i === 0 ? 'bg-gold-400/5' : ''}`}>
                            <div className="col-span-2 flex justify-center"><RankIcon index={i} /></div>
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white border border-white/10">{l.name.charAt(0)}</div>
                                <span className={`font-bold text-sm ${i === 0 ? 'text-gold-400 text-lg' : 'text-white'}`}>{l.name}</span>
                            </div>
                            <div className="col-span-3 text-right font-bold flex items-center justify-end gap-1 text-green-400">$<CountUp end={l.real_income} /></div>
                            <div className="col-span-2 text-right text-gray-400 text-sm flex items-center justify-end gap-1"><Users size={14} /> {l.team_size}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};