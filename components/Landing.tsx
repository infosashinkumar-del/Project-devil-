import React from 'react';
import { ShieldCheck, TrendingUp, Users, Wallet, Target, ArrowRight, PieChart, Globe, CheckCircle, Youtube, Instagram, MessageCircle } from 'lucide-react';
import { Leaderboard } from './Leaderboard';

interface LandingProps {
    onNavigate: (view: 'login' | 'signup') => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-deep-900 text-white overflow-hidden relative font-sans selection:bg-gold-400 selection:text-black">
            {/* Background FX */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold-400/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]"></div>
            </div>

            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                        <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-gold-400/20 group-hover:rotate-12 transition-transform">I</div>
                        <div>
                            <span className="block text-xl font-bold tracking-wider text-white leading-none group-hover:text-gold-400 transition-colors">INFINITY</span>
                            <span className="block text-xs text-gold-400 font-medium tracking-[0.3em] leading-none">SUCCESS</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => onNavigate('login')} className="hidden sm:block px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all">Login</button>
                        <button onClick={() => onNavigate('signup')} className="px-6 py-2.5 rounded-full bg-gold-400 hover:bg-gold-500 text-black font-bold text-sm shadow-lg shadow-gold-400/20 transition-all hover:scale-105 transform">Join Now</button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative z-10 container mx-auto px-6 pt-40 pb-32 flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 text-center lg:text-left mb-16 lg:mb-0 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 animate-fade-in backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-gold-100 text-xs font-bold tracking-widest uppercase">Decentralized & Automated</span>
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight">
                        Build Wealth <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300">Without Limits</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg lg:text-xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Experience the power of 100% distribution. A next-gen platform offering instant payouts, real-time analytics, and a global community of leaders.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                        <button onClick={() => onNavigate('login')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-black font-bold text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-2 group">
                            Login Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                </div>

                {/* Graphic */}
                <div className="lg:w-1/2 relative flex justify-center perspective-1000">
                    <div className="w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
                    
                    <div className="relative z-10 glass-panel p-8 rounded-3xl border border-gold-400/20 shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 w-full max-w-md bg-gradient-to-b from-gray-900/90 to-black/90">
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-black text-xl">I</div>
                                 <div>
                                     <div className="text-white font-bold">Infinity Success</div>
                                     <div className="text-xs text-gold-400 font-mono">System Online</div>
                                 </div>
                             </div>
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase">Total Payout</p>
                                    <p className="text-xl font-bold text-gold-400">$84,250.00</p>
                                </div>
                                <TrendingUp className="text-gold-400" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400"><span>Network Growth</span><span>+12.5%</span></div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[75%]"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-center">
                                    <CheckCircle className="text-green-400 mx-auto mb-2" size={20}/>
                                    <p className="text-xs font-bold text-white">Instant</p>
                                </div>
                                <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
                                    <ShieldCheck className="text-blue-400 mx-auto mb-2" size={20}/>
                                    <p className="text-xs font-bold text-white">Secure</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LEADERBOARD SECTION */}
            <div className="relative z-20 py-20 bg-black/30 border-y border-white/5 backdrop-blur-sm">
                <div className="container mx-auto px-6">
                    <Leaderboard />
                </div>
            </div>

            {/* 100% Distribution */}
            <div className="bg-gold-500 py-24 text-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                         <div className="inline-block px-4 py-1 bg-black/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Transparency First</div>
                         <h2 className="text-5xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">100% <br/>Distribution</h2>
                         <p className="text-xl font-medium opacity-80 leading-relaxed mb-8 max-w-lg">
                            Unlike traditional systems, Infinity Success distributes 100% of the revenue back to the community through direct referrals, level income, and rewards. No hidden fees.
                         </p>
                         <div className="flex gap-4">
                            <div className="flex items-center gap-2 font-bold"><CheckCircle size={20}/> Direct Payouts</div>
                            <div className="flex items-center gap-2 font-bold"><CheckCircle size={20}/> Instant Withdrawals</div>
                         </div>
                    </div>
                    <div className="lg:w-1/2 flex justify-center">
                         <div className="w-96 h-96 bg-black rounded-full flex items-center justify-center text-gold-400 border-[15px] border-white/20 shadow-2xl relative">
                            <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-full animate-spin-slow"></div>
                            <div className="text-center">
                                <PieChart size={80} className="mx-auto mb-4" />
                                <span className="text-7xl font-extrabold tracking-tighter">100%</span>
                                <span className="block text-sm uppercase tracking-[0.3em] mt-2 text-gray-500">P2P System</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="py-32 bg-black/40 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-12 rounded-[2rem] bg-gradient-to-b from-gray-800/50 to-black border border-white/10 relative overflow-hidden group hover:border-gold-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-400/10">
                            <div className="absolute top-0 right-0 p-32 bg-gold-400/5 rounded-full blur-3xl transition-all group-hover:bg-gold-400/10"></div>
                            <Target className="text-gold-400 mb-8" size={48} />
                            <h3 className="text-3xl font-bold text-white mb-6">Our Vision</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                To create a global community of 1 million financially independent families by 2026. We envision a world where wealth is accessible to everyone through the power of community and decentralized finance.
                            </p>
                        </div>

                        <div className="p-12 rounded-[2rem] bg-gradient-to-b from-gray-800/50 to-black border border-white/10 relative overflow-hidden group hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-400/10">
                            <div className="absolute top-0 right-0 p-32 bg-blue-400/5 rounded-full blur-3xl transition-all group-hover:bg-blue-400/10"></div>
                            <ShieldCheck className="text-blue-400 mb-8" size={48} />
                            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                To provide a secure, transparent, and automated platform where effort is instantly rewarded. We are committed to delivering high-quality digital products and a seamless payout experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-white/5 bg-black py-12 text-center relative z-10">
                <div className="flex justify-center gap-8 mb-8">
                    <a href="https://www.youtube.com/@infinitysuccesss" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 hover:bg-red-600 hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                        <Youtube size={24} />
                    </a>
                    <a href="https://www.instagram.com/officialinfinitysuccesss?igsh=MWpnMWw3NDBkbHg1" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(219,39,119,0.5)]">
                        <Instagram size={24} />
                    </a>
                    <a href="https://whatsapp.com/channel/0029VbBimAyAe5VoX8bPOK0e" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 hover:bg-green-500 hover:text-white text-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                        <MessageCircle size={24} />
                    </a>
                </div>
                <div className="flex justify-center gap-6 mb-6 text-xs text-gray-600 font-medium tracking-widest uppercase">
                    <span className="hover:text-gold-400 cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-gold-400 cursor-pointer transition-colors">Terms of Service</span>
                    <span className="hover:text-gold-400 cursor-pointer transition-colors">Support</span>
                </div>
                <p className="text-gray-600 text-sm">© 2025 Infinity Success. All Rights Reserved.</p>
            </footer>
        </div>
    );
};