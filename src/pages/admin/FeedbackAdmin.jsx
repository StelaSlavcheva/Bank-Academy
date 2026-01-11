import React, { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mockApi';
import { Plus, BarChart2, List, Trash2, Edit2, Eye, Search } from 'lucide-react';

export default function FeedbackAdmin() {
    const [activeTab, setActiveTab] = useState('manage'); // 'create', 'manage', 'analytics'
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        topic: '',
        courseId: '',
        lecturer: '',
        startDate: '',
        endDate: '',
        targetGroup: 'all'
    });

    useEffect(() => {
        // Override Mock Data for visual matching
        const VISUAL_MOCK_DATA = [
            { id: 1, topic: "Обратна връзка - Въведение в KYC", training: "Въведение в KYC процедурите", creator: "slavcheva2711@gmail.com", date: "08.01.2026", status: "Active", progress: 0 },
            { id: 2, topic: "Оценка на обучение - AML Compliance", training: "AML Compliance обучение", creator: "slavcheva2711@gmail.com", date: "08.01.2026", status: "Active", progress: 0 },
            { id: 3, topic: "Оценка - Информационна сигурност", training: "Основи на информационната сигурност", creator: "slavcheva2711@gmail.com", date: "08.01.2026", status: "Draft", progress: 0 },
        ];
        setSurveys(VISUAL_MOCK_DATA);
        setLoading(false);
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        alert("Анкетата е създадена успешно!");
        setActiveTab('manage');
    };

    const StatusBadge = ({ status }) => {
        const isDraft = status === 'Draft' || status === 'Чернова';
        return (
            <span style={{
                background: isDraft ? '#F3F4F6' : '#DCFCE7',
                color: isDraft ? '#374151' : '#166534',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: isDraft ? '1px solid #D1D5DB' : 'none'
            }}>
                {isDraft ? 'Чернова' : 'Активна'}
            </span>
        );
    };

    if (loading) return <div>Зареждане...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Анкети за обратна връзка</h1>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Управление и анализ на анкети за обучения
            </p>

            {/* Tabs Styled as Toggle Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('manage')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '6px',
                        background: activeTab === 'manage' ? '#003366' : 'white',
                        color: activeTab === 'manage' ? 'white' : '#374151',
                        border: '1px solid #E5E7EB',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <List size={16} />
                    Управление
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: '6px',
                        background: activeTab === 'analytics' ? '#003366' : 'white',
                        color: activeTab === 'analytics' ? 'white' : '#374151',
                        border: '1px solid #E5E7EB',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <BarChart2 size={16} />
                    Аналитика
                </button>
            </div>

            {/* TAB: MANAGE */}
            {activeTab === 'manage' && (
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB' }}>
                        <div style={{ position: 'relative', width: '350px' }}>
                            <Search size={18} style={{ position: 'absolute', top: '10px', left: '12px', color: '#9CA3AF' }} />
                            <input
                                type="text"
                                placeholder="Търси по тема..."
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                            />
                        </div>

                        {/* This button mimics the unseen 'New Survey' button */}
                        <button
                            className="btn-continue"
                            onClick={() => setActiveTab('create')}
                            style={{ padding: '0.6rem 1.2rem', gap: '8px' }}
                        >
                            <Plus size={18} /> Нова анкета
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#003366', color: 'white' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '500' }}>Тема</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '500' }}>Обучение</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '500' }}>Създател</th>
                                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '500' }}>Дата</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>Статус</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>Прогрес</th>
                                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '500' }}>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {surveys.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1F2937' }}>{s.topic}</td>
                                    <td style={{ padding: '1rem', color: '#4B5563' }}>{s.training}</td>
                                    <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>{s.creator}</td>
                                    <td style={{ padding: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>{s.date}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <StatusBadge status={s.status} />
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                            <div style={{ width: '60px', height: '6px', background: '#E5E7EB', borderRadius: '3px' }}>
                                                <div style={{ width: '0%', height: '100%', background: '#FACC15', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>0/0 (0%)</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563EB' }}>
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB: CREATE (Form from previous implementation, retained) */}
            {activeTab === 'create' && (
                <div className="card" style={{ maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Създаване на нова анкета</h2>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div>
                            <label className="block mb-2 font-medium">Основна информация</label>
                            <input
                                type="text"
                                placeholder="Тема на анкетата / Обучение"
                                className="input-field"
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="block mb-2 font-medium">Лектор</label>
                                <input
                                    type="text"
                                    placeholder="Име на лектора..."
                                    className="input-field"
                                    value={formData.lecturer}
                                    onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Краен срок</label>
                                <input type="date" className="input-field" />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Целева група</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="radio" name="target" checked /> Назначи на всички потребители
                                </label>
                                <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="radio" name="target" /> Избери от списък
                                </label>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Темплейт на анкетата (Фиксиран)</h3>

                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#6B7280' }}>
                                <div style={{ marginBottom: '8px' }}><strong>ТЕМА:</strong> Актуалност, Изчерпателност, Практическа приложимост</div>
                                <div style={{ marginBottom: '8px' }}><strong>ЛЕКТОРСКИ ЕКИП:</strong> Представяне, Преподавателски умения, Иновативен подход</div>
                                <div><strong>МАТЕРИАЛИ:</strong> Актуалност, Достатъчност</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('manage')}
                                style={{ padding: '0.6rem 1.5rem', background: 'white', border: '1px solid #D1D5DB', borderRadius: '6px' }}
                            >
                                Откажи
                            </button>
                            <button type="submit" className="btn-continue">
                                Създай анкета
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && (
                <div className="card">
                    <h3>Аналитично табло</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', color: '#9CA3AF', borderRadius: '8px' }}>
                        <BarChart2 size={48} />
                        <span style={{ marginLeft: '10px' }}>Графиките ще се визуализират тук...</span>
                    </div>
                </div>
            )}

        </div>
    );
}
