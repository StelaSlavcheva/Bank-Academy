import React, { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mockApi';
import { Award, Download, Calendar, CheckCircle } from 'lucide-react';

export default function Certificates() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In mockApi, getCertificates is simple array.
        // We will use existing endpoint.
        mockApi.getStats().then(() => {
            // Mocking a richer list for this specific page view
            setTimeout(() => {
                setCertificates([
                    {
                        id: "CERT-2025-001",
                        title: "GDPR и Защита на личните данни",
                        issueDate: "15.01.2025",
                        expiryDate: "15.01.2026",
                        score: "95%",
                        status: "active"
                    },
                    {
                        id: "CERT-2025-042",
                        title: "Киберсигурност: Основи",
                        issueDate: "20.11.2025",
                        expiryDate: "20.11.2026",
                        score: "100%",
                        status: "active"
                    }
                ]);
                setLoading(false);
            }, 500);
        });
    }, []);

    const handleDownload = (certId) => {
        alert(`Генериране на PDF за сертификат ${certId}...`);
    };

    if (loading) return <div>Зареждане...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Моите сертификати</h1>
                <p style={{ color: '#6B7280' }}>
                    Преглед на получените сертификати и техния статус
                </p>
            </div>

            {/* Tabs / Filter Mock visualization */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #E5E7EB', marginBottom: '2rem' }}>
                <div style={{
                    paddingBottom: '1rem',
                    borderBottom: '2px solid #2563EB',
                    color: '#2563EB',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}>
                    Активни сертификати
                </div>
                <div style={{ paddingBottom: '1rem', color: '#6B7280', cursor: 'pointer' }}>
                    Изтекли
                </div>
            </div>

            {/* Certificates List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {certificates.map(cert => (
                    <div key={cert.id} className="card" style={{ padding: '0', display: 'flex', overflow: 'hidden' }}>
                        {/* Left Status Stripe */}
                        <div style={{ width: '6px', background: '#10B981' }}></div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>

                            {/* Icon */}
                            <div style={{
                                width: '50px', height: '50px',
                                borderRadius: '50%', background: '#DEF7EC',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#03543F'
                            }}>
                                <Award size={28} />
                            </div>

                            {/* Main Info */}
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{cert.title}</h3>
                                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>ID: {cert.id}</div>
                            </div>

                            {/* Dates */}
                            <div style={{ display: 'flex', gap: '2rem', marginRight: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '4px' }}>Издаден на</div>
                                    <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Calendar size={14} /> {cert.issueDate}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '4px' }}>Валиден до</div>
                                    <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <CheckCircle size={14} color="#10B981" /> {cert.expiryDate}
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div>
                                <button
                                    className="btn-continue"
                                    style={{ background: 'white', border: '1px solid #E5E7EB', color: '#374151' }}
                                    onClick={() => handleDownload(cert.id)}
                                >
                                    <Download size={16} />
                                    Изтегли PDF
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
