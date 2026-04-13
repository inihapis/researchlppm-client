import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
    Users,
    ExternalLink,
    BookOpen,
    Globe,
    GraduationCap,
    Plus,
    Search,
    Edit2,
    Trash2,
    ShieldAlert
} from 'lucide-react';
import { useRole } from '../context/RoleContext';

const Lecturers = () => {
    const { role } = useRole();
    const [lecturers, setLecturers] = useState([]);

    useEffect(() => {
        if (role === 'Admin') {
            const fetchData = async () => {
                try {
                    const res = await api.get('/api/lecturers');
                    setLecturers(res.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchData();
        }
    }, [role]);

    if (role !== 'Admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                <ShieldAlert size={64} className="text-rose-500 mb-6" />
                <h3 className="text-2xl font-black text-[#22106f]">Access Restricted</h3>
                <p className="text-slate-500 font-medium max-w-md text-center mt-2">Only administrators can manage and view the full lecturer directory according to system policy.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#22106f]">Lecturer Management</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Registry of UNAMA Researchers & External Affiliates</p>
                </div>
                <button className="btn-secondary">
                    <Plus size={20} />
                    <span>Register New Lecturer</span>
                </button>
            </div>

            <div className="card p-0 overflow-hidden border-none shadow-xl ring-1 ring-slate-100">
                <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-3 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by name or NIDN..." className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#22106f]/5" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr className="text-[10px] uppercase text-slate-400 font-black tracking-widest">
                                <th className="px-6 py-6">Personal Info</th>
                                <th className="px-6 py-6 text-center">Researcher IDs (Feature 5)</th>
                                <th className="px-6 py-6 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {lecturers.map((lec) => (
                                <tr key={lec.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22106f] to-[#1a0b5a] flex items-center justify-center text-white text-lg font-black shadow-lg">
                                                {lec.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-[#22106f] group-hover:text-[#e6780f] transition-colors">{lec.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">NIDN: {lec.nidn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex justify-center gap-3">
                                            <a href={lec.scholar} target="_blank" rel="noreferrer" title="Google Scholar" className="w-10 h-10 bg-slate-50 hover:bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 transition-all shadow-sm hover:shadow-md">
                                                <BookOpen size={18} />
                                            </a>
                                            <a href={lec.sinta} target="_blank" rel="noreferrer" title="SINTA" className="w-10 h-10 bg-slate-50 hover:bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 border border-slate-100 hover:border-emerald-100 transition-all shadow-sm hover:shadow-md">
                                                <Globe size={18} />
                                            </a>
                                            <a href={lec.scopus} target="_blank" rel="noreferrer" title="Scopus" className="w-10 h-10 bg-slate-50 hover:bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-500 border border-slate-100 hover:border-orange-100 transition-all shadow-sm hover:shadow-md">
                                                <GraduationCap size={18} />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right space-x-2">
                                        <button className="p-2 text-slate-300 hover:text-[#22106f] hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Lecturers;
