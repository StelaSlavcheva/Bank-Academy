import React, { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mockApi';
import { Clock, CheckCircle, PlayCircle, AlertCircle } from 'lucide-react';

export default function Progress() {
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([mockApi.getStats(), mockApi.getCourses()]).then(([sData, cData]) => {
            setStats(sData);
            setCourses(cData);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Зареждане...</div>;

    // Calculate overall percentage for the donut
    const totalCourses = courses.length;
    const completed = courses.filter(c => c.progress === 100).length;
    const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
    const overallPercentage = totalCourses > 0 ? Math.round((completed / totalCourses) * 100) : 0;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Моят прогрес</h1>
                <p style={{ color: '#6B7280' }}>
                    Проследете вашите учебни постижения
                </p>
            </div>

            {/* Hero Stats Card */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: 'white',
                padding: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Общ прогрес</h2>
                    <p style={{ opacity: 0.9, marginBottom: '2rem' }}>Завършили сте {completed} от {totalCourses} налични обучения</p>

                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', minWidth: '100px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completed}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Завършени</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', minWidth: '100px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{inProgress}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>В процес</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '8px', minWidth: '100px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>30м</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Учебно време</div>
                        </div>
                    </div>
                </div>

                {/* Donut Chart (CSS Only) */}
                <div style={{
                    width: '180px', height: '180px', borderRadius: '50%',
                    background: `conic-gradient(#FFCC00 ${overallPercentage * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                    <div style={{
                        width: '140px', height: '140px', borderRadius: '50%', background: '#665BE8', // darker shade to match gradient center visual
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column'
                    }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{overallPercentage}%</div>
                    </div>
                </div>
            </div>

            {/* Course Progress Table */}
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '2.5rem' }}>Прогрес по обучения</h3>
            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#6B7280' }}>Обучение</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#6B7280' }}>Категория</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#6B7280', width: '30%' }}>Прогрес</th>
                            <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#6B7280' }}>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{course.title}</td>
                                <td style={{ padding: '1rem', color: '#6B7280' }}>
                                    <span style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{course.category}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div className="progress-track" style={{ height: '8px' }}>
                                        <div className="progress-fill" style={{ width: `${course.progress}%`, background: course.progress === 100 ? '#10B981' : '#3B82F6' }}></div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.75rem', marginTop: '4px', color: '#6B7280' }}>{course.progress}%</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {course.progress === 100 ? (
                                        <span style={{ color: '#047857', background: '#D1FAE5', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>Завършен</span>
                                    ) : course.progress > 0 ? (
                                        <span style={{ color: '#1E40AF', background: '#DBEAFE', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>В процес</span>
                                    ) : (
                                        <span style={{ color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>Не е започнат</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
