import React, { useState } from 'react';
import { Search, Calendar, CheckCircle, Clock, FileText, TrendingUp, X, User, Target } from 'lucide-react';

export default function Assignments() {
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const mockAssignments = [
        {
            id: 1,
            title: 'Годишна атестация 2025',
            type: 'Performance Review',
            dueDate: '2025-12-31',
            status: 'completed',
            score: 'Отличен',
            description: 'Оценка на представянето за изминалата година.',
            details: {
                employee: "Силвия Славчева",
                manager: "Иван Иванов",
                ratings: [
                    { category: "Постигане на цели", score: "5/5", comment: "Изключителни резултати." },
                    { category: "Екипна работа", score: "4/5", comment: "Добър отборен играч." },
                    { category: "Иновации", score: "5/5", comment: "Предложи 3 нови процеса." }
                ],
                finalComment: "Служителят показва висок потенциал за развитие."
            }
        },
        {
            id: 2,
            title: 'Q1 2026 Целеполагане',
            type: 'Goal Setting',
            dueDate: '2026-03-31',
            status: 'pending',
            score: '-',
            description: 'Залагане на индивидуални цели за първото тримесечие.',
            details: {
                goals: [
                    { id: 1, text: "Увеличаване на продажбите на кредитни продукти с 10%", weight: "40%" },
                    { id: 2, text: "Преминаване на 3 задължителни обучения по Compliance", weight: "20%" },
                    { id: 3, text: "Менторство на нов колега", weight: "40%" }
                ]
            }
        },
    ];

    const handleAction = (item) => {
        if (item.status === 'completed') {
            setSelectedAssignment(item);
        } else {
            // Simulate starting
            const startedItem = { ...item, status: 'in_progress' };
            alert("Стартиране на процеса...");
            setSelectedAssignment(startedItem);
        }
    };

    const closeModal = () => setSelectedAssignment(null);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Атестации</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>Преглед на вашите оценки и цели</p>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={20} />
                    <input
                        type="text"
                        placeholder="Търсене..."
                        style={{
                            padding: '10px 10px 10px 40px',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            width: '250px',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </div>

            {/* Content List */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {mockAssignments.map(item => (
                    <div key={item.id} style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                                fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em',
                                color: item.status === 'completed' ? '#15803D' : '#C2410C',
                                backgroundColor: item.status === 'completed' ? '#DCFCE7' : '#FFEDD5',
                                padding: '4px 12px', borderRadius: '99px'
                            }}>
                                {item.type}
                            </span>
                            {item.status === 'completed' ? <CheckCircle size={24} color="#166534" /> : <Clock size={24} color="#F59E0B" />}
                        </div>

                        {/* Body */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937', margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.9rem' }}>
                                <Calendar size={16} /> Краен срок: {item.dueDate}
                            </div>
                            <p style={{ color: '#4B5563', fontSize: '0.95rem', marginTop: '1rem', lineHeight: '1.5' }}>{item.description}</p>
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '500' }}>Резултат</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>{item.score}</div>
                            </div>

                            <button
                                onClick={() => handleAction(item)}
                                style={{
                                    backgroundColor: item.status === 'completed' ? 'white' : '#2563EB',
                                    color: item.status === 'completed' ? '#374151' : 'white',
                                    border: item.status === 'completed' ? '1px solid #D1D5DB' : 'none',
                                    padding: '10px 20px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                }}
                            >
                                {item.status === 'completed' ? <><FileText size={18} /> Преглед</> : <><TrendingUp size={18} /> Започни</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedAssignment && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
                        maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={closeModal}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={24} color="#6B7280" />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem' }}>
                            {selectedAssignment.title}
                        </h2>

                        {selectedAssignment.type === 'Performance Review' ? (
                            <div>
                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Служител</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}><User size={16} /> {selectedAssignment.details.employee}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Мениджър</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}><User size={16} /> {selectedAssignment.details.manager}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedAssignment.details.ratings.map((r, i) => (
                                        <div key={i} style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: '600' }}>{r.category}</span>
                                                <span style={{ color: '#2563EB', fontWeight: 'bold' }}>{r.score}</span>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: '#4B5563' }}>"{r.comment}"</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #10B981' }}>
                                    <div style={{ fontWeight: '600', color: '#047857', marginBottom: '5px' }}>Краен Коментар</div>
                                    <div>{selectedAssignment.details.finalComment}</div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p style={{ marginBottom: '1rem' }}>Дефинирани цели за периода:</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {selectedAssignment.details?.goals?.map((g) => (
                                        <div key={g.id} style={{ display: 'flex', alignItems: 'start', gap: '1rem', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                                            <Target size={20} color="#EA580C" style={{ marginTop: '2px' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '500' }}>{g.text}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '5px' }}>Тежест: {g.weight}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-continue" style={{ marginTop: '2rem', width: '100%' }} onClick={closeModal}>
                                    Запази Целите
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
