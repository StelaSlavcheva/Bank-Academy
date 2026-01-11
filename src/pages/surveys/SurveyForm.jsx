import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mockApi';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SurveyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        mockApi.getSurveys().then(data => {
            const found = data.find(s => s.id === id);
            setSurvey(found);
        });
    }, [id]);

    if (!survey) return <div>Зареждане на анкетата...</div>;

    // Scale: 2 (Weak) to 6 (Excellent)
    const scale = [
        { val: 2, label: '2 (Слаб)' },
        { val: 3, label: '3 (Среден)' },
        { val: 4, label: '4 (Добър)' },
        { val: 5, label: '5 (Мн. добър)' },
        { val: 6, label: '6 (Отличен)' }
    ];

    const handleRate = (criteriaId, value) => {
        setAnswers(prev => ({ ...prev, [criteriaId]: value }));
    };

    // Check if all criteria are answered
    const totalCriteria = survey.sections.reduce((acc, sec) => acc + sec.criteria.length, 0);
    const answeredCount = Object.keys(answers).length;
    const isComplete = answeredCount === totalCriteria;

    const handleSubmit = async () => {
        setSubmitting(true);
        await mockApi.submitSurvey(id, { ratings: answers, feedback });
        alert("Благодарим Ви! Вашата обратна връзка е изпратена.");
        navigate('/surveys');
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Обратна връзка</h1>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                За обучение: <strong>{survey.courseTitle}</strong>
            </p>

            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '10px', background: '#EFF6FF', padding: '1rem', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                    <AlertCircle color="#2563EB" />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#1E40AF' }}>
                        Моля, оценете всеки критерий, за да изпратите анкетата.
                    </p>
                </div>

                {survey.sections.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: '#111827' }}>
                            {section.title}
                        </h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {/* Header Row for Scale */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(5, 1fr)', gap: '10px', paddingBottom: '0.5rem', borderBottom: '1px solid #F3F4F6' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#6B7280' }}>Критерий</div>
                                {scale.map(s => (
                                    <div key={s.val} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: '#6B7280' }}>
                                        {s.val}
                                    </div>
                                ))}
                            </div>

                            {section.criteria.map((crit, cIdx) => {
                                const isAnswered = !!answers[crit.id];
                                return (
                                    <div
                                        key={crit.id}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '2fr repeat(5, 1fr)',
                                            gap: '10px',
                                            alignItems: 'center',
                                            padding: '0.75rem 0.5rem',
                                            background: isAnswered ? (cIdx % 2 === 0 ? 'white' : '#F9FAFB') : '#FFF5F5', // Red tint if unanswered
                                            borderLeft: isAnswered ? '3px solid transparent' : '3px solid #FCA5A5'
                                        }}
                                    >
                                        <div style={{ fontWeight: '500' }}>{crit.label}</div>
                                        {scale.map(s => (
                                            <div key={s.val} style={{ display: 'flex', justifyContent: 'center' }}>
                                                <input
                                                    type="radio"
                                                    name={crit.id}
                                                    value={s.val}
                                                    checked={answers[crit.id] === s.val}
                                                    onChange={() => handleRate(crit.id, s.val)}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div style={{ marginTop: '2rem' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Препоръки и коментари (Опционално)
                    </label>
                    <textarea
                        rows="4"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                        placeholder="Вашите препоръки за нови теми или лектори..."
                    />
                </div>

                {/* Action Bar with Validation Info */}
                <div style={{ marginTop: '2rem', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <div style={{ fontSize: '0.9rem', color: isComplete ? '#166534' : '#DC2626', fontWeight: '600' }}>
                        Попълнени критерии: {answeredCount} / {totalCriteria}
                    </div>

                    <button
                        className="btn-continue"
                        onClick={handleSubmit}
                        disabled={!isComplete || submitting}
                        style={{
                            opacity: isComplete ? 1 : 0.5,
                            cursor: isComplete ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            paddingLeft: '2rem', paddingRight: '2rem',
                            backgroundColor: isComplete ? '#2563EB' : '#9CA3AF'
                        }}
                    >
                        {submitting ? 'Изпращане...' : 'Изпрати Анкетата'}
                    </button>
                </div>

            </div>
        </div>
    );
}
