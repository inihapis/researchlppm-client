import React, { useState, useEffect } from 'react';
import {
    Clock,
    CheckCircle,
    XCircle,
    Briefcase,
    Activity,
    ArrowUpRight,
    TrendingUp,
    Globe,
    Lock,
    Award
} from 'lucide-react';
import { api } from '../lib/api';
import { useRole } from '../context/RoleContext';

const StatCard = ({ title, val, icon, color, trend }) => (
    <div className="card group hover:-translate-y-1">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-4xl font-black text-[#22106f]">{val}</h3>
                {trend && (
                    <div className="mt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <TrendingUp size={12} />
                        <span>+{trend}% this year</span>
                    </div>
                )}
            </div>
            <div className={`${color} p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110 duration-300`}>
                {React.cloneElement(icon, { size: 28, className: 'text-white' })}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const { role } = useRole();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/api/submissions");
                setSubmissions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const stats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status === 'Pending').length,
        approved: submissions.filter(s => s.status === 'Approved').length,
        rejected: submissions.filter(s => s.status === 'Rejected').length,
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#22106f] flex items-center gap-3">
                        <Award className="text-[#e6780f]" size={36} />
                        {role === 'Admin' ? 'LPPM Control Center' : 'Dosen Portal'}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Research Management & Progress Tracking Statistics</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
                        <div className="w-2 h-2 rounded-full bg-[#22106f] animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Active Grant Cycle: 2026/2027</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title={role === 'Admin' ? "Global Submissions" : "My Submissions"}
                    val={role === 'Admin' ? stats.total : (stats.total > 0 ? 3 : 0)}
                    icon={<Briefcase />}
                    color="bg-[#22106f]"
                    trend="15"
                />
                <StatCard
                    title="In Progress"
                    val={role === 'Admin' ? stats.pending : 1}
                    icon={<Clock />}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Approved"
                    val={role === 'Admin' ? stats.approved : 2}
                    icon={<CheckCircle />}
                    color="bg-emerald-500"
                    trend="5"
                />
                <StatCard
                    title="Rejected"
                    val={role === 'Admin' ? stats.rejected : 0}
                    icon={<XCircle />}
                    color="bg-rose-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 card overflow-hidden p-0 border-none shadow-xl ring-1 ring-slate-100">
                    <div className="p-6 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                        <h4 className="font-black text-[#22106f] tracking-tight uppercase text-sm">Recent Research Tracking</h4>
                        <a href="/submissions" className="text-[#e6780f] text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4">
                            Detailed List <ArrowUpRight size={14} />
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white">
                                <tr className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">
                                    <th className="px-6 py-5">Activity / Title</th>
                                    <th className="px-6 py-5">Type / Area</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-6 py-5">Last Update</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {submissions.slice(0, 5).map((sub) => (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-[#22106f] transition-colors truncate max-w-xs">{sub.title}</p>
                                            <p className="text-[9px] text-[#e6780f] font-black uppercase mt-1 tracking-tighter">{sub.category} • ID: {sub.id.slice(0, 8)}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[9px] font-black px-2 py-1 rounded-md border flex items-center w-fit gap-1 shadow-sm uppercase ${sub.type === 'Internal' ? 'bg-indigo-50 text-[#22106f] border-indigo-100' : 'bg-orange-50 text-[#e6780f] border-orange-100'
                                                }`}>
                                                {sub.type === 'Internal' ? <Lock size={10} /> : <Globe size={10} />}
                                                {sub.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border shadow-sm ${sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                sub.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-slate-500 font-bold">
                                            {new Date(sub.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {submissions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center">
                                            <Activity className="mx-auto text-slate-200 mb-4" size={48} />
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Awaiting local activity data...</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="card border-none bg-[#22106f] shadow-2xl overflow-hidden relative group">
                        <div className="relative z-10">
                            <h4 className="font-black text-[#22106f] mb-4 flex items-center gap-2 uppercase tracking-tighter text-sm">
                                <Activity size={18} className="text-[#e6780f]" />
                                Grant Opportunities
                            </h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-emerald-400">
                                    <p className="text-xs font-black uppercase text-[#e6780f]">External Grant</p>
                                    <p className="text-sm font-bold mt-1">Diktis 2026 Batch 1</p>
                                    <p className="text-[10px] text-slate-300 mt-2">Deadline: 20 May 2026</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer border-l-4 border-[#e6780f]">
                                    <p className="text-xs font-black uppercase text-[#e6780f]">Internal Grant</p>
                                    <p className="text-sm font-bold mt-1">UNAMA Research Circle 02</p>
                                    <p className="text-[10px] text-slate-300 mt-2">Deadline: 15 June 2026</p>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 bg-[#e6780f] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#cf6c0d] transition-all">
                                View All Grants
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                    </div>

                    <div className="card shadow-xl ring-1 ring-slate-100">
                        <h4 className="font-black text-[#22106f] mb-6 flex items-center gap-2 uppercase text-sm tracking-tight">
                            <Activity size={18} className="text-[#e6780f]" />
                            System Updates
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-[#22106f] rounded-full mt-1 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">SOP Update v2.1</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Revision in Ethics approval form. Download updated template.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-12 bg-[#e6780f] rounded-full mt-1 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">SINTA ID Syncing</p>
                                    <p className="text-xs text-slate-500 mt-1">Automatic sync with SINTA API will happen tonight at 00:00.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
