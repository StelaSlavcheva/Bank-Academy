import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mockApi';
import { PlayCircle, CheckCircle, Lock, FileText, HelpCircle, ChevronLeft } from 'lucide-react';
import QuizComponent from './QuizComponent';
import StrictVideoPlayer from './StrictVideoPlayer';
import PresentationPlayer from './PresentationPlayer';

export default function CoursePlayer() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeModule, setActiveModule] = useState(null);

    // Local state to track completion during this session 
    // (In a real app, this comes from the backend, but for the demo we need immediate feedback)
    const [completedModules, setCompletedModules] = useState({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await mockApi.getCourseDetails(courseId);
                setCourse(data);

                // Initialize completed map from data
                const initialCompleted = {};
                data.modules?.forEach(m => {
                    if (m.completed) initialCompleted[m.id] = true;
                });
                setCompletedModules(initialCompleted);

                // Default to first module
                if (data.modules && data.modules.length > 0) {
                    setActiveModule(data.modules[0]);
                }
            } catch (err) {
                console.error("Error fetching course", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleModuleComplete = async (moduleId) => {
        // Optimistic Update
        const newCompleted = { ...completedModules, [moduleId]: true };
        setCompletedModules(newCompleted);

        // Calculate Progress
        const totalModules = course.modules.length;
        const completedCount = Object.keys(newCompleted).length;
        const progress = Math.round((completedCount / totalModules) * 100);

        // API Call
        try {
            await mockApi.updateCourseProgress(courseId, progress);
        } catch (e) {
            console.error("Failed to update progress", e);
        }

        // Auto-advance to next module if available
        const currentIndex = course.modules.findIndex(m => m.id === moduleId);
        if (currentIndex !== -1 && currentIndex < course.modules.length - 1) {
            setActiveModule(course.modules[currentIndex + 1]);
        } else if (currentIndex === course.modules.length - 1) {
            // Course Complete!
            alert("Честито! Вие завършихте успешно обучението.");
            navigate('/dashboard');
        }
    };

    const isModuleLocked = (index) => {
        // specific logic for this strict course
        if (course?.mode === 'compliance' && course?.settings?.sequentialEnforcement) {
            if (index === 0) return false;
            const prevModuleId = course.modules[index - 1].id;
            return !completedModules[prevModuleId];
        }
        return false;
    };

    const handleModuleClick = (module, index) => {
        if (isModuleLocked(index)) return;
        setActiveModule(module);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Зареждане на обучението...</div>;
    if (!course) return <div style={{ padding: '2rem' }}>Обучението не е намерено.</div>;

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>

            {/* Breadcrumb / Back */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#6B7280',
                        fontSize: '0.9rem'
                    }}
                >
                    <ChevronLeft size={16} /> Назад към таблото
                </button>
                <span style={{ color: '#D1D5DB' }}>/</span>
                <span style={{ fontWeight: '600' }}>{course.title}</span>
                {course.mode === 'compliance' && (
                    <span style={{ marginLeft: '1rem', fontSize: '0.75rem', background: '#DC2626', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>
                        ЗАДЪЛЖИТЕЛЕН
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: 0 }}>

                {/* Left: Main Content (Player Switcher) */}
                <div style={{ flex: 3, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                    <div style={{
                        backgroundColor: activeModule?.type === 'video' ? 'black' : 'white',
                        aspectRatio: '16/9',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        marginBottom: '1.5rem',
                        position: 'relative'
                    }}>
                        {activeModule ? (
                            activeModule.type === 'presentation' ? (
                                <PresentationPlayer
                                    slides={activeModule.slides || []}
                                    onComplete={() => handleModuleComplete(activeModule.id)}
                                />
                            ) : activeModule.type === 'video' ? (
                                course.mode === 'compliance' ? (
                                    <StrictVideoPlayer
                                        videoUrl={activeModule.videoUrl}
                                        settings={activeModule.settings || {}}
                                        onComplete={() => handleModuleComplete(activeModule.id)}
                                    />
                                ) : (
                                    <video
                                        controls
                                        autoPlay
                                        style={{ width: '100%', height: '100%' }}
                                        src={activeModule.videoUrl}
                                        onEnded={() => handleModuleComplete(activeModule.id)}
                                    >
                                        Вашият браузър не поддържа видео елемента.
                                    </video>
                                )
                            ) : (
                                <QuizComponent
                                    module={activeModule}
                                    courseId={course.id}
                                    onComplete={() => handleModuleComplete(activeModule.id)}
                                />
                            )
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column' }}>
                                <Lock size={48} color="#6B7280" />
                                <p style={{ marginTop: '1rem', color: '#9CA3AF' }}>Няма налично съдържание за този курс.</p>
                            </div>
                        )}
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                        <h1 style={{ marginTop: 0, fontSize: '1.5rem', color: '#111827' }}>
                            {activeModule?.title}
                        </h1>
                        <p style={{ color: '#6B7280' }}>
                            {course.description || "Преминете през обучението последователно."}
                        </p>

                        <div style={{ marginTop: '2rem', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Материали към урока</h3>
                            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563EB', textDecoration: 'none', fontSize: '0.95rem' }}>
                                <FileText size={16} /> Ресурси (PDF)
                            </a>
                        </div>
                    </div>

                </div>

                {/* Right: Playlist / Syllabus */}
                <div style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '100%',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #E5E7EB', fontWeight: '600' }}>
                        Съдържание на обучението
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {course.modules?.map((module, index) => {
                            const isActive = activeModule?.id === module.id;
                            const isCompleted = completedModules[module.id];
                            const isLocked = isModuleLocked(index);

                            return (
                                <div
                                    key={module.id}
                                    onClick={() => handleModuleClick(module, index)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid #F3F4F6',
                                        cursor: isLocked ? 'not-allowed' : 'pointer',
                                        backgroundColor: isActive ? '#EFF6FF' : (isLocked ? '#F9FAFB' : 'white'),
                                        borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        opacity: isLocked ? 0.6 : 1
                                    }}
                                >
                                    <div style={{ marginTop: '4px' }}>
                                        {isLocked ? (
                                            <Lock size={16} color="#9CA3AF" />
                                        ) : isCompleted ? (
                                            <CheckCircle size={16} color="#166534" />
                                        ) : (
                                            module.type === 'video' ? <PlayCircle size={16} color={isActive ? '#2563EB' : '#9CA3AF'} /> :
                                                module.type === 'presentation' ? <FileText size={16} color={isActive ? '#2563EB' : '#9CA3AF'} /> :
                                                    <HelpCircle size={16} color="#EA580C" />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            fontWeight: isActive ? '600' : '400',
                                            color: isActive ? '#1E3A8A' : '#374151',
                                            marginBottom: '4px'
                                        }}>
                                            {index + 1}. {module.title}
                                        </div>
                                        {module.duration && (
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                                {module.duration}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
