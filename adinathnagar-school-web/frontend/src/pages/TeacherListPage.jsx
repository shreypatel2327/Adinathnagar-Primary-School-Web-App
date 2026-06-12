import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teacherAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Edit2, ShieldAlert } from 'lucide-react';

const TeacherListPage = () => {
  const { user, isAdmin } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchTeachers();
    }
  }, [isAdmin]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherAPI.getAll();
      setTeachers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('શિક્ષકોની યાદી મેળવવામાં ક્ષતિ આવી.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', padding: '3rem', margin: '2rem auto', maxWidth: '500px' }}>
        <ShieldAlert size={48} color="#f43f5e" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f43f5e' }}>અપ્રવેશ્ય (Access Denied)</h2>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>આ પેજ માત્ર એડમિનિસ્ટ્રેટર માટે જ ઉપલબ્ધ છે.</p>
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>ડેસ્કબોર્ડ પર જાઓ</Link>
      </div>
    );
  }

  const getStandardLabel = (std) => {
    if (std === null || std === undefined || std === '') return '-';
    if (std === 0 || std === '0') return 'બાલવાટિકા';
    return `ધોરણ ${std}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>શિક્ષક વ્યવસ્થાપન</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>શાળાના તમામ શિક્ષક લોગીન આઈડી અને ધોરણ ફાળવણી</p>
        </div>
        <Link to="/teachers/add" className="btn btn-primary">
          <UserPlus size={18} /> શિક્ષક ઉમેરો
        </Link>
      </div>

      {error && <div className="badge badge-danger" style={{ padding: '12px', borderRadius: '6px' }}>{error}</div>}

      {/* Teachers list table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>લોડ થઈ રહ્યું છે...</div>
      ) : teachers.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          હજુ સુધી કોઈ શિક્ષક નોંધાયેલ નથી.
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>યુઝરનેમ (ID)</th>
                <th>પૂરું નામ</th>
                <th>ફાળવેલ ધોરણ</th>
                <th>સ્થિતિ (Status)</th>
                <th style={{ textAlign: 'center' }}>ક્રિયા</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: '600', color: '#2b8cee' }}>{t.username}</td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{t.fullName}</td>
                  <td>
                    <span className="badge badge-warning" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)' }}>
                      {getStandardLabel(t.standard)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${t.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {t.isActive ? 'સક્રિય (Active)' : 'નિષ્ક્રિય'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {/* In our backend, edit teacher handles via the PUT teacher path, let's navigate to edit page with state or id */}
                    <Link 
                      to={`/teachers/add`} 
                      state={{ teacher: t }}
                      className="btn btn-secondary" 
                      style={actionIconButtonStyle}
                      title="વિગત સુધારો"
                    >
                      <Edit2 size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const actionIconButtonStyle = {
  padding: '6px',
  borderRadius: '4px',
  color: '#2b8cee',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default TeacherListPage;
