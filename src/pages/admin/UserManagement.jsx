import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, Edit2, Shield, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [departments, setDepartments] = useState([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, userId: null });
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const [userData, nomData] = await Promise.all([
                mockApi.getUsers(),
                mockApi.getNomenclatures()
            ]);
            setUsers(userData);

            const deptNom = nomData.find(n => n.uniqueCode === 'DEPARTMENT');
            if (deptNom) {
                setDepartments(deptNom.values.filter(v => v.isActive));
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu({ ...contextMenu, visible: false });
        if (contextMenu.visible) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [contextMenu.visible]);

    const handleContextMenu = (e, userId) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            userId
        });
    };

    const handleEditUser = (user) => {
        setSelectedUser({ ...user });
        setShowEditModal(true);
    };

    const handleSaveUser = () => {
        // In a real app, this would call mockApi.updateUser
        setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
        setShowEditModal(false);
        alert('Потребителят е обновен успешно!');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadge = (role) => {
        const roles = {
            admin: { label: 'Admin', color: '#DC2626', bg: '#FEE2E2' },
            hr_admin: { label: 'HR Admin', color: '#2563EB', bg: '#DBEAFE' },
            manager: { label: 'Manager', color: '#D97706', bg: '#FEF3C7' },
            trainee: { label: 'Trainee', color: '#059669', bg: '#D1FAE5' }
        };
        const r = roles[role] || roles.trainee;
        return (
            <span style={{
                padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600',
                backgroundColor: r.bg, color: r.color, border: `1px solid ${r.color}20`
            }}>
                {r.label}
            </span>
        );
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>Управление на потребители</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.5rem', fontSize: '1rem' }}>Управление на достъп, роли и организационни структури</p>
                </div>
                <button style={{
                    backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '12px 24px',
                    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}>
                    <UserPlus size={18} /> Нов потребител
                </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '450px' }}>
                    <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={20} />
                    <input
                        type="text"
                        placeholder="Търси по име, имейл или отдел..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 12px 12px 45px', borderRadius: '12px',
                            border: '1px solid #E5E7EB', fontSize: '1rem', outline: 'none',
                            backgroundColor: 'white', transition: 'all 0.2s'
                        }}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Име</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Контакт</th>
                            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Отдел</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Роля</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Статус</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Последно влизане</th>
                            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '5rem', color: '#9CA3AF' }}>Зареждане...</td></tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '18px 20px', fontWeight: '600', color: '#111827' }}>{user.name}</td>
                                <td style={{ padding: '18px 20px', color: '#6B7280', fontSize: '0.9rem' }}>{user.email}</td>
                                <td style={{ padding: '18px 20px', color: '#6B7280', fontSize: '0.9rem' }}>{user.department}</td>
                                <td style={{ padding: '18px 20px', textAlign: 'center' }}>{getRoleBadge(user.role)}</td>
                                <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.status === 'active' ? '#10B981' : '#D1D5DB' }}></div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: user.status === 'active' ? '#111827' : '#9CA3AF' }}>
                                            {user.status === 'active' ? 'Активен' : 'Неактивен'}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '18px 20px', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>{user.lastLogin}</td>
                                <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                                    <button
                                        onClick={(e) => handleContextMenu(e, user.id)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#9CA3AF', borderRadius: '8px', transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div style={{
                    position: 'fixed', top: contextMenu.y, left: contextMenu.x,
                    backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    border: '1px solid #E5E7EB', zIndex: 1000, overflow: 'hidden', minWidth: '180px'
                }}>
                    <button
                        onClick={() => {
                            const user = users.find(u => u.id === contextMenu.userId);
                            if (user) handleEditUser(user);
                        }}
                        style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', color: '#374151' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Edit2 size={16} /> Редактирай данни
                    </button>
                    <button
                        onClick={() => {
                            const user = users.find(u => u.id === contextMenu.userId);
                            if (user) handleEditUser(user); // Same modal for now, focus on role
                        }}
                        style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', color: '#374151' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Shield size={16} /> Промени роля
                    </button>
                    <div style={{ height: '1px', backgroundColor: '#F3F4F6' }}></div>
                    <button
                        onClick={() => {
                            if (window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
                                setUsers(users.filter(u => u.id !== contextMenu.userId));
                            }
                        }}
                        style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left', color: '#DC2626' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Trash2 size={16} /> Изтрий потребител
                    </button>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(4px)'
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Редактиране на потребител</h3>
                            <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Име</label>
                                <input
                                    type="text"
                                    value={selectedUser.name}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Имейл</label>
                                <input
                                    type="email"
                                    value={selectedUser.email}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Отдел</label>
                                <select
                                    value={selectedUser.department}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                >
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Роля</label>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                >
                                    <option value="trainee">Trainee</option>
                                    <option value="manager">Manager</option>
                                    <option value="hr_admin">HR Admin</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Статус</label>
                                <select
                                    value={selectedUser.status}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '1rem' }}
                                >
                                    <option value="active">Активен</option>
                                    <option value="inactive">Неактивен</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                            <button
                                onClick={() => setShowEditModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #D1D5DB', backgroundColor: 'white', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Отказ
                            </button>
                            <button
                                onClick={handleSaveUser}
                                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Запази промените
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
