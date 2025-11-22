import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { TrendingUp, Calendar } from 'lucide-react';

interface EarningsProps { user: User; }

export const Earnings: React.FC<EarningsProps> = ({ user }) => {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            const { data } = await supabase.from('earnings').select('*, s:users!earnings_source_user_id_fkey(name, referral_code)').eq('receiver_id', user.id).order('created_at', { ascending: false }).limit(100);
            if (data) setEarnings(data);
            setLoading(false);
        };
        fetchEarnings();
    }, [user.id]);

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-10">
             <div className="flex items-center justify-between mb-6">
                <div><h2 className="text-2xl font-bold text-white">Income History</h2><p className="text-gray-400 text-sm">Detailed records of your rewards</p></div>
                <div className="p-3 bg-gold-400/10 rounded-xl text-gold-400 border border-gold-400/20"><TrendingUp size={24} /></div>
             </div>
             <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4">Date</th><th className="p-4">Type</th><th className="p-4">Source</th><th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? <tr><td colSpan={4} className="p-10 text-center text-gray-500 animate-pulse">Loading...</td></tr> : earnings.length === 0 ? <tr><td colSpan={4} className="p-10 text-center text-gray-500">No records found.</td></tr> : earnings.map((r, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-400 text-sm flex items-center gap-2"><Calendar size={14}/>{new Date(r.created_at).toLocaleString()}</td>
                                    <td className="p-4"><span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400">{r.type.replace(/_/g, ' ')}</span></td>
                                    <td className="p-4 text-sm text-gray-300">{r.s ? <div><span className="font-bold text-white">{r.s.name}</span> <span className="text-xs text-gray-500">({r.s.referral_code})</span></div> : 'System'}</td>
                                    <td className="p-4 text-right font-bold text-green-400 text-lg">+${r.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};