import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Check, X, ChevronDown, ChevronUp, AlertTriangle, Lock } from 'lucide-react';
import { mockApi } from '../../lib/mockApi';

export default function Nomenclatures() {
    const [nomenclatures, setNomenclatures] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedNomenclature, setExpandedNomenclature] = useState(null);
    const [editingValue, setEditingValue] = useState(null);
    const [showAddNomenclature, setShowAddNomenclature] = useState(false);
    const [showAddValue, setShowAddValue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadNomenclatures = async () => {
            try {
                const data = await mockApi.getNomenclatures();
                setNomenclatures(data);
            } catch (error) {
                console.error('Failed to load nomenclatures:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNomenclatures();
    }, []);

    const filteredNomenclatures = nomenclatures.filter(nom =>
        nom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nom.uniqueCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleExpand = (nomId) => {
        setExpandedNomenclature(expandedNomenclature === nomId ? null : nomId);
    };

    const handleToggleStatus = (nomenclatureId, valueId) => {
        setNomenclatures(prev => prev.map(nom => {
            if (nom.id === nomenclatureId) {
                return {
                    ...nom,
                    values: nom.values.map(val =>
                        val.id === valueId ? { ...val, isActive: !val.isActive } : val
                    )
                };
            }
            return nom;
        }));
    };

    const handleDeleteValue = (nomenclatureId, value) => {
        if (value.usageCount > 0) {
            alert(`Не може да се изтрие. Използва се в ${value.usageCount} записа.`);
            return;
        }

        if (confirm(`Сигурни ли сте, че искате да изтриете "${value.name}"?`)) {
            setNomenclatures(prev => prev.map(nom => {
                if (nom.id === nomenclatureId) {
                    return {
                        ...nom,
                        values: nom.values.map(val =>
                            val.id === value.id ? { ...val, isActive: false } : val
                        )
                    };
                }
                return nom;
            }));
        }
    };

    const handleSaveInlineEdit = (nomenclatureId, valueId, field, newValue) => {
        setNomenclatures(prev => prev.map(nom => {
            if (nom.id === nomenclatureId) {
                return {
                    ...nom,
                    values: nom.values.map(val =>
                        val.id === valueId ? { ...val, [field]: newValue } : val
                    )
                };
            }
            return nom;
        }));
        setEditingValue(null);
    };

    const handleReorder = (nomenclatureId, valueId, direction) => {
        setNomenclatures(prev => prev.map(nom => {
            if (nom.id === nomenclatureId) {
                const values = [...nom.values].sort((a, b) => a.sortOrder - b.sortOrder);
                const index = values.findIndex(v => v.id === valueId);

                if (direction === 'up' && index > 0) {
                    [values[index], values[index - 1]] = [values[index - 1], values[index]];
                } else if (direction === 'down' && index < values.length - 1) {
                    [values[index], values[index + 1]] = [values[index + 1], values[index]];
                }

                // Update sortOrder
                values.forEach((val, idx) => val.sortOrder = idx + 1);

                return { ...nom, values };
            }
            return nom;
        }));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                            Управление на номенклатури
                        </h1>
                        <p style={{ color: '#6B7280', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                            Създаване и управление на системни номенклатури
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddNomenclature(true)}
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
                        <Plus size={18} /> Нова номенклатура
                    </button>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={20} />
                    <input
                        type="text"
                        placeholder="Търси номенклатура..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 10px 10px 40px',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
            </div>

            {/* Nomenclatures List */}
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredNomenclatures.map(nom => (
                    <div key={nom.id} style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        overflow: 'hidden'
                    }}>
                        {/* Nomenclature Header */}
                        <div
                            onClick={() => handleToggleExpand(nom.id)}
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: '#F9FAFB',
                                borderBottom: expandedNomenclature === nom.id ? '1px solid #E5E7EB' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {expandedNomenclature === nom.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{nom.name}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                            Код: <code style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>{nom.uniqueCode}</code>
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                                            Стойности: {nom.values.filter(v => v.isActive).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    backgroundColor: nom.isActive ? '#DCFCE7' : '#F3F4F6',
                                    color: nom.isActive ? '#15803D' : '#6B7280'
                                }}>
                                    {nom.isActive ? 'Активна' : 'Неактивна'}
                                </span>
                            </div>
                        </div>

                        {/* Values Table */}
                        {expandedNomenclature === nom.id && (
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Стойности</h4>
                                    <button
                                        onClick={() => setShowAddValue(nom.id)}
                                        style={{
                                            backgroundColor: '#EFF6FF',
                                            color: '#2563EB',
                                            border: '1px solid #BFDBFE',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Plus size={14} /> Добави стойност
                                    </button>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Ред</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Име</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Уникален код</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Използвания</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Статус</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nom.values.sort((a, b) => a.sortOrder - b.sortOrder).map((value, index) => (
                                            <tr key={value.id} style={{
                                                borderBottom: '1px solid #F3F4F6',
                                                opacity: value.isActive ? 1 : 0.5
                                            }}>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <button
                                                            onClick={() => handleReorder(nom.id, value.id, 'up')}
                                                            disabled={index === 0}
                                                            style={{
                                                                background: 'none',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '4px',
                                                                padding: '2px 6px',
                                                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                                fontSize: '0.75rem'
                                                            }}
                                                        >
                                                            ▲
                                                        </button>
                                                        <button
                                                            onClick={() => handleReorder(nom.id, value.id, 'down')}
                                                            disabled={index === nom.values.length - 1}
                                                            style={{
                                                                background: 'none',
                                                                border: '1px solid #E5E7EB',
                                                                borderRadius: '4px',
                                                                padding: '2px 6px',
                                                                cursor: index === nom.values.length - 1 ? 'not-allowed' : 'pointer',
                                                                fontSize: '0.75rem'
                                                            }}
                                                        >
                                                            ▼
                                                        </button>
                                                        <span style={{ marginLeft: '8px', color: '#6B7280' }}>{value.sortOrder}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>
                                                    {editingValue === value.id ? (
                                                        <input
                                                            type="text"
                                                            defaultValue={value.name}
                                                            onBlur={(e) => handleSaveInlineEdit(nom.id, value.id, 'name', e.target.value)}
                                                            autoFocus
                                                            style={{
                                                                padding: '4px 8px',
                                                                border: '1px solid #2563EB',
                                                                borderRadius: '4px',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        />
                                                    ) : (
                                                        <span onDoubleClick={() => setEditingValue(value.id)}>{value.name}</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <code style={{ backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                                                        {value.uniqueCode}
                                                    </code>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                        {value.usageCount > 0 && <Lock size={14} color="#F59E0B" />}
                                                        <span style={{ fontWeight: '600', color: value.usageCount > 0 ? '#F59E0B' : '#6B7280' }}>
                                                            {value.usageCount}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleToggleStatus(nom.id, value.id)}
                                                        style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '99px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            backgroundColor: value.isActive ? '#DCFCE7' : '#F3F4F6',
                                                            color: value.isActive ? '#15803D' : '#6B7280'
                                                        }}
                                                    >
                                                        {value.isActive ? 'Активна' : 'Неактивна'}
                                                    </button>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button
                                                            onClick={() => setEditingValue(value.id)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: '4px',
                                                                color: '#2563EB'
                                                            }}
                                                            title="Редактирай"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteValue(nom.id, value)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: value.usageCount > 0 ? 'not-allowed' : 'pointer',
                                                                padding: '4px',
                                                                color: value.usageCount > 0 ? '#9CA3AF' : '#DC2626'
                                                            }}
                                                            title={value.usageCount > 0 ? `Използва се в ${value.usageCount} записа` : 'Изтрий'}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {nom.values.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>
                                        Няма добавени стойности
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredNomenclatures.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
                    <p>Няма намерени номенклатури</p>
                </div>
            )}

            {/* Add Nomenclature Modal */}
            {showAddNomenclature && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Нова номенклатура</h3>
                            <button
                                onClick={() => setShowAddNomenclature(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const newNom = {
                                id: `nom_${Date.now()}`,
                                name: formData.get('name'),
                                uniqueCode: formData.get('uniqueCode'),
                                description: formData.get('description'),
                                isActive: true,
                                createdBy: 'admin',
                                createdAt: new Date(),
                                values: []
                            };
                            setNomenclatures(prev => [...prev, newNom]);
                            setShowAddNomenclature(false);
                        }}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                        Име *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                        Уникален код *
                                    </label>
                                    <input
                                        type="text"
                                        name="uniqueCode"
                                        required
                                        placeholder="UPPERCASE_CODE"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                        Описание
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.9rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddNomenclature(false)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #D1D5DB',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Отказ
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: '#2563EB',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Създай
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Value Modal */}
            {showAddValue && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Добави стойност</h3>
                            <button
                                onClick={() => setShowAddValue(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const nom = nomenclatures.find(n => n.id === showAddValue);
                            const newValue = {
                                id: Date.now(),
                                nomenclatureId: showAddValue,
                                name: formData.get('name'),
                                uniqueCode: formData.get('uniqueCode'),
                                sortOrder: nom.values.length + 1,
                                isActive: true,
                                usageCount: 0
                            };

                            setNomenclatures(prev => prev.map(n =>
                                n.id === showAddValue
                                    ? { ...n, values: [...n.values, newValue] }
                                    : n
                            ));
                            setShowAddValue(null);
                        }}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                        Име *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                        Уникален код *
                                    </label>
                                    <input
                                        type="text"
                                        name="uniqueCode"
                                        required
                                        placeholder="UNIQUE_CODE"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #D1D5DB',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowAddValue(null)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: '1px solid #D1D5DB',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Отказ
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: '#2563EB',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Добави
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
