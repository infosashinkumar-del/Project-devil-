import React from 'react';
import { User } from '../types';
import { Copy, Share2, CheckCheck, QrCode } from 'lucide-react';

interface ReferralProps { user: User; }

export const Referral: React.FC<ReferralProps> = ({ user }) => {
    const [copied, setCopied] = React.useState(false);
    const referralLink = `${window.location.origin}/?ref=${user.referral_code}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLink = async () => {
        const title = 'Join Infinity Success 🚀';
        const text = `🔥 *Infinity Success - The Future of Networking* 🔥\n\n✅ Instant Payouts\n✅ 100% Distribution\n✅ Luxury Rewards\n\n👇 *Join My Team Now:*\n${referralLink}\n\nSponsor Code: *${user.referral_code}*`;
        if (navigator.share) {
            try { await navigator.share({ title, text, url: referralLink }); } catch (err) {}
        } else copyToClipboard();
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Grow Your Team</h2>
                <p className="text-gray-400">Share your link. New partners will be automatically locked to you.</p>
            </div>
            <div className="glass-panel rounded-3xl overflow-hidden border border-gold-400/20 relative">
                <div className="h-32 bg-gradient-to-r from-gold-600 to-gold-400 flex items-center justify-center"><div className="bg-black/80 backdrop-blur-sm px-6 py-2 rounded-full border border-gold-400/50 shadow-xl"><span className="text-gold-400 font-bold tracking-widest uppercase text-sm">Code: {user.referral_code}</span></div></div>
                <div className="p-8 -mt-16 relative z-10">
                    <div className="flex justify-center mb-8"><div className="bg-white p-3 rounded-xl shadow-xl"><QrCode size={80} className="text-black" /></div></div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 bg-black/40 border border-gray-700 p-3 rounded-xl">
                            <input type="text" readOnly value={referralLink} className="bg-transparent text-gray-300 text-sm w-full outline-none font-mono" />
                            <button onClick={copyToClipboard} className={`p-2 rounded-lg ${copied ? 'bg-green-500' : 'bg-gold-400 text-black'}`}>{copied ? <CheckCheck size={18}/> : <Copy size={18}/>}</button>
                        </div>
                        <button onClick={shareLink} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"><Share2 size={20}/> Share Link</button>
                    </div>
                </div>
            </div>
        </div>
    );
};