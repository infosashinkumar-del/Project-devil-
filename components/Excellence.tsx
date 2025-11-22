import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { Award, CheckCircle, Lock, Star, Sparkles, Target, ArrowUpCircle } from 'lucide-react';

interface ExcellenceProps {
    user: User;
}

export const Excellence: React.FC<ExcellenceProps> = ({ user }) => {
    const [progress, setProgress] = useState<any>(null);
    const [rules, setRules] = useState<any[]>([]);
    const [achievedIds, setAchievedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [user.id]);

    const fetchData = async () => {
        setLoading(true);
        const [progRes, rulesRes, statusRes] = await Promise.all([
            supabase.rpc('get_excellence_progress', {view_user_id: user.id}),
            supabase.from('excellence_rules').select('*').order('id'),
            supabase.from('user_excellence_status').select('level_id').eq('user_id', user.id)
        ]);

        if(progRes.data) setProgress(progRes.data);
        if(rulesRes.data) setRules(rulesRes.data);
        if(statusRes.data) setAchievedIds(statusRes.data.map((s: any) => s.level_id));
        
        setLoading(false);
    };

    const getProgressWidth = (current: number, target: number) => Math.min(100, (current / target) * 100);

    if (loading) return <div className="p-10 text-center text-gold-400 animate-pulse">Loading Excellence Data...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
            
            {/* HEADER SECTION */}
            <div className="text-center mb-12 relative">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-gold-400 to-purple-400 mb-3">Excellence Club</h1>
                <p className="text-gray-400 max-w-lg mx-auto">Unlock exclusive cash rewards by achieving leadership milestones. The higher you climb, the bigger the prize.</p>
            </div>

            {/* NEXT REWARD CARD */}
            {progress && progress.status !== 'completed' ? (
                <div className="mb-16 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-gold-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                    <div className="relative glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 p-24 bg-gold-500/10 rounded-full blur-3xl translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="text-center md:text-left flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">
                                    <Target size={12} /> Next Milestone
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">{progress.next_rank_name}</h2>
                                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                                    ${progress.reward_amount}
                                </div>
                                <p className="text-sm text-gray-400 mt-2 uppercase tracking-wider font-bold">Instant Cash Reward</p>
                            </div>

                            <div className="w-full md:w-1/2 space-y-6 bg-black/30 p-6 rounded-2xl border border-white/5">
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                        <span className="text-gray-400">Direct Partners</span>
                                        <span className="text-gold-400">{progress.direct_current} / {progress.direct_target}</span>
                                    </div>
                                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{width: `${getProgressWidth(progress.direct_current, progress.direct_target)}%`}}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                        <span className="text-gray-400">Team (40/60 Rule)</span>
                                        <span className="text-blue-400">{progress.team_current} / {progress.team_target}</span>
                                    </div>
                                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: `${getProgressWidth(progress.team_current, progress.team_target)}%`}}></div>
                                    </div>
                                </div>
                                
                                <div className="pt-2 flex justify-between text-[10px] text-gray-500 font-mono">
                                    <span>Strong: {progress.raw_strongest_leg}</span>
                                    <span>Others: {progress.raw_other_legs}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 mb-16 bg-gradient-to-r from-green-900/30 to-green-600/10 rounded-3xl border border-green-500/30">
                    <Sparkles className="mx-auto text-green-400 mb-4" size={48} />
                    <h2 className="text-3xl font-bold text-white">All Milestones Achieved!</h2>
                    <p className="text-gray-400">You have unlocked every reward.</p>
                </div>
            )}

            {/* TIMELINE ROADMAP */}
            <div className="relative pl-4 md:pl-0">
                {/* Connecting Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-gold-500 to-gray-800 md:-translate-x-1/2"></div>

                <div className="space-y-12">
                    {rules.map((rule, index) => {
                        const isDone = achievedIds.includes(rule.id);
                        const isNext = !isDone && (index === 0 || achievedIds.includes(rules[index - 1].id));
                        const isLocked = !isDone && !isNext;
                        
                        return (
                            <div key={rule.id} className={`relative flex md:justify-center items-center group ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}`}>
                                
                                {/* Left Content (Desktop) */}
                                <div className="hidden md:block w-1/2 pr-12 text-right">
                                    <h3 className={`text-xl font-bold ${isDone ? 'text-green-400' : isNext ? 'text-gold-400' : 'text-gray-400'}`}>{rule.level_name}</h3>
                                    <p className="text-sm text-gray-500">{rule.direct_req} Directs + {rule.team_req} Team</p>
                                </div>

                                {/* Center Node */}
                                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10">
                                    <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 ${
                                        isDone ? 'bg-green-500 border-green-900 scale-110' : 
                                        isNext ? 'bg-gold-500 border-gold-900 animate-pulse scale-125 shadow-[0_0_30px_rgba(212,175,55,0.6)]' : 
                                        'bg-gray-900 border-gray-700'
                                    }`}>
                                        {isDone ? <CheckCircle size={16} className="text-black" /> : isNext ? <ArrowUpCircle size={20} className="text-black" /> : <Lock size={14} className="text-gray-500" />}
                                    </div>
                                </div>

                                {/* Right Content (Desktop) / Only Content (Mobile) */}
                                <div className="w-full md:w-1/2 pl-12">
                                    {/* Mobile Title Show */}
                                    <div className="md:hidden mb-1">
                                        <h3 className={`text-lg font-bold ${isDone ? 'text-green-400' : isNext ? 'text-gold-400' : 'text-gray-400'}`}>{rule.level_name}</h3>
                                        <p className="text-xs text-gray-500 mb-2">{rule.direct_req} Directs + {rule.team_req} Team</p>
                                    </div>

                                    <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                                        isDone ? 'bg-green-500/10 border-green-500/30' : 
                                        isNext ? 'bg-gold-500/10 border-gold-500/50 shadow-lg shadow-gold-500/10' : 
                                        'bg-white/5 border-white/10'
                                    }`}>
                                        <div className={`p-2 rounded-lg ${isDone ? 'bg-green-500 text-black' : isNext ? 'bg-gold-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase font-bold opacity-60">Bonus Reward</div>
                                            <div className={`text-xl font-extrabold ${isDone ? 'text-green-400' : isNext ? 'text-gold-400' : 'text-gray-300'}`}>${rule.reward_amount}</div>
                                        </div>
                                        {isDone && <div className="ml-2 px-2 py-0.5 rounded bg-green-500 text-black text-[10px] font-bold">PAID</div>}
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};