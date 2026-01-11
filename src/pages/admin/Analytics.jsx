import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Award, BookOpen, Download, Filter, Calendar } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';

export default function Analytics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            const data = await mockApi.getAnalytics();
            setStats(data);
            setLoading(false);
        };
        loadStats();
    }, []);

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Зареждане на анализи...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Аналитика и отчети</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.25rem' }}>Проследяване на ефективността на обучението в реално време</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        backgroundColor: 'white', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 16px',
                        borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Download size={18} /> Експорт (Excel)
                    </button>
                    <button style={{
                        backgroundColor: '#2563EB', color: 'white', border: 'none', padding: '10px 16px',
                        borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Filter size={18} /> Филтриране
                    </button>
                </div>
            </div>

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Общо завършени', value: '78%', sub: '+5% спрямо предходен месец', icon: TrendingUp, color: '#10B981' },
                    { label: 'Активни потребители', value: stats.activeUsers, sub: 'През последните 30 дни', icon: Users, color: '#2563EB' },
                    { label: 'Среден резултат', value: stats.averageScore + '/100', sub: 'На база всички преминати тестове', icon: Award, color: '#D97706' },
                    { label: 'Преминати обучения', value: '1,240', sub: 'За текущата година', icon: BookOpen, color: '#7C3AED' }
                ].map((stat, i) => (
                    <div key={i} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: stat.color + '10', padding: '10px', borderRadius: '12px' }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '600', marginTop: '0.25rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Bar Chart Mockup */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Активност по месеци</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '0 1rem' }}>
                        {stats.monthlyActivity.map((item, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '40px' }}>
                                <div style={{ width: '100%', height: `${item.count * 2}px`, backgroundColor: '#3B82F6', borderRadius: '4px 4px 0 0', position: 'relative' }} title={item.count}>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut Chart Mockup */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Разпределение по статус</h3>
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        {stats.coursesByStatus.map((item, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
                                    <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>{item.value}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(item.value / 780) * 100}%`, height: '100%', backgroundColor: item.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table or List of Top Courses */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Най-търсени обучения</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {stats.topCourses.map((course, i) => (
                        <div key={i} style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6' }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{course.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563EB' }}>{course.completions}</div>
                                <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>завършили този месец</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
