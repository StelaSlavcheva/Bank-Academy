import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit2, Users, FileText, HelpCircle, Trash2, Presentation, X, Check, Paperclip, Award } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';

export default function CourseList() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('courses');
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, courseId: null });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesData, nomenclatures] = await Promise.all([
                mockApi.getCourses(),
                mockApi.getNomenclatures()
            ]);
            setCourses([...coursesData]);

            const deptNom = nomenclatures.find(n => n.uniqueCode === 'DEPARTMENT');
            if (deptNom) {
                setDepartments(deptNom.values.filter(v => v.isActive));
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const tabs = [
        { id: 'courses', label: 'Обучения', count: courses.length },
        { id: 'presentations', label: 'Презентации', count: courses.filter(c => c.modules?.some(m => m.type === 'presentation')).length },
        { id: 'videos', label: 'Видеа', count: courses.filter(c => c.modules?.some(m => m.type === 'video')).length },
        { id: 'materials', label: 'Материали', count: 0 },
        { id: 'tests', label: 'Тестове', count: courses.filter(c => c.modules?.some(m => m.type === 'quiz')).length },
        { id: 'xapi', label: 'xAPI / SCORM', count: null }
    ];

    const handleContextMenu = (e, courseId) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing by document click
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            courseId
        });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, courseId: null });
    };

    const handleAction = async (action, courseId) => {
        closeContextMenu();
        const course = courses.find(c => c.id === courseId);

        switch (action) {
            case 'edit':
                navigate(`/admin/edit-course/${courseId}`);
                break;
            case 'delete':
                if (window.confirm(`Сигурни ли сте, че искате да изтриете "${course?.title}"?`)) {
                    try {
                        await mockApi.deleteCourse(courseId);
                        loadData();
                    } catch (error) {
                        alert('Грешка при изтриване: ' + error.message);
                    }
                }
                break;
            case 'assign':
                setSelectedCourse(course);
                setShowAssignModal(true);
                break;
            case 'presentation':
            case 'materials':
            case 'test':
                // For now, these direct to edit mode where one can manage modules
                // In a more complex app, we'd jump to the specific module tab/editor
                navigate(`/admin/edit-course/${courseId}`);
                break;
            default:
                console.log(`Action: ${action} for course: ${courseId}`);
        }
    };

    useEffect(() => {
        if (contextMenu.visible) {
            document.addEventListener('click', closeContextMenu);
            return () => document.removeEventListener('click', closeContextMenu);
        }
    }, [contextMenu.visible]);

    const [hoveredRow, setHoveredRow] = useState(null);

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.category?.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Filter by tab
        if (activeTab === 'courses') return true;
        if (activeTab === 'presentations') return course.modules?.some(m => m.type === 'presentation');
        if (activeTab === 'videos') return course.modules?.some(m => m.type === 'video');
        if (activeTab === 'tests') return course.modules?.some(m => m.type === 'quiz');
        if (activeTab === 'materials') return course.modules?.some(m => m.type === 'material');
        if (activeTab === 'xapi') return false; // Not implemented yet

        return true;
    });

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>
                        Управление на обучения
                    </h1>
                    <p style={{ color: '#6B7280', marginTop: '0.5rem', fontSize: '1rem' }}>
                        Централизиран панел за създаване, мониторинг и управление на образователно съдържание
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/create-course')}
                    style={{
                        backgroundColor: '#2563EB',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#1D4ED8';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#2563EB';
                        e.currentTarget.style.transform = 'none';
                    }}
                >
                    <Plus size={20} /> Ново обучение
                </button>
            </div>

            {/* Content Card */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                overflow: 'hidden'
            }}>
                {/* Tabs & Search Header */}
                <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '0.75rem 0.25rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: activeTab === tab.id ? '#2563EB' : '#9CA3AF',
                                        borderBottom: activeTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative'
                                    }}
                                >
                                    {tab.label}
                                    {tab.count !== null && (
                                        <span style={{
                                            marginLeft: '6px',
                                            fontSize: '0.75rem',
                                            backgroundColor: activeTab === tab.id ? '#EFF6FF' : '#F9FAFB',
                                            padding: '2px 6px',
                                            borderRadius: '6px',
                                            color: activeTab === tab.id ? '#2563EB' : '#6B7280'
                                        }}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={18} />
                            <input
                                type="text"
                                placeholder="Бързо търсене..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 40px',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.9rem',
                                    backgroundColor: '#F9FAFB',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#2563EB';
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E5E7EB';
                                    e.target.style.backgroundColor = '#F9FAFB';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead style={{ backgroundColor: '#F9FAFB' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Обучение</th>
                                <th style={{ padding: '16px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Категория / Отдел</th>
                                <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ПРез.</th>
                                <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Видео</th>
                                <th style={{ padding: '16px 12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Тест</th>
                                <th style={{ padding: '16px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Статус</th>
                                <th style={{ padding: '16px 16px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Метрики</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="8" style={{ padding: '6rem 0', textAlign: 'center' }}>
                                        <div style={{ color: '#9CA3AF', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Search size={48} strokeWidth={1} />
                                            <div>
                                                <p style={{ fontWeight: '600', color: '#4B5563', margin: 0 }}>Няма намерени обучения</p>
                                                <p style={{ fontSize: '0.875rem' }}>Опитайте с други критерии за търсене</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : loading ? (
                                <tr>
                                    <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
                                        Зареждане...
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course, index) => (
                                    <tr
                                        key={course.id}
                                        onMouseEnter={() => setHoveredRow(course.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{
                                            backgroundColor: hoveredRow === course.id ? '#F8FAFC' : 'transparent',
                                            transition: 'background-color 0.2s ease',
                                            borderBottom: '1px solid #F3F4F6'
                                        }}
                                    >
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>{course.title}</div>
                                            {course.lecturer && <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: '2px' }}>Лектор: {course.lecturer}</div>}
                                        </td>
                                        <td style={{ padding: '20px 16px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>{course.category}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{course.department}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 12px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500',
                                                backgroundColor: (course.modules?.filter(m => m.type === 'presentation').length || 0) > 0 ? '#EFF6FF' : '#F9FAFB',
                                                color: (course.modules?.filter(m => m.type === 'presentation').length || 0) > 0 ? '#2563EB' : '#D1D5DB'
                                            }}>
                                                {course.modules?.filter(m => m.type === 'presentation').length || 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 12px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500',
                                                backgroundColor: (course.modules?.filter(m => m.type === 'video').length || 0) > 0 ? '#F0FDF4' : '#F9FAFB',
                                                color: (course.modules?.filter(m => m.type === 'video').length || 0) > 0 ? '#16A34A' : '#D1D5DB'
                                            }}>
                                                {course.modules?.filter(m => m.type === 'video').length || 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 12px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500',
                                                backgroundColor: (course.modules?.filter(m => m.type === 'quiz').length || 0) > 0 ? '#FFFBEB' : '#F9FAFB',
                                                color: (course.modules?.filter(m => m.type === 'quiz').length || 0) > 0 ? '#D97706' : '#D1D5DB'
                                            }}>
                                                {course.modules?.filter(m => m.type === 'quiz').length || 0}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600',
                                                backgroundColor: course.mandatory ? '#FEE2E2' : '#F3F4F6',
                                                color: course.mandatory ? '#DC2626' : '#6B7280',
                                                border: `1px solid ${course.mandatory ? '#FECACA' : '#E5E7EB'}`
                                            }}>
                                                {course.mandatory ? 'Задължително' : 'Опционално'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.8rem' }}>
                                                    <span style={{ fontSize: '1rem' }}>⏱</span> {course.duration}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.8rem' }}>
                                                    <Users size={14} color="#2563EB" /> {course.students || 0}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                                            <button
                                                onClick={(e) => handleContextMenu(e, course.id)}
                                                style={{
                                                    background: hoveredRow === course.id ? 'white' : 'transparent',
                                                    border: hoveredRow === course.id ? '1px solid #E5E7EB' : '1px solid transparent',
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    borderRadius: '8px',
                                                    color: '#6B7280',
                                                    transition: 'all 0.2s ease',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: hoveredRow === course.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                                                }}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Modal */}
            {showAssignModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1100
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
                        maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Назначаване на обучение</h3>
                            <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="#6B7280" />
                            </button>
                        </div>

                        <p style={{ color: '#374151', marginBottom: '1.5rem' }}>
                            Изберете отдел или служители за назначаване на "<strong>{selectedCourse?.title}</strong>".
                        </p>

                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Отдел</label>
                                <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}>
                                    <option value="">Всички отдели</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white', cursor: 'pointer' }}
                            >
                                Отказ
                            </button>
                            <button
                                onClick={() => {
                                    alert('Обучението е назначено успешно!');
                                    setShowAssignModal(false);
                                }}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Назначи
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #E5E7EB',
                        zIndex: 1000,
                        minWidth: '200px',
                        padding: '0.5rem 0'
                    }}
                >
                    {[
                        { icon: Edit2, label: 'Редактирай', action: 'edit' },
                        { icon: Users, label: 'Назначи обучение', action: 'assign' },
                        { icon: Presentation, label: 'Презентация', action: 'presentation' },
                        { icon: Paperclip, label: 'Материали', action: 'materials' },
                        { icon: Award, label: 'Тест', action: 'test' },
                        { icon: Trash2, label: 'Изтрий', action: 'delete', danger: true }
                    ].map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleAction(item.action, contextMenu.courseId)}
                            style={{
                                width: '100%',
                                padding: '10px 16px',
                                border: 'none',
                                background: 'none',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '0.9rem',
                                color: item.danger ? '#DC2626' : '#374151',
                                transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
