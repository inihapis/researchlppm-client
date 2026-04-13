import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FileText, 
    Download, 
    Archive, 
    FilePlus, 
    Search,
    ChevronDown,
    FileSpreadsheet,
    FileChartLine
} from 'lucide-react';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/templates');
                setTemplates(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const getIcon = (title) => {
        if (title.toLowerCase().includes('excel')) return <FileSpreadsheet className="text-emerald-500" size={32} />;
        if (title.toLowerCase().includes('word') || title.toLowerCase().includes('proposal')) return <FileChartLine className="text-indigo-500" size={32} />;
        return <FileText className="text-slate-400" size={32} />;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Resources & Templates</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Download essential documents for your research submissions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((temp) => (
                    <div key={temp.id} className="card group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8">
                        <div className="flex flex-col items-center justify-center h-full gap-4 relative z-10">
                            <div className="p-5 bg-gradient-to-br from-slate-50 to-white/50 rounded-3xl group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:shadow-lg border border-slate-100 group-hover:border-indigo-100">
                                {getIcon(temp.title)}
                            </div>
                            <div className="text-center">
                                <h3 className="font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors mb-2">{temp.title}</h3>
                                <p className="text-[10px] items-center font-black uppercase text-slate-400 tracking-widest">{temp.id % 2 === 0 ? 'Document' : 'Excel Sheet'}</p>
                            </div>
                            <div className="w-full h-px bg-slate-50 my-2"></div>
                            <a href={temp.link} className="w-full py-3 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95 group-hover:shadow-indigo-600/30">
                                <Download size={16} />
                                Download PDF/DOC
                            </a>
                        </div>
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-all duration-700"></div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-slate-100 rounded-[40px] flex flex-col md:flex-row items-center gap-10 border-4 border-white shadow-xl">
                <div className="md:w-1/2">
                    <h4 className="text-xl font-black text-slate-800 leading-none mb-3">Custom Requirement?</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">If you need a template not listed above, please contact our administrative office for assistance.</p>
                    <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all shadow-md active:scale-95">Support Ticket</button>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 rotate-12 flex items-center justify-center text-emerald-500 shadow-xl opacity-50"><FileSpreadsheet size={24} /></div>
                        <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 -rotate-12 flex items-center justify-center text-indigo-500 shadow-xl"><FileChartLine size={24} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Templates;
