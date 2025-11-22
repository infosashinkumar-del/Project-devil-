import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { User as UserIcon, CreditCard, Smartphone, Save, Key, Edit2 } from 'lucide-react';

interface ProfileProps { user: User; }

export const Profile: React.FC<ProfileProps> = ({ user }) => {
    const [formData, setFormData] = useState({ 
        name: user.name, 
        mobile: user.mobile, 
        upi: user.upi_id || '', 
        wallet: user.wallet_address || '', 
        tpin: user.t_pin || '' 
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{text:string, type:'s'|'e'} | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setMsg(null);
        
        if (formData.tpin && formData.tpin.length !== 4) {
            setLoading(false);
            return setMsg({text: 'T-PIN must be 4 digits', type: 'e'});
        }

        const { error } = await supabase.from('users').update({ 
            name: formData.name,
            mobile: formData.mobile,
            upi_id: formData.upi, 
            wallet_address: formData.wallet, 
            t_pin: formData.tpin 
        }).eq('id', user.id);
        
        setLoading(false);
        if (error) setMsg({text: error.message, type: 'e'}); 
        else setMsg({text: 'Profile Updated Successfully!', type: 's'});
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10">
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="bg-white/5 p-6 border-b border-gray-800 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-black font-bold text-2xl">{user.name.charAt(0)}</div>
                    <div><h2 className="text-xl font-bold text-white">{user.name}</h2><p className="text-gold-400 text-sm">ID: {user.referral_code}</p></div>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 text-gold-400" size={16} />
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 text-white focus:border-gold-400 outline-none" 
                                />
                                <Edit2 className="absolute right-3 top-3 text-gray-600" size={14} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Email (Read Only)</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input type="text" value={user.email} disabled className="w-full bg-black/20 border border-gray-800 rounded-xl py-3 pl-10 text-gray-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Mobile</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-3 text-gold-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={formData.mobile} 
                                        onChange={e => setFormData({...formData, mobile: e.target.value})}
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 text-white focus:border-gold-400 outline-none" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Security T-PIN</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-3 text-gold-400" size={16} />
                                    <input 
                                        type="password" 
                                        placeholder="4-digit PIN" 
                                        maxLength={4} 
                                        value={formData.tpin} 
                                        onChange={e => setFormData({...formData, tpin: e.target.value})} 
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 text-white focus:border-gold-400 outline-none" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCard size={20} className="text-blue-400" /> Payment Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">USDT Address (TRC20)</label>
                                    <input 
                                        type="text" 
                                        value={formData.wallet} 
                                        onChange={e => setFormData({...formData, wallet: e.target.value})} 
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none font-mono text-sm" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Bank UPI ID</label>
                                    <input 
                                        type="text" 
                                        value={formData.upi} 
                                        onChange={e => setFormData({...formData, upi: e.target.value})} 
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-400 outline-none" 
                                    />
                                </div>
                            </div>
                        </div>

                        {msg && <div className={`p-4 rounded-xl text-center font-medium ${msg.type === 's' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{msg.text}</div>}
                        
                        <button disabled={loading} className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};