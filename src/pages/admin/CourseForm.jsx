import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, X, FileText, Video, HelpCircle, ChevronLeft, Upload, CheckCircle, Loader } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';

export default function CourseForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [courseData, setCourseData] = useState({
        title: '',
        category: '',
        department: '',
        lecturer: '',
        duration: '',
        description: '',
        mandatory: false,
        mode: 'flexible',
        settings: {
            sequentialEnforcement: false,
            resetOnFailure: false,
            maxQuizAttempts: 3
        },
        thumbnail: ''
    });

    const [modules, setModules] = useState([]);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(isEditMode);
    const [uploading, setUploading] = useState({}); // Tracking module uploads: { moduleId: progress }

    // Load nomenclatures and course details (if editing)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Load Nomenclatures
                const nomenclatures = await mockApi.getNomenclatures();
                const categoriesNom = nomenclatures.find(n => n.uniqueCode === 'COURSE_CATEGORY');
                if (categoriesNom) setCategories(categoriesNom.values.filter(v => v.isActive));

                const departmentsNom = nomenclatures.find(n => n.uniqueCode === 'DEPARTMENT');
                if (departmentsNom) setDepartments(departmentsNom.values.filter(v => v.isActive));

                // 2. Load Course Details if in Edit Mode
                if (isEditMode) {
                    const course = await mockApi.getCourseDetails(id);
                    if (course) {
                        setCourseData({
                            title: course.title || '',
                            category: course.category || '',
                            department: course.department || '',
                            lecturer: course.lecturer || '',
                            duration: course.duration || '',
                            description: course.description || '',
                            mandatory: course.mandatory || false,
                            mode: course.mode || 'flexible',
                            settings: course.settings || {
                                sequentialEnforcement: false,
                                resetOnFailure: false,
                                maxQuizAttempts: 3
                            },
                            thumbnail: course.thumbnail || ''
                        });
                        setModules(course.modules || []);
                    }
                }
            } catch (error) {
                console.error('Failed to load initial data:', error);
                alert('Грешка при зареждане на данни');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id, isEditMode]);

    const handleInputChange = (field, value) => {
        setCourseData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSettingsChange = (field, value) => {
        setCourseData(prev => ({
            ...prev,
            settings: { ...prev.settings, [field]: value }
        }));
    };

    const generateThumbnail = (category) => {
        const presets = {
            'Плащания': 'https://images.unsplash.com/photo-1556742049-02e73f8008ee?w=600&q=80',
            'Кредити': 'https://images.unsplash.com/photo-1554224155-9736b5cb9336?w=600&q=80',
            'Сметки и депозити': 'https://images.unsplash.com/photo-1550565118-3a14e8d0386f?w=600&q=80',
            'GDPR': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
            'Карти': 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&q=80',
            'Сигурност': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
            'AML': 'https://images.unsplash.com/photo-1450101496193-db365ec3c224?w=600&q=80',
            'Дигитализация': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
        };
        const defaultImg = 'https://images.unsplash.com/photo-1512428559083-a40c16d1957c?w=600&q=80';
        const newUrl = presets[category] || defaultImg;
        handleInputChange('thumbnail', newUrl);
    };

    useEffect(() => {
        if (!isEditMode && courseData.category && !courseData.thumbnail) {
            generateThumbnail(courseData.category);
        }
    }, [courseData.category, isEditMode]);

    const addModule = (type) => {
        const newModule = {
            id: `module_${Date.now()}`,
            type: type,
            title: '',
            fileName: null,
            fileUrl: null,
            ...(type === 'presentation' && { slides: [{ id: 's1', content: '', minTime: 5 }] }),
            ...(type === 'video' && { videoUrl: '', duration: '', settings: { minWatchThreshold: 0.9, allowSeekForward: false } }),
            ...(type === 'quiz' && { questions: [{ id: 'q1', text: '', options: [{ id: 'a', text: '' }, { id: 'b', text: '' }], correctAnswer: 'a' }] })
        };
        setModules(prev => [...prev, newModule]);
    };

    const removeModule = (moduleId) => setModules(prev => prev.filter(m => m.id !== moduleId));

    const updateModule = (moduleId, field, value) => {
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, [field]: value } : m));
    };

    const handleFileUpload = async (moduleId, file) => {
        if (!file) return;

        // Simulate upload progress
        setUploading(prev => ({ ...prev, [moduleId]: 10 }));

        let progress = 10;
        const interval = setInterval(() => {
            progress += 20;
            if (progress >= 100) {
                clearInterval(interval);
                setUploading(prev => {
                    const newState = { ...prev };
                    delete newState[moduleId];
                    return newState;
                });
                // Update module with file info
                const mockUrl = file.type.startsWith('video')
                    ? 'https://www.w3schools.com/html/mov_bbb.mp4'
                    : 'https://example.com/mock-presentation.pdf';

                updateModule(moduleId, 'fileName', file.name);
                updateModule(moduleId, 'fileUrl', mockUrl);
                if (file.type.startsWith('video')) {
                    updateModule(moduleId, 'videoUrl', mockUrl);
                }
            } else {
                setUploading(prev => ({ ...prev, [moduleId]: progress }));
            }
        }, 400);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!courseData.title.trim()) newErrors.title = 'Заглавието е задължително';
        if (!courseData.category) newErrors.category = 'Категорията е задължителна';
        if (!courseData.department) newErrors.department = 'Отделът е задължителен';
        if (!courseData.duration.trim()) newErrors.duration = 'Продължителността е задължителна';
        if (modules.length === 0) newErrors.modules = 'Добавете поне един модул';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            alert('Моля, попълнете всички задължителни полета');
            return;
        }

        const dataToSave = {
            ...courseData,
            modules: modules,
            totalModules: modules.length
        };

        try {
            if (isEditMode) {
                await mockApi.updateCourse(id, dataToSave);
                alert('Обучението е обновено успешно!');
            } else {
                await mockApi.createCourse(dataToSave);
                alert('Обучението е създадено успешно!');
            }
            navigate('/admin/courses');
        } catch (error) {
            alert('Грешка при запазване: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '5rem', textAlign: 'center', fontSize: '1.2rem', color: '#6B7280' }}>
                Зареждане...
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/admin/courses')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#6B7280',
                        fontSize: '0.9rem',
                        marginBottom: '1rem'
                    }}
                >
                    <ChevronLeft size={16} /> Назад към списъка
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                            {isEditMode ? 'Редактиране на обучение' : 'Създаване на обучение'}
                        </h1>
                        <p style={{ color: '#6B7280', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                            {isEditMode ? 'Променете информацията за обучението' : 'Попълнете информацията за новото обучение'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => navigate('/admin/courses')}
                            style={{
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #D1D5DB',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <X size={18} /> Отказ
                        </button>
                        <button
                            onClick={handleSave}
                            style={{
                                backgroundColor: '#2563EB',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Save size={18} /> {isEditMode ? 'Обнови обучението' : 'Запази обучението'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div style={{ display: 'grid', gap: '2rem' }}>

                {/* Basic Information */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Основна информация</h2>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                Заглавие на обучението *
                            </label>
                            <input
                                type="text"
                                value={courseData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Въведете заглавие..."
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: errors.title ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                    fontSize: '0.95rem'
                                }}
                            />
                            {errors.title && <span style={{ color: '#DC2626', fontSize: '0.85rem' }}>{errors.title}</span>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                    Категория *
                                </label>
                                <select
                                    value={courseData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: errors.category ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="">Изберете категория</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                </select>
                                {errors.category && <span style={{ color: '#DC2626', fontSize: '0.85rem' }}>{errors.category}</span>}
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                    Отдел *
                                </label>
                                <select
                                    value={courseData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: errors.department ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                        fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="">Изберете отдел</option>
                                    {departments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                                </select>
                                {errors.department && <span style={{ color: '#DC2626', fontSize: '0.85rem' }}>{errors.department}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                    Лектор
                                </label>
                                <input
                                    type="text"
                                    value={courseData.lecturer}
                                    onChange={(e) => handleInputChange('lecturer', e.target.value)}
                                    placeholder="Име на лектор..."
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #D1D5DB',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                    Продължителност *
                                </label>
                                <input
                                    type="text"
                                    value={courseData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    placeholder="напр. 30 мин"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: errors.duration ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                        fontSize: '0.95rem'
                                    }}
                                />
                                {errors.duration && <span style={{ color: '#DC2626', fontSize: '0.85rem' }}>{errors.duration}</span>}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                Описание
                            </label>
                            <textarea
                                value={courseData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Кратко описание на обучението..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #D1D5DB',
                                    fontSize: '0.95rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={courseData.mandatory}
                                    onChange={(e) => handleInputChange('mandatory', e.target.checked)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Задължително обучение</span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={courseData.mode === 'compliance'}
                                    onChange={(e) => handleInputChange('mode', e.target.checked ? 'compliance' : 'flexible')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Compliance режим (строг контрол)</span>
                            </label>
                        </div>

                        {courseData.mode === 'compliance' && (
                            <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: '600' }}>Настройки за Compliance</h4>
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={courseData.settings.sequentialEnforcement}
                                            onChange={(e) => handleSettingsChange('sequentialEnforcement', e.target.checked)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <span style={{ fontSize: '0.85rem' }}>Последователно преминаване на модули</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="checkbox"
                                            checked={courseData.settings.resetOnFailure}
                                            onChange={(e) => handleSettingsChange('resetOnFailure', e.target.checked)}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        <span style={{ fontSize: '0.85rem' }}>Рестартиране при провал на тест</span>
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.85rem' }}>Максимален брой опити за тест:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={courseData.settings.maxQuizAttempts}
                                            onChange={(e) => handleSettingsChange('maxQuizAttempts', parseInt(e.target.value))}
                                            style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail / Cover Image */}
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Корица на обучението</h2>
                            <button
                                type="button"
                                onClick={() => generateThumbnail(courseData.category)}
                                style={{
                                    background: 'none', border: 'none', color: '#2563EB', fontWeight: '600',
                                    fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                                }}
                            >
                                <Loader size={14} /> Генерирай автоматично
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
                            <div style={{
                                width: '300px', height: '180px', borderRadius: '12px', overflow: 'hidden',
                                backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {courseData.thumbnail ? (
                                    <img
                                        src={courseData.thumbnail}
                                        alt="Course cover"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                                        <Upload size={32} style={{ marginBottom: '8px' }} />
                                        <div style={{ fontSize: '0.8rem' }}>Няма изображение</div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
                                        URL адрес на изображението
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={courseData.thumbnail}
                                            onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                                            placeholder="https://images.unsplash.com/..."
                                            style={{
                                                flex: 1, padding: '10px 12px', borderRadius: '8px',
                                                border: '1px solid #D1D5DB', fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
                                        Можете да поставите линк към всяко безплатно изображение (Unsplash, Pexels и др.)
                                    </p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem', color: '#4B5563' }}>
                                        Бързи предложения:
                                    </label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {[
                                            { label: 'Финанси', url: 'https://images.unsplash.com/photo-1554224155-9736b5cb9336?w=600&q=80' },
                                            { label: 'Технологии', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
                                            { label: 'Сигурност', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80' },
                                            { label: 'Офис', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
                                            { label: 'Екип', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80' }
                                        ].map((preset, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleInputChange('thumbnail', preset.url)}
                                                style={{
                                                    padding: '6px 12px', borderRadius: '20px', border: '1px solid #E5E7EB',
                                                    backgroundColor: courseData.thumbnail === preset.url ? '#EFF6FF' : 'white',
                                                    color: courseData.thumbnail === preset.url ? '#2563EB' : '#4B5563',
                                                    fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules Section */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Модули ({modules.length})</h2>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => addModule('presentation')}
                                style={{
                                    backgroundColor: '#EFF6FF',
                                    color: '#2563EB',
                                    border: '1px solid #BFDBFE',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <FileText size={16} /> Презентация
                            </button>
                            <button
                                onClick={() => addModule('video')}
                                style={{
                                    backgroundColor: '#F0FDF4',
                                    color: '#16A34A',
                                    border: '1px solid #BBF7D0',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Video size={16} /> Видео
                            </button>
                            <button
                                onClick={() => addModule('quiz')}
                                style={{
                                    backgroundColor: '#FEF3C7',
                                    color: '#D97706',
                                    border: '1px solid #FDE68A',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <HelpCircle size={16} /> Тест
                            </button>
                        </div>
                    </div>

                    {errors.modules && <div style={{ color: '#DC2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{errors.modules}</div>}

                    {modules.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                            <p>Все още няма добавени модули.</p>
                            <p style={{ fontSize: '0.9rem' }}>Използвайте бутоните по-горе, за да добавите съдържание.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {modules.map((module, index) => (
                                <div key={module.id} style={{
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    backgroundColor: '#F9FAFB'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                backgroundColor: module.type === 'presentation' ? '#2563EB' : module.type === 'video' ? '#16A34A' : '#D97706',
                                                color: 'white',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {module.type === 'presentation' ? 'Презентация' : module.type === 'video' ? 'Видео' : 'Тест'}
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Модул {index + 1}</span>
                                        </div>
                                        <button
                                            onClick={() => removeModule(module.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#DC2626',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <Trash2 size={16} /> Изтрий
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem', color: '#4B5563' }}>
                                                Заглавие на модула
                                            </label>
                                            <input
                                                type="text"
                                                value={module.title}
                                                onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                                                placeholder="Въведете заглавие..."
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #D1D5DB',
                                                    fontSize: '0.9rem',
                                                    backgroundColor: 'white'
                                                }}
                                            />
                                        </div>

                                        {(module.type === 'presentation' || module.type === 'video') && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem', color: '#4B5563' }}>
                                                    {module.type === 'presentation' ? 'Файл на презентация (PPT, PDF)' : 'Видео файл (MP4, WebM)'}
                                                </label>

                                                {module.fileName ? (
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        backgroundColor: 'white', padding: '10px 15px', borderRadius: '8px', border: '1px solid #10B981'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <CheckCircle size={18} color="#10B981" />
                                                            <span style={{ fontSize: '0.9rem', color: '#065F46' }}>{module.fileName}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                updateModule(module.id, 'fileName', null);
                                                                updateModule(module.id, 'fileUrl', null);
                                                            }}
                                                            style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '0.8rem' }}
                                                        >
                                                            Премахни
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ position: 'relative' }}>
                                                        <button
                                                            disabled={uploading[module.id]}
                                                            onClick={() => document.getElementById(`file-${module.id}`).click()}
                                                            style={{
                                                                width: '100%', padding: '15px', border: '2px dashed #D1D5DB', borderRadius: '10px',
                                                                backgroundColor: 'white', cursor: uploading[module.id] ? 'not-allowed' : 'pointer',
                                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                                                transition: 'border-color 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563EB'}
                                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1D5DB'}
                                                        >
                                                            {uploading[module.id] ? (
                                                                <>
                                                                    <Loader size={24} color="#2563EB" className="animate-spin" />
                                                                    <span style={{ fontSize: '0.85rem', color: '#2563EB' }}>Качване... {uploading[module.id]}%</span>
                                                                    <div style={{ width: '200px', height: '4px', backgroundColor: '#EFF6FF', borderRadius: '2px' }}>
                                                                        <div style={{ width: `${uploading[module.id]}%`, height: '100%', backgroundColor: '#2563EB', borderRadius: '2px' }}></div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload size={24} color="#6B7280" />
                                                                    <span style={{ fontSize: '0.85rem', color: '#374151' }}>Кликнете или пуснете файл тук</span>
                                                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Максимален размер: 50MB</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        <input
                                                            id={`file-${module.id}`}
                                                            type="file"
                                                            accept={module.type === 'presentation' ? '.ppt,.pptx,.pdf' : 'video/*'}
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileUpload(module.id, e.target.files[0])}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
