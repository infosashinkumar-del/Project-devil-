import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';
import { Plane, Clock, MapPin, Calendar, UserCheck } from 'lucide-react';

interface TourProps { user: User; }

export const Tour: React.FC<TourProps> = ({ user }) => {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<{[key:string]: any}>({});

    useEffect(() => {
        const fetchTours = async () => {
            const { data: rules } = await supabase.from('distribution_rules').select('*').or('fund_type.eq.domestic_tour_fund,fund_type.eq.international_tour_fund');
            if (rules) {
                const toursWithProgress = await Promise.all(rules.map(async (r: any) => {
                    let prog = 0;
                    if (r.status === 'active') {
                        const { data: count } = await supabase.rpc('get_earning_referral_count', { user_id_input: user.id, start_date_input: r.tour_start_date, end_date_input: r.tour_date });
                        prog = count || 0;
                    }
                    return { ...r, progress: prog };
                }));
                setTours(toursWithProgress);
            }
            setLoading(false);
        };
        fetchTours();
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                const next: any = {};
                tours.forEach(t => {
                    if(t.status === 'active') {
                        const diff = new Date(t.tour_date).getTime() - new Date().getTime();
                        if (diff > 0) next[t.id] = { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
                    }
                });
                return next;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [user.id, tours.length]);

    if (loading) return <div className="p-10 text-center text-gold-400 animate-pulse">Loading Tours...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Luxury Tour Qualifiers</h2>
                <p className="text-gray-400">Unlock exclusive travel rewards by growing your team.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
                {tours.map(tour => {
                    const isIntl = tour.fund_type === 'international_tour_fund';
                    const t = timeLeft[tour.id] || {d:0,h:0,m:0,s:0};
                    const pct = Math.min(100, (tour.progress / tour.target_earning_referrals) * 100);
                    const isActive = tour.status === 'active';
                    
                    // Simulated images based on type
                    const bgImage = isIntl 
                        ? 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop' 
                        : 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop';

                    return (
                        <div key={tour.id} className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl hover:border-gold-400/30 transition-all group">
                            {/* Header Image Area */}
                            <div className="h-48 relative">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage: `url(${bgImage})`}}></div>
                                <div className={`absolute inset-0 ${isIntl ? 'bg-blue-900/60' : 'bg-green-900/60'}`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                
                                <div className="absolute bottom-4 left-6 z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin size={16} className={isIntl ? 'text-blue-400' : 'text-green-400'} />
                                        <span className="text-xs uppercase font-bold tracking-widest text-white shadow-black drop-shadow-md">
                                            {isIntl ? 'Global Destination' : 'National Paradise'}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-extrabold text-white">{isIntl ? 'International Tour' : 'Domestic Tour'}</h3>
                                </div>

                                {isActive && (
                                    <div className="absolute top-4 right-4 bg-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
                                        <Clock size={12}/> LIVE NOW
                                    </div>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="p-8">
                                {isActive ? (
                                    <>
                                        {/* Countdown */}
                                        <div className="flex justify-center gap-4 mb-8">
                                            {[
                                                {v: t.d, l: 'Days'}, {v: t.h, l: 'Hours'}, 
                                                {v: t.m, l: 'Mins'}, {v: t.s, l: 'Secs'}
                                            ].map((item, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className="bg-white/5 border border-white/10 w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white mb-1 shadow-inner">
                                                        {String(item.v).padStart(2,'0')}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{item.l}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400 flex items-center gap-2"><UserCheck size={14}/> Qualified Directs</span>
                                                <span className={`font-bold ${isIntl ? 'text-blue-400' : 'text-green-400'}`}>{tour.progress} / {tour.target_earning_referrals}</span>
                                            </div>
                                            <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-inner relative">
                                                <div className={`h-full transition-all duration-1000 ${isIntl ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`} style={{width: `${pct}%`}}></div>
                                            </div>
                                            <p className="text-xs text-gray-500 text-center mt-2">
                                                Refer {tour.target_earning_referrals} active members before {new Date(tour.tour_date).toLocaleDateString()} to win!
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 opacity-50">
                                        <Calendar size={48} className="mx-auto mb-4 text-gray-600" />
                                        <h4 className="text-xl font-bold text-gray-400">Coming Soon</h4>
                                        <p className="text-sm text-gray-600">Stay tuned for the next adventure.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};