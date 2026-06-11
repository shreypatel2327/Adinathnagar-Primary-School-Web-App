import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registerAPI } from '../api/api';
import { Search, Filter, Download, Eye, School } from 'lucide-react';

const AavakRegisterPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchAavakRegister();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedStandard, selectedYear, students]);

  const fetchAavakRegister = async () => {
    try {
      setLoading(true);
      const data = await registerAPI.getAavak();
      setStudents(data);
      setFilteredStudents(data);
      setError('');
    } catch (err) {
      console.error('Error fetching aavak register:', err);
      setError('આવક રજીસ્ટર લોડ કરવામાં ક્ષતિ આવી.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let temp = [...students];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(s => 
        (s.fullName || '').toLowerCase().includes(term) || 
        (s.grNo || '').toString().includes(term)
      );
    }

    // Standard filter
    if (selectedStandard !== '') {
      temp = temp.filter(s => s.standard?.toString() === selectedStandard);
    }

    // Year filter
    if (selectedYear !== '') {
      temp = temp.filter(s => {
        if (!s.admissionDate) return false;
        const year = new Date(s.admissionDate).getFullYear().toString();
        return year === selectedYear;
      });
    }

    setFilteredStudents(temp);
  };

  // Convert English numbers to Gujarati digits
  const toGujaratiNumbers = (num) => {
    if (num === null || num === undefined) return '';
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return num.toString().split('').map(char => {
      const idx = englishDigits.indexOf(char);
      return idx !== -1 ? gujaratiDigits[idx] : char;
    }).join('');
  };

  // Extract unique admission years from students list
  const getUniqueYears = () => {
    const years = students
      .map(s => s.admissionDate ? new Date(s.admissionDate).getFullYear().toString() : null)
      .filter((y, idx, self) => y && self.indexOf(y) === idx);
    return years.sort((a, b) => b.localeCompare(a));
  };

  // Export to CSV/Excel helper
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = [
      'Gr No (જી.આર. નં)', 
      'Standard (ધોરણ)', 
      'Full Name (વિદ્યાર્થીનું નામ)', 
      'Gender (જાતિ)', 
      'DOB (જન્મ તારીખ)', 
      'Birth Place (જન્મ સ્થળ)', 
      'Caste (જ્ઞાતિ)', 
      'Category (કેટેગરી)', 
      'Address (સરનામું)', 
      'Mobile (મોબાઈલ નંબર)',
      'Previous School (અગાઉની શાળા)',
      'Admission Date (દાખલ તારીખ)',
      'Academic Year (શૈક્ષણિક વર્ષ)'
    ];

    const rows = filteredStudents.map((s, idx) => [
      s.grNo || '',
      s.standard === 0 ? 'Balwatika' : `Std ${s.standard}`,
      s.fullName || '',
      s.gender === 'Boy' ? 'Boy' : 'Girl',
      s.dob ? new Date(s.dob).toLocaleDateString('en-GB') : '',
      s.birthPlace || '',
      s.caste || '',
      s.category || '',
      `"${(s.address || '').replace(/"/g, '""')}"`,
      s.mobile || '',
      `"${(s.prevSchool || '').replace(/"/g, '""')}"`,
      s.admissionDate ? new Date(s.admissionDate).toLocaleDateString('en-GB') : '',
      s.academicYear || ''
    ]);

    // Use BOM for UTF-8 Gujarati characters support in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aavak_register_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>આવક રજીસ્ટર (Admission Register)</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>પ્રવેશ મેળવનાર તમામ વિદ્યાર્થીઓની વિગતો</p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-secondary" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }} disabled={filteredStudents.length === 0}>
          <Download size={18} /> એક્સેલ નિકાસ (Excel Export)
        </button>
      </div>

      {/* Filters Card */}
      <div className="glass-card" style={filtersCardStyle}>
        <div style={searchContainerStyle}>
          <Search size={18} style={searchIconStyle} />
          <input
            type="text"
            className="form-control"
            placeholder="નામ અથવા જી.આર. નં. થી શોધો..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px', width: '100%' }}
          />
        </div>

        <div style={selectsContainerStyle}>
          <select
            className="form-control"
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            style={{ width: '100%', flex: 1 }}
          >
            <option value="">તમામ ધોરણ</option>
            {standards.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            className="form-control"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ width: '100%', flex: 1 }}
          >
            <option value="">તમામ પ્રવેશ વર્ષ</option>
            {getUniqueYears().map(y => (
              <option key={y} value={y}>{toGujaratiNumbers(y)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Count Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
          કુલ વિદ્યાર્થીઓ: <strong style={{ color: '#2b8cee' }}>{toGujaratiNumbers(filteredStudents.length)}</strong>
        </h2>
      </div>

      {/* Data Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>લોડ થઈ રહ્યું છે...</div>
      ) : error ? (
        <div className="badge badge-danger" style={{ padding: '12px', borderRadius: '6px' }}>{error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          કોઈ પ્રવેશ નોંધ મળી નથી.
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ક્રમ</th>
                <th>જી.આર. નં</th>
                <th>નામ</th>
                <th>ધોરણ</th>
                <th>દાખલ તારીખ</th>
                <th>અગાઉની શાળા</th>
                <th style={{ textAlign: 'center' }}>વિગતો</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => (
                <tr key={student.id}>
                  <td style={{ color: '#64748b' }}>{toGujaratiNumbers(idx + 1)}</td>
                  <td style={{ fontWeight: '600', color: '#2b8cee' }}>{student.grNo}</td>
                  <td>
                    <Link to={`/students/${student.id}`} style={{ fontWeight: '600', color: '#f8fafc' }}>
                      {student.fullName}
                    </Link>
                  </td>
                  <td>{student.standard === 0 ? 'બાલવાટિકા' : `ધોરણ ${student.standard}`}</td>
                  <td>{student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('gu-IN') : '-'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#94a3b8' }}>
                      <School size={14} color="#64748b" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                        {student.prevSchool || 'સીધો પ્રવેશ'}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Link to={`/students/${student.id}`} className="btn btn-secondary" style={actionIconButtonStyle}>
                      <Eye size={16} />
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

const actionIconButtonStyle = {
  padding: '6px',
  borderRadius: '4px',
  color: '#2b8cee',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default AavakRegisterPage;
