import React, { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mockApi';
import { BookOpen, Award, ClipboardList, Clock, AlertTriangle, Play } from 'lucide-react';

export default function DashboardHome() {
    const [courses, setCourses] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'started', 'completed', 'pending', 'overdue', 'surveys', 'certificates'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesData, statsData, surveysData] = await Promise.all([
                    mockApi.getCourses(),
                    mockApi.getStats(),
                    mockApi.getSurveys()
                ]);
                setCourses(coursesData);
                setStats(statsData);
                setSurveys(surveysData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Зареждане...</div>;
    }

    // Calculate Dynamic Stats
    const startedCount = courses.filter(c => c.progress > 0 && c.progress < 100).length;
    const completedCount = courses.filter(c => c.progress === 100).length;
    const pendingCount = courses.filter(c => c.progress === 0).length;
    const surveysCount = surveys.length;
    const certificatesCount = completedCount; // Mock logic

    // Stat Cards Config
    const statCards = [
        { id: 'started', label: 'Започнати обучения', value: startedCount, icon: BookOpen, color: '#2563EB' },
        { id: 'completed', label: 'Завършени обучения', value: completedCount, icon: Award, color: '#166534' },
        { id: 'surveys', label: 'Анкети', value: surveysCount, icon: ClipboardList, color: '#0EA5E9' },
        { id: 'pending', label: 'Чакащи обучения', value: pendingCount, icon: Clock, color: '#F59E0B' },
        { id: 'overdue', label: 'Просрочени обучения', value: 0, icon: AlertTriangle, color: '#DC2626' },
        { id: 'certificates', label: 'Сертификати', value: certificatesCount, icon: Award, color: '#8B5CF6' },
    ];

    // Filter Logic
    const getFilteredContent = () => {
        switch (activeFilter) {
            case 'surveys':
                return surveys.map(s => (
                    <div key={s.id} className="card" style={{ borderLeft: '4px solid #0EA5E9' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.courseTitle || s.topic}</h3>
                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Краен срок: {s.dueDate}</div>
                        <button className="btn-continue" onClick={() => window.location.href = `/surveys/${s.id}`}>Попълни</button>
                    </div>
                ));

            case 'certificates':
                // Mock certificates View if data not loaded, or filter completed courses as proxy
                return courses.filter(c => c.progress === 100).map(c => (
                    <div key={c.id} className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{c.title}</h3>
                        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Издаден на: 01.01.2026</div>
                        <button className="btn-continue" onClick={() => alert('Mock Download')}>Изтегли PDF</button>
                    </div>
                ));

            case 'started':
                return renderCourses(courses.filter(c => c.progress > 0 && c.progress < 100));
            case 'completed':
                return renderCourses(courses.filter(c => c.progress === 100));
            case 'pending':
                return renderCourses(courses.filter(c => c.progress === 0));
            case 'overdue':
                return <div style={{ color: '#666', gridColumn: '1/-1' }}>Няма просрочени обучения.</div>;
            default: // 'all'
                return renderCourses(courses);
        }
    };

    const renderCourses = (list) => {
        if (list.length === 0) return <div style={{ color: '#666' }}>Няма намерени обучения.</div>;
        return list.map(course => (
            <div
                key={course.id}
                className="course-card"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }} // Flex layout for card
            >
                <img src={course.thumbnail} alt={course.title} className="course-image" />

                <div
                    className="course-content"
                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }} // Flex layout for content
                >
                    <span className="badge-cat">{course.category}</span>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-desc">{course.description}</p>

                    {/* marginTop: 'auto' pushes this section to the bottom */}
                    <div className="course-meta" style={{ marginTop: 'auto' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} /> {course.duration}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <BookOpen size={14} /> {course.totalModules} урока
                        </span>
                    </div>

                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="progress-text">
                        <span>Прогрес</span>
                        <span>{course.progress}%</span>
                    </div>

                    <button
                        className="btn-continue"
                        style={{
                            backgroundColor: course.progress === 100 ? '#166534' : '#2563EB',
                            cursor: 'pointer'
                        }}
                        onClick={() => window.location.href = `/course/${course.id}`}
                    >
                        {course.progress === 100 ? (
                            <>
                                <Award size={16} />
                                Завършен
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="white" />
                                {course.progress > 0 ? 'Продължи' : 'Започни'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', color: '#111827' }}>
                    {activeFilter === 'all' ? 'Моите обучения' : statCards.find(s => s.id === activeFilter)?.label}
                </h1>
                {activeFilter !== 'all' && (
                    <button onClick={() => setActiveFilter('all')} style={{ color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                        Виж всички
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card"
                        onClick={() => setActiveFilter(stat.id)}
                        style={{
                            cursor: 'pointer',
                            border: activeFilter === stat.id ? `2px solid ${stat.color}` : '2px solid transparent',
                            transform: activeFilter === stat.id ? 'translateY(-2px)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div>
                            <div className="stat-label" style={{ fontSize: '0.8rem' }}>{stat.label}</div>
                            <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</div>
                        </div>
                        <div className="stat-icon" style={{ backgroundColor: stat.color, width: '32px', height: '32px' }}>
                            <stat.icon size={16} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}> {/* alignItems stretch ensures cards are equal height */}
                {getFilteredContent()}
            </div>

        </div>
    );
}
