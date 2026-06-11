import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { teacherAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, ShieldAlert } from 'lucide-react';

const AddTeacherPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Check if editing via route state
  const editTeacherData = location.state?.teacher;
  const isEditMode = !!editTeacherData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    standard: '',
    isActive: true,
  });

  useEffect(() => {
    if (isEditMode && editTeacherData) {
      setFormData({
        username: editTeacherData.username || '',
        password: '', // Leave blank when editing unless changing it
        fullName: editTeacherData.fullName || '',
        standard: editTeacherData.standard !== null ? editTeacherData.standard.toString() : '',
        isActive: editTeacherData.isActive !== undefined ? editTeacherData.isActive : true,
      });
    }
  }, [editTeacherData, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.fullName) {
      setError('કૃપા કરીને યુઝરનેમ અને શિક્ષકનું નામ દાખલ કરો.');
      return;
    }
    if (!isEditMode && !formData.password) {
      setError('કૃપા કરીને પ્રવેશ માટે પાસવર્ડ દાખલ કરો.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        username: formData.username,
        fullName: formData.fullName,
        isActive: formData.isActive,
        standard: formData.standard !== '' ? formData.standard.toString() : null,
      };

      // Only include password if provided (for both create and edit)
      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await teacherAPI.update(editTeacherData.id, payload);
        alert('શિક્ષકની વિગતો સફળતાપૂર્વક અપડેટ કરવામાં આવી છે.');
      } else {
        await teacherAPI.create(payload);
        alert('નવા શિક્ષક સફળતાપૂર્વક ઉમેરવામાં આવ્યા છે.');
      }
      navigate('/teachers');
    } catch (err) {
      console.error('Error saving teacher:', err);
      setError(err.response?.data?.message || 'શિક્ષક વિગતો સાચવવામાં ક્ષતિ આવી. યુઝરનેમ અજોડ હોવું જોઈએ.');
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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/teachers')} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>
            {isEditMode ? 'શિક્ષકની વિગત સુધારો' : 'નવા શિક્ષક ઉમેરો'}
          </h1>
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ padding: '12px', borderRadius: '6px' }}>{error}</div>}

      {/* Form Container */}
      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">યુઝરનેમ / લોગીન આઈડી *</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="દા.ત. teacher_class1"
              value={formData.username}
              onChange={handleChange}
              disabled={isEditMode}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              પાસવર્ડ {isEditMode ? '(ખાલી રાખવાથી પાસવર્ડ બદલાશે નહીં)' : '*'}
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="પાસવર્ડ લખો"
              value={formData.password}
              onChange={handleChange}
              required={!isEditMode}
            />
          </div>

          <div className="form-group">
            <label className="form-label">શિક્ષકનું પૂરું નામ *</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="શિક્ષકનું પૂરું નામ લખો"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">જવાબદારીનું ધોરણ (વર્ગ શિક્ષક)</label>
            <select
              name="standard"
              className="form-control"
              value={formData.standard}
              onChange={handleChange}
            >
              <option value="">કોઈ નહીં (વર્ગ શિક્ષક નથી)</option>
              <option value="0">બાલવાટિકા</option>
              <option value="1">ધોરણ ૧</option>
              <option value="2">ધોરણ ૨</option>
              <option value="3">ધોરણ ૩</option>
              <option value="4">ધોરણ ૪</option>
              <option value="5">ધોરણ ૫</option>
              <option value="6">ધોરણ ૬</option>
              <option value="7">ધોરણ ૭</option>
              <option value="8">ધોરણ ૮</option>
            </select>
          </div>

          <div style={checkboxWrapperStyle}>
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={checkboxStyle}
            />
            <label htmlFor="isActive" style={checkboxLabelStyle}>
              લોગીન એક્ટિવ છે (Is Active)
            </label>
          </div>

          <div style={footerButtonsStyle}>
            <Link to="/teachers" className="btn btn-secondary" style={{ width: '120px' }}>
              રદ કરો
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '160px' }}
              disabled={loading}
            >
              <Save size={18} /> {loading ? 'સાચવી રહ્યું છે...' : 'માહિતી સાચવો'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const checkboxWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '0.5rem',
};

const checkboxStyle = {
  width: '18px',
  height: '18px',
  cursor: 'pointer',
};

const checkboxLabelStyle = {
  fontSize: '0.95rem',
  fontWeight: '500',
  color: '#e2e8f0',
  cursor: 'pointer',
  userSelect: 'none',
};

const footerButtonsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '1.5rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: '1.25rem',
};

export default AddTeacherPage;
