import React, { useState } from 'react';
import { mockApi } from '../../lib/mockApi';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function QuizComponent({ module, courseId, onComplete }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [passed, setPassed] = useState(false);

    const questions = module?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                <p>Няма въпроси за този тест.</p>
            </div>
        );
    }

    const handleSelectAnswer = (optionId) => {
        setAnswers({ ...answers, [currentQuestion.id]: optionId });
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        return Math.round((correctCount / questions.length) * 100);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setSubmitting(true);
        const finalScore = calculateScore();
        setScore(finalScore);

        try {
            const result = await mockApi.submitQuiz(courseId, module.id, finalScore);
            setPassed(result.passed);
            setShowResults(true);
            if (result.passed && onComplete) {
                onComplete();
            }
        } catch (e) {
            alert("Грешка при изпращане на теста.");
        } finally {
            setSubmitting(false);
        }
    };

    const retry = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        setShowResults(false);
    };

    if (showResults) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {passed ? (
                    <CheckCircle size={64} color="#166534" style={{ marginBottom: '1rem' }} />
                ) : (
                    <XCircle size={64} color="#DC2626" style={{ marginBottom: '1rem' }} />
                )}

                <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>
                    {passed ? 'Тестът е преминат успешно!' : 'Тестът не е преминат'}
                </h2>

                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: passed ? '#166534' : '#DC2626', marginBottom: '2rem' }}>
                    {score}%
                </div>

                <p style={{ color: '#6B7280', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                    {passed
                        ? "Поздравления! Вие успешно завършихте този модул и вашият прогрес е запазен."
                        : "За съжаление не успяхте да покриете минимума от 70%. Моля опитайте отново."}
                </p>

                {!passed && (
                    <button className="btn-continue" onClick={retry}>
                        <RefreshCw size={16} /> Опитай отново
                    </button>
                )}
            </div>
        );
    }

    // Active Quiz View
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
            {/* Quiz Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Въпрос {currentQuestionIndex + 1} от {questions.length}</h2>
                <div style={{ background: '#F3F4F6', padding: '4px 12px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {questions.length - currentQuestionIndex - 1} оставащи
                </div>
            </div>

            {/* Question Area */}
            <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', fontWeight: '500' }}>
                    {currentQuestion.text}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentQuestion.options.map(option => {
                        const isSelected = answers[currentQuestion.id] === option.id;
                        return (
                            <div
                                key={option.id}
                                onClick={() => handleSelectAnswer(option.id)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: isSelected ? '2px solid #2563EB' : '1px solid #D1D5DB',
                                    background: isSelected ? '#EFF6FF' : 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '20px', height: '20px',
                                    borderRadius: '50%',
                                    border: isSelected ? '6px solid #2563EB' : '2px solid #9CA3AF',
                                    boxSizing: 'border-box'
                                }}></div>
                                <span style={{ fontSize: '1rem' }}>{option.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Controls */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    className="btn-continue"
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id] || submitting}
                    style={{
                        opacity: !answers[currentQuestion.id] ? 0.5 : 1,
                        cursor: !answers[currentQuestion.id] ? 'not-allowed' : 'pointer'
                    }}
                >
                    {submitting ? 'Обработка...' : (currentQuestionIndex === questions.length - 1 ? 'Приключи Теста' : 'Следващ Въпрос')}
                </button>
            </div>
        </div>
    );
}
