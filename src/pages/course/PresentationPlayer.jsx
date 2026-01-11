import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Clock, CheckCircle } from 'lucide-react';

export default function PresentationPlayer({ slides, onComplete }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [slideStatus, setSlideStatus] = useState({}); // { 0: 'completed', 1: 'viewed' }

    const currentSlide = slides[currentIndex];

    // Initialize/Reset Timer on Slide Change
    useEffect(() => {
        // If already completed, no timer needed
        if (slideStatus[currentIndex] === 'completed') {
            setTimeLeft(0);
        } else {
            setTimeLeft(currentSlide.minTime || 5);
        }
    }, [currentIndex, slides]);

    // Timer Countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            if (slideStatus[currentIndex] !== 'completed') {
                markCompleted(currentIndex);
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const markCompleted = (index) => {
        setSlideStatus(prev => {
            const newState = { ...prev, [index]: 'completed' };
            return newState;
        });
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const isNextLocked = timeLeft > 0;
    const isLastSlide = currentIndex === slides.length - 1;
    const progressPercent = ((currentIndex + 1) / slides.length) * 100;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white' }}>
            {/* Header / Progress */}
            <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                    Слайд {currentIndex + 1} от {slides.length}
                </div>
                {timeLeft > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#EA580C', fontWeight: 'bold' }}>
                        <Clock size={16} />
                        {timeLeft} сек.
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#166534', fontWeight: 'bold' }}>
                        <CheckCircle size={16} />
                        Завършен
                    </div>
                )}
            </div>

            <div style={{ width: '100%', height: '4px', background: '#F3F4F6' }}>
                <div style={{ height: '100%', background: '#2563EB', width: `${progressPercent}%`, transition: 'width 0.3s' }}></div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', overflowY: 'auto' }}>
                <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '2rem' }}>
                        {currentSlide.content}
                    </h2>
                    {/* Placeholder for rich content */}
                    <div style={{ height: '200px', background: '#F9FAFB', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E5E7EB', color: '#9CA3AF' }}>
                        [Визуално съдържание на слайд {currentSlide.id}]
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{
                        opacity: currentIndex === 0 ? 0.5 : 1,
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: 'none', border: '1px solid #D1D5DB', padding: '8px 16px', borderRadius: '6px'
                    }}
                >
                    <ChevronLeft size={16} /> Предишен
                </button>

                <button
                    onClick={isLastSlide ? onComplete : handleNext}
                    disabled={isNextLocked}
                    style={{
                        opacity: isNextLocked ? 0.5 : 1,
                        cursor: isNextLocked ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: isNextLocked ? '#9CA3AF' : '#2563EB',
                        color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px',
                        fontWeight: '600'
                    }}
                >
                    {isLastSlide ? 'Приключи модула' : 'Следващ'}
                    {!isLastSlide && <ChevronRight size={16} />}
                </button>
            </div>
        </div>
    );
}
