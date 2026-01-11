import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mockApi';
import { ClipboardList, ChevronRight, Check } from 'lucide-react';

export default function SurveyList() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Re-fetch data every time the component mounts to get the latest status
        mockApi.getSurveys().then(data => {
            setSurveys([...data]); // Force new array reference
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Зареждане...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Анкети за обратна връзка</h1>

            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#6B7280', fontSize: '0.85rem' }}>Обучение</th>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#6B7280', fontSize: '0.85rem' }}>Краен срок</th>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#6B7280', fontSize: '0.85rem' }}>Статус</th>
                            <th style={{ textAlign: 'right', padding: '1rem', color: '#6B7280', fontSize: '0.85rem' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {surveys.map(survey => {
                            const isCompleted = survey.status === 'completed';
                            return (
                                <tr key={survey.id} style={{ borderBottom: '1px solid #E5E7EB', opacity: isCompleted ? 0.6 : 1 }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <ClipboardList size={18} color="#2563EB" />
                                            {survey.courseTitle}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#4B5563' }}>{survey.dueDate}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: isCompleted ? '#DEF7EC' : '#DBEAFE',
                                            color: isCompleted ? '#03543F' : '#1E40AF',
                                            padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600'
                                        }}>
                                            {isCompleted ? 'Предадена' : 'Чакаща'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        {isCompleted ? (
                                            <span style={{ fontSize: '0.85rem', color: '#03543F', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <Check size={16} /> Приета
                                            </span>
                                        ) : (
                                            <button
                                                className="btn-continue"
                                                style={{ display: 'inline-flex', padding: '6px 12px', fontSize: '0.85rem' }}
                                                onClick={() => navigate(`/surveys/${survey.id}`)}
                                            >
                                                Попълни
                                                <ChevronRight size={14} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {surveys.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
                                    Нямате чакащи анкети.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
