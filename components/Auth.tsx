import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ArrowLeft, Mail, Lock, User as UserIcon, Phone, Globe, CreditCard, Users, CheckCircle, XCircle, Check, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
    mode: 'login' | 'signup';
    onBack: () => void;
    onSuccess: (userId: string) => void;
    onToggleMode: () => void;
}

export const Auth: React.FC<AuthProps> = ({ mode, onBack, onSuccess, onToggleMode }) => {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    
    // Form States
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPass: '',
        name: '', mobile: '', country: '', wallet: '', sponsor: ''
    });

    // UI States
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Validation States
    const [sponsorName, setSponsorName] = useState<{name: string, valid: boolean} | null>(null);
    const [refLocked, setRefLocked] = useState(false); 
    
    const [pwdRules, setPwdRules] = useState({
        len: false, upper: false, lower: false, num: false, special: false
    });

    // Check for URL Referral Code on Mount
    useEffect(() => {
        if (mode === 'signup') {
            const params = new URLSearchParams(window.location.search);
            const refCode = params.get('ref');
            if (refCode) {
                setFormData(prev => ({ ...prev, sponsor: refCode }));
                setRefLocked(true); 
            }
        }
    }, [mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));

        // Live Password Validation
        if (id === 'password') {
            setPwdRules({
                len: value.length >= 9,
                upper: /[A-Z]/.test(value),
                lower: /[a-z]/.test(value),
                num: /[0-9]/.test(value),
                special: /[!@#$%^&*]/.test(value)
            });
        }
    };

    // Live Sponsor Lookup
    useEffect(() => {
        const checkSponsor = async () => {
            const code = parseInt(formData.sponsor);
            
            if (!isNaN(code)) {
                try {
                    const { data, error } = await supabase.rpc('get_user_by_refcode', { 
                        ref_code_input: code 
                    });
                    
                    if (error) {
                        console.error("Sponsor Lookup Error:", error);
                        setSponsorName({ name: 'Error Checking ID', valid: false });
                        return;
                    }

                    if (data && data[0]) {
                        setSponsorName({ name: data[0].name, valid: true });
                    } else {
                        setSponsorName({ name: 'Invalid Sponsor Code', valid: false });
                    }
                } catch (err) {
                    console.error(err);
                    setSponsorName({ name: 'Network Error', valid: false });
                }
            } else {
                setSponsorName(null);
            }
        };

        const timeout = setTimeout(checkSponsor, 500);
        return () => clearTimeout(timeout);
    }, [formData.sponsor]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setMsg(null);
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
        });
        setLoading(false);
        if (error) {
            setMsg({ text: "Invalid Credentials", type: 'error' });
        } else if (data.session) {
            onSuccess(data.session.user.id);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPass) {
            setMsg({text: "Passwords do not match", type: 'error'});
            return;
        }
        
        if (!Object.values(pwdRules).every(Boolean)) {
             setMsg({text: "Please meet all password requirements", type: 'error'});
             return;
        }

        if (!sponsorName?.valid) {
            setMsg({text: "Please enter a valid Sponsor Code", type: 'error'});
            return;
        }

        setLoading(true); setMsg(null);
        
        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: formData.name,
                    mobile: formData.mobile,
                    country: formData.country,
                    wallet_address: formData.wallet,
                    sponsor_code: formData.sponsor
                }
            }
        });

        setLoading(false);
        if (error) {
            setMsg({text: error.message, type: 'error'});
        } else {
            setMsg({text: "Account created! Please Login.", type: 'success'});
            setTimeout(onToggleMode, 2000);
        }
    };

    const PwdItem = ({ valid, text }: { valid: boolean, text: string }) => (
        <div className={`flex items-center gap-2 text-xs ${valid ? 'text-green-400' : 'text-gray-500'}`}>
            {valid ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-600"></div>}
            {text}
        </div>
    );

    return (
        <div className="min-h-screen bg-deep-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                 {[...Array(15)].map((_, i) => (
                     <div key={i} className="absolute w-1 h-1 bg-gold-400 rounded-full opacity-30 animate-pulse" 
                          style={{
                              top: `${Math.random()*100}%`, 
                              left: `${Math.random()*100}%`,
                              animationDuration: `${Math.random()*5 + 2}s`
                          }} 
                     />
                 ))}
            </div>

            <div className="w-full max-w-md z-10 my-10">
                <button onClick={onBack} className="flex items-center text-gray-400 hover:text-gold-400 mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </button>

                <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-gold-600/20">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Partner Registration'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {mode === 'login' ? 'Access your partner dashboard' : 'Join the revolution'}
                        </p>
                    </div>

                    <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                        {mode === 'signup' && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 ml-1 uppercase">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-3 text-gray-500" size={16} />
                                        <input id="name" type="text" placeholder="Your Name" required onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 text-sm focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none text-white" />
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 ml-1 uppercase">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                                        <input id="email" type="email" placeholder="you@example.com" required onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 text-sm focus:border-gold-400 outline-none text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 ml-1 uppercase">Mobile</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-gray-500" size={16} />
                                            <input id="mobile" type="tel" placeholder="+1..." required onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 text-sm focus:border-gold-400 outline-none text-white" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400 ml-1 uppercase">Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 text-gray-500" size={16} />
                                            <input id="country" type="text" placeholder="USA" required onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 text-sm focus:border-gold-400 outline-none text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 ml-1 uppercase">USDT (TRC20) Address</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 text-gray-500" size={16} />
                                        <input id="wallet" type="text" placeholder="T..." required onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 text-sm focus:border-gold-400 outline-none text-white" />
                                    </div>
                                </div>
                            </>
                        )}

                        {mode === 'login' && (
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 ml-1 uppercase">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                                    <input id="email" type="email" placeholder="you@example.com" required onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 text-sm focus:border-gold-400 outline-none text-white" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs text-gray-400 ml-1 uppercase">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
                                <input 
                                    id="password" 
                                    type={showPass ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    required 
                                    onChange={handleChange} 
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:border-gold-400 outline-none text-white" 
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-500 hover:text-gold-400 transition-colors">
                                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <>
                                <div className="bg-black/30 p-3 rounded-lg grid grid-cols-2 gap-2 mb-2">
                                    <PwdItem valid={pwdRules.len} text="Min 9 Chars" />
                                    <PwdItem valid={pwdRules.upper} text="Uppercase" />
                                    <PwdItem valid={pwdRules.lower} text="Lowercase" />
                                    <PwdItem valid={pwdRules.num} text="Number" />
                                    <div className="col-span-2"><PwdItem valid={pwdRules.special} text="Special Char (!@#...)" /></div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 ml-1 uppercase">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
                                        <input 
                                            id="confirmPass" 
                                            type={showConfirmPass ? "text" : "password"} 
                                            placeholder="••••••••" 
                                            required 
                                            onChange={handleChange} 
                                            className="w-full bg-black/40 border border-gray-700 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:border-gold-400 outline-none text-white" 
                                        />
                                        <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-3 text-gray-500 hover:text-gold-400 transition-colors">
                                            {showConfirmPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-gold-400 ml-1 uppercase font-bold">Sponsor Code</label>
                                    <div className="relative">
                                        <Users className={`absolute left-3 top-3 ${refLocked ? 'text-gold-400' : 'text-gray-500'}`} size={16} />
                                        <input 
                                            id="sponsor" 
                                            type="number" 
                                            placeholder="Referral ID" 
                                            value={formData.sponsor}
                                            required 
                                            disabled={refLocked}
                                            onChange={handleChange} 
                                            className={`w-full bg-black/40 border rounded-xl py-2.5 pl-10 text-sm outline-none text-white ${refLocked ? 'border-gold-400/50 cursor-not-allowed opacity-80' : 'border-gray-700 focus:border-gold-400'}`} 
                                        />
                                        {refLocked && <Lock size={14} className="absolute right-4 top-3.5 text-gold-400" />}
                                    </div>
                                    {sponsorName && (
                                        <div className={`flex items-center gap-2 text-xs mt-1 font-bold ${sponsorName.valid ? 'text-green-400' : 'text-red-400'}`}>
                                            {sponsorName.valid ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                            {sponsorName.name}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {msg && (
                            <div className={`p-3 rounded-lg text-center text-sm font-medium ${msg.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {msg.text}
                            </div>
                        )}

                        <button 
                            disabled={loading || (mode === 'signup' && (!sponsorName?.valid || !Object.values(pwdRules).every(Boolean)))}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-black font-bold text-lg shadow-lg hover:shadow-gold-400/30 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Processing...' : mode === 'login' ? 'Login Dashboard' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            {mode === 'login' ? "Don't have an account? " : "Already have an ID? "}
                            <button onClick={onToggleMode} className="text-gold-400 hover:underline font-medium">
                                {mode === 'login' ? 'Register Now' : 'Login Here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};