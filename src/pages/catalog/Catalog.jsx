import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../lib/mockApi';
import { Search, Filter, Clock, BookOpen, Play } from 'lucide-react';

export default function Catalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("Всички");
    const navigate = useNavigate();

    useEffect(() => {
        mockApi.getCourses().then(data => {
            setCourses(data);
            setLoading(false);
        });
    }, []);

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Всички" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Specific Categories from requirement
    const categories = [
        "Всички категории",
        "Плащания",
        "Кредити",
        "Сметки и депозити",
        "GDPR",
        "Карти",
        "Сигурност",
        "AML",
        "Дигитализация"
    ];

    if (loading) return <div>Зареждане...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Каталог обучения</h1>

            {/* Toolbar */}
            <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>

                {/* Search */}
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        placeholder="Търси обучения..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.6rem 0.6rem 2.5rem',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>

                {/* Filter Dropdown */}
                <div style={{ position: 'relative', minWidth: '200px' }}>
                    <Filter size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#6B7280' }} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 0.6rem 0.6rem 2.5rem',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat === "Всички категории" ? "Всички" : cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Course Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filteredCourses.map(course => (
                    <div key={course.id} className="course-card">
                        <img src={course.thumbnail} alt={course.title} className="course-image" />
                        <div className="course-content">
                            <span className="badge-cat">{course.category}</span>
                            <h3 className="course-title">{course.title}</h3>

                            <div className="course-meta">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> {course.duration}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <BookOpen size={14} /> {course.totalModules} урока
                                </span>
                            </div>

                            {/* Progress if started, else Start Button */}
                            {course.progress > 0 ? (
                                <>
                                    <div className="progress-track" style={{ marginTop: 'auto' }}>
                                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                    <div className="progress-text">
                                        <span>Прогрес</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <button
                                        className="btn-continue"
                                        onClick={() => navigate(`/course/${course.id}`)}
                                    >
                                        <Play size={16} fill="white" />
                                        Продължи
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn-continue"
                                    style={{ marginTop: 'auto' }}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    Започни обучение
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {filteredCourses.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                        Няма намерени обучения по тези критерии.
                    </div>
                )}
            </div>
        </div>
    );
}
