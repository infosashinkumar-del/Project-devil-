import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { User, IncomeSummary } from '../types';
import { ArrowRightLeft, Banknote, Lock, CheckCircle, XCircle, AlertCircle, Clock, ArrowUpRight, ArrowDownLeft, RefreshCw, User as UserIcon, FileText, Layers } from 'lucide-react';

interface WalletProps {
    user: User;
    income: IncomeSummary;
    refreshData: () => void;
}

export const WalletView: React.FC<WalletProps> = ({ user, income, refreshData }) => {
    const [tab, setTab] = useState<'transfer' | 'withdraw'>('transfer');
    const [historyTab, setHistoryTab] = useState<'all' | 'transfers' | 'withdrawals'>('all');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{text: string, type: 's'|'e'} | null>(null);
    
    // History State
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    
    // Transfer Form
    const [recipientCode, setRecipientCode] = useState('');
    const [verifiedUser, setVerifiedUser] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [amount, setAmount] = useState('');
    const [tpin, setTpin] = useState('');

    // Withdraw Form
    const [wAmount, setWAmount] = useState('');
    const [wMethod, setWMethod] = useState('crypto');

    const balance = income.all_time_income - income.all_time_paid;

    useEffect(() => {
        fetchHistory();
    }, [user.id]);

    // Debounced User Verification
    useEffect(() => {
        const timer = setTimeout(async () => {
            const code = parseInt(recipientCode);
            if (!isNaN(code) && code > 0) {
                setIsSearching(true);
                setVerifiedUser(null);
                try {
                    const { data } = await supabase.rpc('get_user_by_refcode', { ref_code_input: code });
                    if (data && data[0]) {
                        setVerifiedUser(data[0].name);
                    } else {
                        setVerifiedUser(null);
                    }
                } catch (err) { console.error(err); } 
                finally { setIsSearching(false); }
            } else {
                setVerifiedUser(null);
                setIsSearching(false);
            }
        }, 600); 
        return () => clearTimeout(timer);
    }, [recipientCode]);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            // Fetch P2P History (Using RPC)
            const { data: p2pData, error: p2pError } = await supabase.rpc('get_my_wallet_history');
            if (p2pError) console.error("P2P Fetch Error", p2pError);

            // Fetch Withdrawal History (Direct Table)
            const { data: wData, error: wError } = await supabase
                .from('withdrawal_requests')
                .select('*')
                .eq('user_id', user.id)
                .order('requested_at', { ascending: false });
            if (wError) console.error("Withdrawal Fetch Error", wError);

            // Normalize Withdrawal Data to match History Format
            const withdrawals = (wData || []).map((w: any) => ({
                type: 'Payout',
                amount: w.amount,
                status: w.status,
                transaction_date: w.requested_at,
                other_party_name: w.payout_method === 'crypto' ? 'USDT Withdrawal' : 'Bank Withdrawal',
                other_party_code: w.payout_address ? `${w.payout_address.substring(0, 6)}...` : '-'
            }));

            // Combine and Sort
            const combined = [...(p2pData || []), ...withdrawals].sort((a, b) => 
                new Date(b.transaction_date || b.date).getTime() - new Date(a.transaction_date || a.date).getTime()
            );

            setHistory(combined);
            
        } catch (err) {
            console.error("History Fetch Error", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        if (!user.is_active) return setMsg({text: 'Account must be active to transfer.', type: 'e'});
        if (!tpin) return setMsg({text: 'T-PIN is required.', type: 'e'});
        
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return setMsg({text: 'Invalid Amount', type: 'e'});
        if (val > balance) return setMsg({text: 'Insufficient Balance', type: 'e'});

        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('create_p2p_transfer', {
                sender_refcode_input: user.referral_code,
                receiver_refcode_input: parseInt(recipientCode),
                transfer_amount: val,
                t_pin_input: tpin
            });

            if (error) throw error;
            if (data && typeof data === 'string' && data.startsWith('Error')) {
                throw new Error(data);
            }

            setMsg({text: `Successfully sent $${val} to ${verifiedUser}`, type: 's'});
            setAmount(''); setTpin(''); setRecipientCode(''); setVerifiedUser(null);
            refreshData();
            fetchHistory();
        } catch (err: any) {
            setMsg({text: err.message || 'Transfer Failed', type: 'e'});
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);
        
        const val = parseFloat(wAmount);
        const dest = wMethod === 'bank_upi' ? user.upi_id : user.wallet_address;

        if (!dest) return setMsg({text: 'Update Profile Payment Details First!', type: 'e'});
        if (isNaN(val) || val <= 0) return setMsg({text: 'Invalid Amount', type: 'e'});
        if (val > balance) return setMsg({text: 'Insufficient Balance', type: 'e'});

        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('create_withdrawal_request', {
                amount_input: val,
                payout_method_input: wMethod,
                payout_address_input: dest
            });

            if (error) throw error;
            if (data && typeof data === 'string' && data.startsWith('Error')) {
                throw new Error(data);
            }

            setMsg({text: 'Withdrawal Request Sent Successfully!', type: 's'});
            setWAmount('');
            refreshData();
            fetchHistory();
        } catch (err: any) {
            setMsg({text: err.message || 'Request Failed', type: 'e'});
        } finally {
            setLoading(false);
        }
    };

    // Filter History
    const filteredHistory = history.filter(item => {
        if (historyTab === 'transfers') return item.type === 'Sent' || item.type === 'Received';
        if (historyTab === 'withdrawals') return item.type === 'Payout';
        return true;
    });

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10">
            {/* Balance Card */}
            <div className="glass-panel rounded-2xl overflow-hidden mb-8 relative group border border-gold-400/30">
                <div className="absolute top-0 right-0 p-20 bg-gold-400/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                <div className="p-8 bg-gradient-to-r from-gold-600 to-gold-400 text-black text-center relative z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-2">Available Balance</p>
                    <h1 className="text-5xl font-extrabold tracking-tight">${balance.toFixed(2)}</h1>
                </div>
            </div>

            {/* Main Interface */}
            <div className="glass-panel rounded-2xl overflow-hidden border-t border-white/5 mb-10">
                <div className="flex border-b border-gray-800">
                    <button onClick={() => {setTab('transfer'); setMsg(null);}} className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${tab === 'transfer' ? 'text-black bg-gold-400' : 'text-gray-500 hover:bg-white/5'}`}>
                        <ArrowRightLeft size={18} /> Transfer
                    </button>
                    <button onClick={() => {setTab('withdraw'); setMsg(null);}} className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-all ${tab === 'withdraw' ? 'text-black bg-gold-400' : 'text-gray-500 hover:bg-white/5'}`}>
                        <Banknote size={18} /> Withdraw
                    </button>
                </div>

                <div className="p-8">
                    {msg && (
                        <div className={`p-4 mb-6 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 ${msg.type === 's' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                            {msg.type === 'e' && <AlertCircle size={16} />} {msg.text}
                        </div>
                    )}

                    {tab === 'transfer' ? (
                        <form onSubmit={handleTransfer} className="space-y-5">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Recipient ID</label>
                                <input type="number" value={recipientCode} onChange={e => setRecipientCode(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none" placeholder="Enter Ref Code" required />
                                {isSearching ? <div className="mt-2 text-xs text-gold-400 animate-pulse">Checking...</div> : verifiedUser && <div className="mt-2 text-xs text-green-400 flex gap-1 items-center"><CheckCircle size={12}/> Verified: <b>{verifiedUser}</b></div>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Amount ($)</label>
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none" placeholder="0.00" required />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">T-PIN</label>
                                    <input type="password" value={tpin} onChange={e => setTpin(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none" placeholder="****" required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading || !verifiedUser} className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg hover:shadow-gold-400/30">
                                {loading ? 'Processing...' : 'SEND NOW'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleWithdraw} className="space-y-5">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Amount ($)</label>
                                <input type="number" value={wAmount} onChange={e => setWAmount(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none" placeholder="0.00" required />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Method</label>
                                <select value={wMethod} onChange={e => setWMethod(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none">
                                    <option value="crypto">USDT (TRC20)</option>
                                    <option value="bank_upi">Bank UPI</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg hover:shadow-gold-400/30">
                                {loading ? 'Submitting...' : 'REQUEST PAYOUT'}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Transaction History */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <div className="p-5 border-b border-gray-800 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-white flex items-center gap-2"><Clock size={18} className="text-gold-400"/> History</h3>
                    <div className="flex bg-black/40 rounded-lg p-1">
                        {['all', 'transfers', 'withdrawals'].map((hTab: any) => (
                            <button 
                                key={hTab} 
                                onClick={() => setHistoryTab(hTab)}
                                className={`px-3 py-1 rounded text-xs font-bold capitalize ${historyTab === hTab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {hTab}
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchHistory} className="text-gray-500 hover:text-white"><RefreshCw size={16} className={loadingHistory?'animate-spin':''} /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4">Type</th>
                                <th className="p-4">Details</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loadingHistory ? (
                                <tr><td colSpan={3} className="p-6 text-center text-gray-500">Loading History...</td></tr>
                            ) : filteredHistory.length === 0 ? (
                                <tr><td colSpan={3} className="p-6 text-center text-gray-500">No records found.</td></tr>
                            ) : (
                                filteredHistory.map((tx, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-full bg-opacity-10 ${tx.type === 'Sent' ? 'bg-red-500 text-red-400' : tx.type === 'Received' ? 'bg-green-500 text-green-400' : tx.type === 'Payout' ? 'bg-yellow-500 text-yellow-400' : 'bg-blue-500 text-blue-400'}`}>
                                                    {tx.type === 'Sent' ? <ArrowUpRight size={16} /> : tx.type === 'Received' ? <ArrowDownLeft size={16} /> : tx.type === 'Payout' ? <Banknote size={16} /> : <FileText size={16} />}
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold uppercase text-white">{tx.type}</span>
                                                    <span className={`text-[10px] uppercase font-bold ${tx.status==='Success' || tx.status==='approved' ? 'text-green-500' : tx.status==='pending' ? 'text-yellow-500' : 'text-red-500'}`}>{tx.status || 'Completed'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm text-white font-bold">{tx.other_party_name || tx.other_party || 'System'}</div>
                                            <div className="text-xs text-gray-500">ID: {tx.other_party_code || tx.other_code || '-'}</div>
                                            <div className="text-[10px] text-gray-600">{new Date(tx.transaction_date || tx.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className={`p-4 text-right font-bold text-lg ${tx.type === 'Sent' || tx.type === 'Payout' ? 'text-red-400' : 'text-green-400'}`}>
                                            {tx.type === 'Sent' || tx.type === 'Payout' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
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