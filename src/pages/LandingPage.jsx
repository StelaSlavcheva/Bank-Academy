import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../lib/mockApi';
import { BookOpen, Award, TrendingUp, Users, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        satisfaction: 95,
        certificates: 0
    });

    useEffect(() => {
        // In a real app, this would be a public endpoint. 
        // Here we simulate fetching public stats from our mock API.
        const fetchPublicStats = async () => {
            const courses = await mockApi.getCourses();
            // Assuming hardcoded user count or fetching from users endpoint if exists
            // For demo, we default to "150+" style strings or raw numbers
            setStats({
                users: 150, // Mocked 
                courses: courses.length,
                satisfaction: 98,
                certificates: 125 // Mocked
            });
        };
        fetchPublicStats();
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

            {/* Navbar */}
            <nav style={{
                background: '#0F172A', // Dark Navy
                padding: '1.2rem 2rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <div style={{ background: '#FFCC00', padding: '6px', borderRadius: '6px', color: '#0F172A' }}>
                        <BookOpen size={20} />
                    </div>
                    BankAcademy
                </div>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)',
                        padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                >
                    Вход
                </button>
            </nav>

            {/* Hero Section */}
            <header style={{
                background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
                color: 'white',
                padding: '5rem 2rem',
                textAlign: 'center',
                flex: 1
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '6px 16px',
                        borderRadius: '99px', fontSize: '0.85rem', marginBottom: '1.5rem',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        ⭐ Платформа за професионално развитие
                    </div>

                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' }}>
                        Развивай уменията си с <br />
                        <span style={{ color: '#FFCC00' }}>BankAcademy</span>
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: '#94A3B8', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
                        Модерна платформа за вътрешно обучение, създадена да издигне професионалните ви умения
                        на следващото ниво. Открийте обучения, сертификации и кариерни пътеки.
                    </p>

                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                        <StatCard value={`${stats.users}+`} label="Активни потребители" />
                        <StatCard value={`${stats.courses}+`} label="Професионални обучения" />
                        <StatCard value={`${stats.satisfaction}%`} label="Удовлетвореност" />
                        <StatCard value={`${stats.certificates}+`} label="Издадени сертификати" />
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section style={{ background: '#1E293B', padding: '5rem 2rem', color: 'white', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Защо BankAcademy?</h2>
                <p style={{ color: '#94A3B8', marginBottom: '4rem' }}>Всичко необходимо за професионално развитие на едно място</p>

                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                    <FeatureCard
                        icon={BookOpen}
                        title="Разнообразни обучения"
                        desc="Над 150 професионални обучения, създадени специално за нуждите на финансовия сектор."
                    />
                    <FeatureCard
                        icon={Award}
                        title="Сертификации"
                        desc="Получете признати сертификати след успешно завършване на всяко обучение."
                    />
                    <FeatureCard
                        icon={TrendingUp}
                        title="Проследяване на прогреса"
                        desc="Детайлни отчети и статистики за вашето професионално развитие."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: '#0F172A', padding: '2rem', textAlign: 'center', color: '#475569', fontSize: '0.9rem' }}>
                © 2026 BankAcademy. Всички права запазени.
            </footer>
        </div>
    );
}

const StatCard = ({ value, label }) => (
    <div style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
    }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFCC00', marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{label}</div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div style={{
        background: '#334155',
        padding: '2.5rem',
        borderRadius: '12px',
        textAlign: 'left',
        transition: 'transform 0.2s',
        cursor: 'default'
    }}>
        <div style={{
            background: '#FFCC00', width: '50px', height: '50px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
            color: '#0F172A'
        }}>
            <Icon size={24} />
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>{title}</h3>
        <p style={{ color: '#94A3B8', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
    </div>
);
