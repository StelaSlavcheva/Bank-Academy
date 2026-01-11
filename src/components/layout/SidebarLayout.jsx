import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    BookOpen,
    BarChart2,
    FileCheck,
    Award,
    ClipboardList,
    Settings,
    Users,
    FileText,
    Activity,
    ShieldCheck,
    Layout,
    Bell
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `nav-item ${isActive ? 'active' : ''}`
        }
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

export default function SidebarLayout({ children }) {
    const { user, logout, updateRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Define permissions based on Roles_Matrix.pdf
    // Admin role sees everything found in 'System Administrator' or 'HR Administrator'
    const isSystemAdmin = user?.role === 'admin' || user?.role === 'system_admin';
    const isHRAdmin = user?.role === 'admin' || user?.role === 'hr_admin';
    const isManager = user?.role === 'manager';

    // For the purpose of this demo, we assume 'admin' gets full access
    // Adjust logic below to strictly match your matrix if you use granular roles like 'hr_admin'
    const showAdminSection = isSystemAdmin || isHRAdmin || isManager;

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#003366' }}>
                        <div style={{ width: '30px', height: '30px', background: '#003366', borderRadius: '50%', borderBottomRightRadius: '0' }}></div>
                        <div style={{ lineHeight: '1.1' }}>
                            <div style={{ fontSize: '14px' }}>ОБЩИНСКА БАНКА</div>
                            <div style={{ fontSize: '9px', color: '#666', fontWeight: 'normal' }}>Винаги до теб</div>
                        </div>
                    </div>
                </div>

                <div className="sidebar-scroll">
                    <nav className="sidebar-nav">
                        {/* TRAINEE SECTION (Visible to ALL) */}
                        <NavItem to="/dashboard" icon={BookOpen} label="Моите обучения" />
                        <NavItem to="/catalog" icon={Layout} label="Каталог" />
                        <NavItem to="/progress" icon={BarChart2} label="Прогрес" />
                        <NavItem to="/attestations" icon={FileCheck} label="Атестации" />
                        <NavItem to="/certificates" icon={Award} label="Сертификати" />
                        <NavItem to="/surveys" icon={ClipboardList} label="Анкети" />

                        {/* ADMIN SECTION (Protected) */}
                        {showAdminSection && (
                            <>
                                <div className="sidebar-divider">АДМИНИСТРАЦИЯ</div>

                                {(isSystemAdmin || isHRAdmin) && (
                                    <NavItem to="/admin/courses" icon={Settings} label="Управление обучения" />
                                )}

                                {(isSystemAdmin || isHRAdmin) && (
                                    <NavItem to="/admin/nomenclatures" icon={FileText} label="Номенклатури" />
                                )}

                                {(isSystemAdmin || isHRAdmin) && (
                                    <NavItem to="/admin/users" icon={Users} label="Потребители" />
                                )}

                                <NavItem to="/admin/analytics" icon={Activity} label="Аналитика" />

                                {(isSystemAdmin || isHRAdmin) && (
                                    <NavItem to="/admin/feedback" icon={ClipboardList} label="Анкети (Обратна връзка)" />
                                )}

                                <NavItem to="/admin/compliance" icon={ShieldCheck} label="Съответствие" />
                            </>
                        )}
                    </nav>
                </div>
                {/* Debug Role Switcher */}
                <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', marginBottom: '4px' }}>
                        Тест Роля (Смяна):
                    </label>
                    <select
                        value={user?.role || 'trainee'}
                        onChange={(e) => updateRole(e.target.value)}
                        style={{ width: '100%', padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="admin">System Admin (Всичко)</option>
                        <option value="hr_admin">HR Admin (Курсове/Анализи)</option>
                        <option value="manager">Dept Manager (Екип)</option>
                        <option value="trainee">Trainee (Служител)</option>
                    </select>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="main-wrapper">
                {/* Top Header */}
                <header className="top-header">
                    <div className="page-title">Bank Academy</div>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} color="#666" />
                            <span className="badge-dot"></span>
                        </button>
                        <div className="user-menu" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                            <div className="avatar">
                                {user?.displayName?.charAt(0)}
                            </div>
                            <div className="user-info">
                                <span className="name">{user?.displayName}</span>
                                <span className="role">{user?.role === 'admin' ? 'Administrator' : 'Служител'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
