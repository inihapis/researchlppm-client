import React, { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import {
    Plus,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Save,
    Send,
    Activity,
    Lock,
    Globe,
    FileText,
    ArrowUpRight,
    Clipboard
} from 'lucide-react';
import { api } from '../lib/api';
import { useRole } from '../context/RoleContext';

const Submissions = () => {
    const { role } = useRole();
    const [submissions, setSubmissions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Penelitian',
        type: 'Internal',
        description: ''
    });

    const [reviewData, setReviewData] = useState({
        status: 'Pending',
        notes: ''
    });

    const [progressText, setProgressText] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/submissions');
            // If Dosen, we simulate only seeing own submissions
            if (role === 'Dosen') {
                // In a real app we'd filter by user ID. Here we just take the first few or filter by a tag.
                // For prototype, we show all if they are 'shared' or filter.
                // Let's just show all for simplicity unless we want to mock 'own' data.
                setSubmissions(res.data);
            } else {
                setSubmissions(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/submissions', formData);
            setFormData({ title: '', category: 'Penelitian', type: 'Internal', description: '' });
            setIsFormOpen(false);
            fetchSubmissions();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/api/submissions/${selectedSub.id}`, reviewData);
            setSelectedSub(null);
            fetchSubmissions();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddProgress = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/submissions/${selectedSub.id}/progress`, { content: progressText });
            setProgressText('');
            // Refresh local selectedSub
            const res = await api.get('/api/submissions');
            const updated = res.data.find(s => s.id === selectedSub.id);
            setSelectedSub(updated);
            fetchSubmissions();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#22106f]">Research Submissions</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Management for SOP & Inisiatif Penelitian</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-200">
                        <Clipboard size={16} />
                        View SOP
                    </button>
                    {role === 'Dosen' && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="btn-secondary"
                        >
                            <Plus size={20} />
                            <span>Create Submission</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="card overflow-hidden p-0 mb-10 border-none shadow-xl ring-1 ring-slate-100">
                <div className="p-5 bg-white border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-4 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or lecturer name..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#22106f]/10 transition-all font-bold placeholder:text-slate-300"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-colors border border-slate-100 shadow-sm">
                            <Filter size={14} />
                            Filter
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-[10px] uppercase text-slate-400 font-extrabold tracking-widest">
                                <th className="px-6 py-5">Submission Overview</th>
                                {role === 'Admin' && <th className="px-6 py-5">Lecturer</th>}
                                <th className="px-6 py-5">Type / Role</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span
                                                className="text-sm font-black text-slate-900 group-hover:text-[#22106f] transition-colors cursor-pointer"
                                                onClick={() => setSelectedSub(sub)}
                                            >
                                                {sub.title}
                                            </span>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-orange-50 text-[#e6780f] border border-orange-100">{sub.category}</span>
                                                <span className="text-[9px] font-bold text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {role === 'Admin' && (
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-700">BS</div>
                                                <span className="text-xs font-bold text-slate-700">Dr. Budi Santoso</span>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-6 font-bold">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] items-center gap-1.5 flex uppercase ${sub.type === 'Internal' ? 'text-[#22106f]' : 'text-[#e6780f]'}`}>
                                                {sub.type === 'Internal' ? <Lock size={12} /> : <Globe size={12} />}
                                                {sub.type} Grant
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`text-[9px] uppercase font-black px-3 py-1.5 rounded-2xl flex items-center justify-center gap-2 w-fit shadow-xs border ${sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            sub.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                'bg-orange-50 text-orange-600 border-orange-100'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Approved' ? 'bg-emerald-500' :
                                                sub.status === 'Rejected' ? 'bg-rose-500' :
                                                    'bg-orange-500'
                                                }`}></div>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedSub(sub);
                                                setReviewData({ status: sub.status, notes: sub.notes || '' });
                                            }}
                                            className="px-4 py-2 bg-slate-50 hover:bg-[#22106f] hover:text-white rounded-xl text-slate-400 transition-all font-black uppercase text-[10px] tracking-widest border border-slate-100"
                                        >
                                            View Progress
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Proposal Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-[#22106f]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-3xl transform animate-in slide-in-from-bottom overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-[#22106f]">New Research Initiative</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Please fill the isian as per LPPM SOP</p>
                            </div>
                            <button onClick={() => setIsFormOpen(false)} className="w-10 h-10 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition-all border border-slate-100 flex items-center justify-center shadow-sm">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Research Title</label>
                                    <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#22106f]/5 focus:bg-white transition-all font-bold text-slate-800" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Category</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#22106f]/5 focus:bg-white transition-all font-bold text-slate-800" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        <option value="Penelitian">Penelitian</option>
                                        <option value="Pengabdian">Pengabdian</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Grant Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#22106f]/5 focus:bg-white transition-all font-bold text-slate-800" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">SOP & Guidelines</label>
                                    <div className="flex items-center gap-3">
                                        <a href="#" className="flex-1 px-4 py-3 bg-indigo-50 text-[#22106f] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-all">
                                            <FileText size={14} /> Download SOP
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Initiative Description</label>
                                <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-[#22106f]/5 focus:bg-white transition-all font-bold text-slate-800 min-h-[140px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-all bg-slate-50 rounded-2xl">Discard</button>
                                <button type="submit" className="flex-[2] btn-secondary justify-center text-sm">
                                    <Send size={20} />
                                    Submit Research Proposal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Details & Progress Modal */}
            {selectedSub && createPortal(
                <div
                    className="fixed inset-0 bg-[#22106f]/60 backdrop-blur-md flex items-center justify-end z-50"
                    onClick={() => setSelectedSub(null)}
                >
                    <div
                        className="bg-white h-full w-full max-w-xl shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${selectedSub.status === 'Approved'
                                    ? 'bg-emerald-500'
                                    : selectedSub.status === 'Rejected'
                                        ? 'bg-rose-500'
                                        : 'bg-orange-500'
                                    }`} />
                                <h3 className="text-2xl font-black text-[#22106f]">
                                    {selectedSub.title}
                                </h3>
                            </div>

                            <button
                                onClick={() => setSelectedSub(null)}
                                className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-12">
                            <section>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Grant Allocation</p>
                                        <p className="font-black text-[#22106f]">{selectedSub.type}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Category</p>
                                        <p className="font-black text-[#e6780f]">{selectedSub.category}</p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Abstract / Description</p>
                                    <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100 font-medium italic">
                                        "{selectedSub.description || 'No description provided.'}"
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-[10px] font-black uppercase text-[#e6780f] tracking-widest mb-8 flex items-center gap-2">
                                    <Activity size={14} />
                                    Submission Timeline & Progress
                                </h4>
                                <div className="space-y-10 ml-4 border-l-2 border-slate-100 pl-8 relative">
                                    {selectedSub.progress.map((p, i) => (
                                        <div key={p.id} className="relative">
                                            <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#22106f] shadow-sm z-10"></div>
                                            <p className="text-xs font-black text-[#22106f] uppercase tracking-tighter">{i === 0 ? 'Latest Milestone' : 'Previous Update'}</p>
                                            <p className="text-sm text-slate-600 mt-2 font-bold leading-relaxed">{p.content}</p>
                                            <p className="text-[10px] text-slate-300 font-extrabold mt-2 uppercase tracking-widest">{p.date}</p>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleAddProgress} className="mt-12 bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
                                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Add Progress Update (Feature 7)</p>
                                    <div className="flex flex-col gap-3">
                                        <textarea
                                            required
                                            placeholder="Indicate your current research progress..."
                                            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#e6780f]/10 min-h-[100px]"
                                            value={progressText}
                                            onChange={(e) => setProgressText(e.target.value)}
                                        />
                                        <button type="submit" className="w-full bg-[#22106f] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/10 hover:bg-[#1a0b5a]">
                                            <Save size={18} />
                                            Update Research Log
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {role === 'Admin' && (
                                <section className="p-8 bg-slate-900 rounded-[40px] text-white shadow-3xl">
                                    <h4 className="text-[10px] font-black uppercase text-[#e6780f] tracking-widest mb-6">Reviewer Action Panel</h4>
                                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Final Status Decision</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Pending', 'Approved', 'Rejected'].map(s => (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => setReviewData({ ...reviewData, status: s })}
                                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reviewData.status === s
                                                            ? (s === 'Approved' ? 'bg-emerald-600 text-white' : s === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-orange-500 text-white')
                                                            : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Internal Reviewer Notes</label>
                                            <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#e6780f]/50 min-h-[100px]" placeholder="Submit feedback to lecturer..." value={reviewData.notes} onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })} />
                                        </div>
                                        <button type="submit" className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                                            <CheckCircle size={20} className="text-[#22106f]" />
                                            Confirm Final Decision
                                        </button>
                                    </form>
                                </section>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Submissions;
