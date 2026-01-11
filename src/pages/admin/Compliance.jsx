import React from 'react';
import { ShieldCheck, AlertTriangle, Clock, Search, Filter, Printer } from 'lucide-react';

export default function Compliance() {
    const complianceData = [
        { id: 1, course: 'GDPR 2026: Задължителен годишен тест', type: 'Mandatory', deadline: '2026-03-31', progress: 45, status: 'on-track' },
        { id: 2, label: 'AML: Борба с прането на пари', type: 'Mandatory', deadline: '2026-02-15', progress: 82, status: 'warning' },
        { id: 3, label: 'Киберсигурност за банкови служители', type: 'Required', deadline: '2026-04-30', progress: 12, status: 'on-track' },
        { id: 4, label: 'Физическа сигурност в клоновете', type: 'Mandatory', deadline: '2026-01-31', progress: 95, status: 'critical' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Съответствие (Compliance)</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>Мониторинг на регулаторни обучения и крайни срокове</p>
                </div>
                <button style={{
                    backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 16px',
                    borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    <Printer size={18} /> Генериране на отчет
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#F0FDF4', padding: '1.5rem', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#15803D', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={24} />
                        <span style={{ fontWeight: '600' }}>Общо съответствие</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>94.2%</div>
                    <div style={{ fontSize: '0.85rem', color: '#166534' }}>Всички задължителни обучения</div>
                </div>
                <div style={{ backgroundColor: '#FFFBEB', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#D97706', marginBottom: '0.5rem' }}>
                        <AlertTriangle size={24} />
                        <span style={{ fontWeight: '600' }}>Наближаващи срокове</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>12</div>
                    <div style={{ fontSize: '0.85rem', color: '#92400E' }}>Обучения със срок под 14 дни</div>
                </div>
                <div style={{ backgroundColor: '#FEF2F2', padding: '1.5rem', borderRadius: '16px', border: '1px solid #FECACA' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#DC2626', marginBottom: '0.5rem' }}>
                        <Clock size={24} />
                        <span style={{ fontWeight: '600' }}>Просрочени</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>3</div>
                    <div style={{ fontSize: '0.85rem', color: '#991B1B' }}>Служители с просрочени обучения</div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Мониторинг на задължителни обучения</h3>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={16} />
                        <input type="text" placeholder="Търси обучение..." style={{ padding: '8px 10px 8px 32px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                    </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#F9FAFB' }}>
                        <tr>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>Обучение</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>Тип</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>Краен срок</th>
                            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>Изпълнение</th>
                            <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280' }}>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: 'GDPR 2026: Годишен тест', type: 'Задължително', deadline: '31.03.2026', progress: 85, status: 'on-track' },
                            { name: 'AML: Основни процедури', type: 'Задължително', deadline: '15.02.2026', progress: 42, status: 'warning' },
                            { name: 'Информационна сигурност', type: 'Профилирано', deadline: '30.04.2026', progress: 15, status: 'on-track' },
                            { name: 'Етика и бизнес правила', type: 'Задължително', deadline: '20.01.2026', progress: 98, status: 'critical' }
                        ].map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '16px', fontWeight: '600' }}>{row.name}</td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', backgroundColor: '#F3F4F6', color: '#4B5563' }}>{row.type}</span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem' }}>{row.deadline}</td>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${row.progress}%`, height: '100%', backgroundColor: row.status === 'critical' ? '#EF4444' : row.status === 'warning' ? '#F59E0B' : '#10B981' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', minWidth: '35px' }}>{row.progress}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600',
                                        backgroundColor: row.status === 'critical' ? '#FEE2E2' : row.status === 'warning' ? '#FEF3C7' : '#DCFCE7',
                                        color: row.status === 'critical' ? '#DC2626' : row.status === 'warning' ? '#D97706' : '#15803D'
                                    }}>
                                        {row.status === 'critical' ? 'Спешно' : row.status === 'warning' ? 'Внимание' : 'В срок'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
