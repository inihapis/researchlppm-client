import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
    Newspaper,
    ArrowRight,
    Clock,
    Link as LinkIcon,
    Calendar,
    Zap,
    Globe
} from 'lucide-react';

const News = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/news');
                setNews(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#22106f]">UNAMA Research News</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic decoration-[#e6780f] underline decoration-2 underline-offset-4">Activity Updates & KM/PKM Bulletin (Feature 6)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {news.map((item) => (
                    <article key={item.id} className="card p-0 overflow-hidden group border-none shadow-xl transition-all duration-500">
                        <div className="flex flex-col sm:flex-row h-full">
                            <div className="sm:w-1/3 bg-[#22106f] p-8 flex flex-col items-center justify-center text-white relative overflow-hidden group-hover:bg-[#1a0b5a] transition-all duration-500">
                                <Zap className="text-white mb-4 relative z-10 opacity-20 group-hover:opacity-100 transition-opacity" size={48} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 relative z-10">{item.date.split('-')[0]}</p>
                                <p className="text-xl font-black relative z-10 leading-none mt-1">{item.date.split('-')[1]}-{item.date.split('-')[2]}</p>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            </div>
                            <div className="sm:w-2/3 p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest border border-indigo-100 ring-4 ring-white shadow-sm">Hot News</span>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                            <Clock size={10} />
                                            Updated Log
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#22106f] transition-colors mb-4 leading-tight">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 line-clamp-3">{item.content}</p>
                                </div>
                                <button className="flex items-center gap-2 text-[#e6780f] text-xs font-black uppercase tracking-widest group/btn hover:gap-3 transition-all">
                                    Read Article On Link
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="mt-16 card bg-[#22106f] border-none shadow-2xl p-12 overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="md:w-1/2">
                        <h4 className="text-3xl font-black mb-4 leading-tight tracking-tighter italic">Connect to <span className="text-orange-400 uppercase">External Bulletin</span></h4>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-sm">Access consolidated research news from DIKTI, SINTA, and partners through our integrated news hub.</p>
                    </div>
                    <div className="md:w-1/2 flex flex-wrap gap-4 justify-center md:justify-end">
                        <a href="https://sinta.kemdikbud.go.id" target="_blank" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center gap-3 transition-all group">
                            <Globe size={18} className="text-orange-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">SINTA Portal</span>
                        </a>
                        <a href="https://simlitabmas.kemdikbud.go.id" target="_blank" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl flex items-center gap-3 transition-all group">
                            <LinkIcon size={18} className="text-indigo-400" />
                            <span className="text-xs font-bold uppercase tracking-widest">Simlitabmas</span>
                        </a>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-[100px]"></div>
            </div>
        </div>
    );
};

export default News;
