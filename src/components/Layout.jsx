import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    FileText,
    Users,
    Newspaper,
    Bell,
    Menu,
    LogOut,
    CheckCircle,
    UserCircle,
    FileSpreadsheet,
    Zap
} from 'lucide-react';
import { useRole } from '../context/RoleContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { role, toggleRole } = useRole();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { name: 'Submissions', icon: <ClipboardList size={20} />, path: '/submissions' },
        { name: 'Templates', icon: <FileText size={20} />, path: '/templates' },
        { name: 'News', icon: <Newspaper size={20} />, path: '/news' },
    ];

    // Only Admin can see the Lecturer list
    if (role === 'Admin') {
        menuItems.splice(3, 0, { name: 'Lecturers', icon: <Users size={20} />, path: '/lecturers' });
    }

    return (
        <>
            <aside className={`fixed top-0 left-0 h-full w-64 bg-[#22106f] text-slate-100 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-10 shadow-2xl`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 bg-[#e6780f] rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                            <Zap className="text-white fill-current" size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tight italic">LPPM <span className="text-orange-400">UNAMA</span></span>
                    </div>

                    <nav className="space-y-1.5 flex-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-white/10 text-white border-l-4 border-[#e6780f] font-bold'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/10">
                        <div className="p-4 bg-white/5 rounded-2xl mb-4">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-3">Login status as:</p>
                            <button
                                onClick={toggleRole}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${role === 'Admin' ? 'bg-[#e6780f]/10 border-[#e6780f]/30 text-orange-200' : 'bg-slate-800 border-white/10 text-slate-300'
                                    }`}
                            >
                                <span className="text-xs font-bold uppercase">{role}</span>
                                <div className={`w-6 h-3 rounded-full relative ${role === 'Admin' ? 'bg-[#e6780f]' : 'bg-slate-600'}`}>
                                    <div className={`absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all ${role === 'Admin' ? 'right-0.5' : 'left-0.5'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {isOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidebar}></div>}
        </>
    );
};

const Header = ({ toggleSidebar }) => {
    const { role } = useRole();

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Menu size={24} />
                </button>
                <div className="hidden md:block">
                    <h1 className="text-slate-900 font-extrabold text-xl tracking-tight uppercase italic underline decoration-[#e6780f] decoration-4 underline-offset-4">LPPM RMS</h1>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="p-2 text-slate-400 hover:text-[#22106f] hover:bg-slate-50 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e6780f] rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-slate-900 text-sm font-black leading-none">{role === 'Admin' ? 'Super Admin' : 'Dr. Budi Santoso, M.Kom'}</p>
                        <p className="text-[#e6780f] text-[9px] font-black mt-1 uppercase tracking-widest leading-none">{role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#22106f] font-black shadow-inner">
                        {role === 'Admin' ? 'SA' : 'BS'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <Header toggleSidebar={toggleSidebar} />
                <div className="p-8 flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
