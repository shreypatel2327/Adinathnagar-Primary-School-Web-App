import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { studentAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Edit2, 
  UserMinus, 
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';

const StudentListPage = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState(user?.role === 'TEACHER' ? user.standard || '' : '');
  const [selectedGender, setSelectedGender] = useState('');
  
  // Javak Modal State
  const [javakModalOpen, setJavakModalOpen] = useState(false);
  const [selectedStudentForJavak, setSelectedStudentForJavak] = useState(null);
  const [leavingDate, setLeavingDate] = useState(new Date().toISOString().split('T')[0]);
  const [destinationSchool, setDestinationSchool] = useState('');
  const [remarks, setRemarks] = useState('');
  const [javakSubmitting, setJavakSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
    if (user?.role === 'TEACHER') {
      setSelectedStandard(user.standard || '');
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getAll(); // Standard and gender filters are applied locally
      setStudents(data);
      setError('');
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('વિદ્યાર્થીઓ મેળવવામાં ભૂલ આવી છે.');
    } finally {
      setLoading(false);
    }
  };

  // Local filtering for search, standard, and gender so it filters instantly
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    const gr = student.grNo?.toString() || '';
    const name = student.fullName?.toLowerCase() || '';
    const matchesSearch = name.includes(term) || gr.includes(term);

    const matchesStandard = selectedStandard === '' || student.standard?.toString() === selectedStandard;
    const matchesGender = selectedGender === '' || student.gender === selectedGender;

    return matchesSearch && matchesStandard && matchesGender;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`શું તમે ખરેખર વિદ્યાર્થી "${name}" ને રદ કરવા માંગો છો? આ ક્રિયા પાછી ખેંચી શકાશે નહીં.`)) {
      try {
        await studentAPI.delete(id);
        showToast('વિદ્યાર્થી સફળતાપૂર્વક રદ કરવામાં આવ્યો છે.', 'success');
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        showToast('વિદ્યાર્થી રદ કરવામાં નિષ્ફળતા.', 'error');
      }
    }
  };

  const openJavakModal = (student) => {
    setSelectedStudentForJavak(student);
    setJavakModalOpen(true);
    setLeavingDate(new Date().toISOString().split('T')[0]);
    setDestinationSchool('');
    setRemarks('');
  };

  const closeJavakModal = () => {
    setJavakModalOpen(false);
    setSelectedStudentForJavak(null);
  };

  const handleJavakSubmit = async (e) => {
    e.preventDefault();
    if (!leavingDate || !destinationSchool) {
      showToast('કૃપા કરીને જવા તારીખ અને નવી શાળાનું નામ દાખલ કરો.', 'warning');
      return;
    }

    try {
      setJavakSubmitting(true);
      await studentAPI.markJavak(selectedStudentForJavak.id, {
        leavingDate,
        destinationSchool,
        remarks
      });
      showToast('વિદ્યાર્થીને સફળતાપૂર્વક જાવક તરીકે માર્ક કરેલ છે.', 'success');
      closeJavakModal();
      fetchStudents(); // Refresh
    } catch (err) {
      console.error('Error marking javak:', err);
      showToast('જાવક પ્રક્રિયામાં ક્ષતિ આવી.', 'error');
    } finally {
      setJavakSubmitting(false);
    }
  };

  const standards = [
    { value: '0', label: 'બાલવાટિકા' },
    { value: '1', label: 'ધોરણ ૧' },
    { value: '2', label: 'ધોરણ ૨' },
    { value: '3', label: 'ધોરણ ૩' },
    { value: '4', label: 'ધોરણ ૪' },
    { value: '5', label: 'ધોરણ ૫' },
    { value: '6', label: 'ધોરણ ૬' },
    { value: '7', label: 'ધોરણ ૭' },
    { value: '8', label: 'ધોરણ ૮' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top bar header with quick link to add student */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>વિદ્યાર્થીઓ સંચાલન</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>હાલમાં અભ્યાસ કરતા તમામ વિદ્યાર્થીઓની યાદી</p>
        </div>
        <Link to="/students/add" className="btn btn-primary">
          <UserPlus size={18} /> વિદ્યાર્થી ઉમેરો
        </Link>
      </div>

      {/* Filter and Search controls */}
      <div className="glass-card" style={filtersCardStyle}>
        <div style={searchContainerStyle}>
          <Search size={18} style={searchIconStyle} />
          <input
            type="text"
            className="form-control"
            placeholder="જી.આર. નંબર અથવા નામથી શોધો..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px', width: '100%' }}
          />
        </div>

        <div style={selectsContainerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <Filter size={16} color="#94a3b8" />
            <select
              className="form-control"
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              disabled={user?.role === 'TEACHER'}
              style={{ width: '100%' }}
            >
              <option value="">તમામ ધોરણ</option>
              {standards.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <select
            className="form-control"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            style={{ width: '100%', flex: 1 }}
          >
            <option value="">તમામ જાતિ</option>
            <option value="Boy">કુમાર (Boy)</option>
            <option value="Girl">કન્યા (Girl)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>વિદ્યાર્થીઓ લોડ થઈ રહ્યા છે...</div>
      ) : error ? (
        <div className="badge badge-danger" style={{ padding: '12px', borderRadius: '6px' }}>{error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          કોઈ વિદ્યાર્થી મળ્યા નથી.
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>જી.આર. નં</th>
                <th>નામ</th>
                <th>જાતિ</th>
                <th>ધોરણ</th>
                <th>જન્મ તારીખ</th>
                <th>મોબાઈલ નં</th>
                <th style={{ textAlign: 'center' }}>ક્રિયાઓ</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td style={{ fontWeight: '600', color: '#2b8cee' }}>{student.grNo}</td>
                  <td>
                    <Link to={`/students/${student.id}`} style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {student.fullName}
                    </Link>
                  </td>
                  <td>
                    <span className={`badge ${student.gender === 'Boy' ? 'badge-success' : 'badge-warning'}`}>
                      {student.gender === 'Boy' ? 'કુમાર' : 'કન્યા'}
                    </span>
                  </td>
                  <td>{student.standard === 0 ? 'બાલવાટિકા' : `ધોરણ ${student.standard}`}</td>
                  <td>{student.dob ? new Date(student.dob).toLocaleDateString('gu-IN') : '-'}</td>
                  <td>{student.mobile || '-'}</td>
                  <td>
                    <div style={actionsContainerStyle}>
                      <Link 
                        to={`/students/${student.id}`} 
                        className="btn btn-secondary" 
                        style={actionIconButtonStyle}
                        title="વિગતો જુઓ"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link 
                        to={`/students/edit/${student.id}`} 
                        className="btn btn-secondary" 
                        style={{ ...actionIconButtonStyle, color: '#f59e0b' }}
                        title="સુધારો કરો"
                      >
                        <Edit2 size={16} />
                      </Link>
                      {isAdmin && (
                        <button 
                          onClick={() => openJavakModal(student)} 
                          className="btn btn-secondary" 
                          style={{ ...actionIconButtonStyle, color: '#f43f5e' }}
                          title="જાવક (દાખલ કમી)"
                        >
                          <UserMinus size={16} />
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(student.id, student.fullName)} 
                          className="btn btn-secondary" 
                          style={{ ...actionIconButtonStyle, color: '#ef4444' }}
                          title="કાઢી નાખો"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Javak Modal Overlay */}
      {javakModalOpen && (
        <div style={modalOverlayStyle}>
          <div className="glass-card animate-fade-in" style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#f43f5e" /> વિદ્યાર્થી કમી કરો (જાવક નોંધ)
              </h2>
              <button onClick={closeJavakModal} style={modalCloseButtonStyle}>
                <X size={20} />
              </button>
            </div>

            <div style={{ margin: '1rem 0', padding: '10px', backgroundColor: 'rgba(244, 63, 94, 0.05)', borderRadius: '6px', fontSize: '0.9rem', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.15)' }}>
              વિદ્યાર્થી: <strong>{selectedStudentForJavak?.fullName}</strong> (જી.આર. નં: {selectedStudentForJavak?.grNo})
            </div>

            <form onSubmit={handleJavakSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">કમી કર્યાની (જાવક) તારીખ *</label>
                <input
                  type="date"
                  className="form-control"
                  value={leavingDate}
                  onChange={(e) => setLeavingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">ગયેલ શાળાનું નામ *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ગયેલ પ્રાથમિક/માધ્યમિક શાળાનું નામ લખો"
                  value={destinationSchool}
                  onChange={(e) => setDestinationSchool(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">ખાસ નોંધ / કારણ (વૈકલ્પિક)</label>
                <textarea
                  className="form-control"
                  placeholder="કમી કરવાનું કારણ અથવા અન્ય રીમાર્ક લખો"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows="3"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={modalFooterStyle}>
                <button type="button" onClick={closeJavakModal} className="btn btn-secondary" style={{ flex: 1 }}>
                  બંધ કરો
                </button>
                <button type="submit" className="btn btn-danger" style={{ flex: 1 }} disabled={javakSubmitting}>
                  {javakSubmitting ? 'પ્રોસેસ ચાલુ છે...' : 'જાવક નોંધો'}
                </button>
              </div>
            </form>
          </div>
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

const filtersCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1.5rem',
  flexWrap: 'wrap',
};

const searchContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: '2 1 400px',
};

const searchIconStyle = {
  position: 'absolute',
  left: '12px',
  color: '#64748b',
};

const selectsContainerStyle = {
  display: 'flex',
  gap: '1rem',
  flex: '1 1 300px',
  width: '100%',
};

const actionsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '6px',
};

const actionIconButtonStyle = {
  padding: '6px',
  borderRadius: '4px',
  color: '#2b8cee',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// Modal Overlay Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '460px',
  padding: '2rem',
  backgroundColor: 'var(--bg-secondary)',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  paddingBottom: '0.75rem',
};

const modalCloseButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: '4px',
};

const modalFooterStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1.5rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: '1rem',
};

export default StudentListPage;
