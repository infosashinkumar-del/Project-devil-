import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Shield, Search, DollarSign, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const Admin: React.FC = () => {
    const [refCode, setRefCode] = useState('');
    const [user, setUser] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{text:string, type:'s'|'e'} | null>(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            const code = parseInt(refCode);
            if (!isNaN(code) && code > 0) {
                setIsSearching(true);
                setUser(null);
                try {
                    const { data } = await supabase.rpc('get_user_by_refcode', { ref_code_input: code });
                    if (data && data[0]) setUser(data[0]); else setUser(null);
                } catch (err) { console.error(err); } 
                finally { setIsSearching(false); }
            } else { setUser(null); setIsSearching(false); }
        }, 600);
        return () => clearTimeout(timer);
    }, [refCode]);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) return setMsg({text: 'Invalid Amount', type: 'e'});
        if (!user) return setMsg({text: 'Select User First', type: 'e'});

        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('admin_deposit_funds', {
                partner_id_input: user.id,
                amount_input: depositAmount,
                note_input: note
            });

            if (error) throw error;
            if (data && typeof data === 'string' && data.startsWith('Error')) {
                throw new Error(data);
            }

            setMsg({text: `Successfully deposited $${depositAmount} to ${user.name}`, type: 's'});
            setAmount(''); setNote(''); setRefCode(''); setUser(null);
        } catch (error: any) {
            setMsg({text: error.message || 'Deposit Failed', type: 'e'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6 text-red-400">
                    <Shield size={24} />
                    <h2 className="text-xl font-bold">Admin Control Panel</h2>
                </div>

                <form onSubmit={handleDeposit} className="space-y-5">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">User ID</label>
                        <input type="number" value={refCode} onChange={e => setRefCode(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-red-400 outline-none" placeholder="Search User ID" required />
                        {isSearching ? <div className="mt-2 text-xs text-red-400 animate-pulse">Searching...</div> : user && <div className="mt-2 text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12}/> Found: <b>{user.name}</b></div>}
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">Amount ($)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-red-400 outline-none" placeholder="0.00" required />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">Note</label>
                        <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-red-400 outline-none" placeholder="Reason" />
                    </div>

                    {msg && <div className={`p-3 rounded-xl text-center text-sm font-bold ${msg.type === 's' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{msg.text}</div>}

                    <button disabled={loading || !user} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">
                        {loading ? 'Processing...' : 'DEPOSIT FUNDS'}
                    </button>
                </form>
            </div>
        </div>
    );
};