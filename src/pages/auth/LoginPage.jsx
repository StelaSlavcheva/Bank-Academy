import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        console.log("Attempting login with:", email);

        try {
            const result = await login(email, password);
            console.log("Login result:", result);

            if (result.success) {
                console.log("Navigating to dashboard...");
                navigate('/dashboard');
            } else {
                setError('Невалидни данни. Моля опитайте отново.');
            }
        } catch (err) {
            console.error("Login exception:", err);
            setError("Възникна грешка при входа.");
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Bank Academy</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Secure Employee Portal</p>
                </div>

                {error && (
                    <div style={{
                        background: '#FED7D7',
                        color: '#C53030',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem'
                            }}
                            placeholder="user@bank.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                fontSize: '1rem'
                            }}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In with SSO'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Tip: Use any email to sign in (Mock Mode)
                </div>
            </div>
        </div>
    );
}
