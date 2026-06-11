import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { studentAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Edit, 
  FileCheck, 
  FileText,
  User,
  Users,
  Building,
  GraduationCap,
  Calendar,
  Phone,
  MapPin,
  CreditCard,
  School
} from 'lucide-react';

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        const data = await studentAPI.getById(id);
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('વિદ્યાર્થીની વિગતો મેળવવામાં નિષ્ફળતા.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [id]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>વિગતો લોડ થઈ રહી છે...</div>;
  }

  if (error || !student) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="badge badge-danger" style={{ marginBottom: '1rem', padding: '10px 16px' }}>{error || 'વિદ્યાર્થી મળ્યો નથી.'}</div>
        <br />
        <Link to="/students" className="btn btn-secondary">
          <ArrowLeft size={16} /> પાછા જાઓ
        </Link>
      </div>
    );
  }

  const getStandardLabel = (std) => {
    if (std === 0) return 'બાલવાટિકા';
    return `ધોરણ ${std}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={headerStyle}>
        <Link to="/students" className="btn btn-secondary">
          <ArrowLeft size={16} /> વિદ્યાર્થી યાદી
        </Link>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/students/edit/${student.id}`} className="btn btn-secondary" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
            <Edit size={16} /> વિગતો સુધારો
          </Link>
          <Link to={`/certificates/bonafide/${student.id}`} className="btn btn-secondary" style={{ color: '#2b8cee', borderColor: 'rgba(43, 140, 238, 0.3)' }}>
            <FileCheck size={16} /> બોનાફાઇડ પ્રમાણપત્ર
          </Link>
          <Link to={`/certificates/valiform/${student.id}`} className="btn btn-primary">
            <FileText size={16} /> વાલી ફોર્મ
          </Link>
        </div>
      </div>

      {/* Main Grid: Info card + Detail tabs */}
      <div style={gridStyle}>
        {/* Left Column: Summary Card */}
        <div className="glass-card" style={summaryCardStyle}>
          <div style={avatarStyle(student.gender)}>
            {student.fullName ? student.fullName.substring(0, 1) : 'S'}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '1rem', textAlign: 'center' }}>
            {student.fullName}
          </h2>
          <span className={`badge ${student.gender === 'Boy' ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '4px' }}>
            {student.gender === 'Boy' ? 'કુમાર' : 'કન્યા'}
          </span>

          <div style={summaryDividerStyle} />

          <div style={summaryDetailsStyle}>
            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>જી.આર. નંબર:</span>
              <span style={summaryValueStyle}>{student.grNo}</span>
            </div>
            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>ધોરણ:</span>
              <span style={summaryValueStyle}>{getStandardLabel(student.standard)}</span>
            </div>
            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>સ્થિતિ:</span>
              <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                {student.status === 'Active' ? 'હાજર' : 'કમી (Javak)'}
              </span>
            </div>
            <div style={summaryRowStyle}>
              <span style={summaryLabelStyle}>મોબાઈલ નં:</span>
              <span style={summaryValueStyle}>{student.mobile || '-'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Details */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              વૈયક્તિક માહિતી
            </button>
            <button 
              className={`tab-btn ${activeTab === 'family' ? 'active' : ''}`}
              onClick={() => setActiveTab('family')}
            >
              <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              કૌટુંબિક માહિતી
            </button>
            <button 
              className={`tab-btn ${activeTab === 'govt' ? 'active' : ''}`}
              onClick={() => setActiveTab('govt')}
            >
              <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              સરકારી/બેંક વિગતો
            </button>
            <button 
              className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              <GraduationCap size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              શૈક્ષણિક વિગતો
            </button>
          </div>

          <div style={tabContentStyle}>
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div style={detailGridStyle}>
                <DetailItem label="પ્રથમ નામ" value={student.firstName} icon={User} />
                <DetailItem label="પિતૃ નામ" value={student.middleName} icon={User} />
                <DetailItem label="અટક" value={student.lastName} icon={User} />
                <DetailItem label="જન્મ તારીખ" value={student.dob ? new Date(student.dob).toLocaleDateString('gu-IN') : null} icon={Calendar} />
                <DetailItem label="જન્મ સ્થળ" value={student.birthPlace} icon={MapPin} />
                <DetailItem label="જાતિ (caste)" value={student.caste} icon={User} />
                <DetailItem label="કેટેગરી" value={student.category} icon={User} />
                <DetailItem label="મોબાઈલ નંબર" value={student.mobile} icon={Phone} />
                <DetailItem label="સરનામું" value={student.address} icon={MapPin} fullWidth />
              </div>
            )}

            {/* FAMILY TAB */}
            {activeTab === 'family' && (
              <div style={detailGridStyle}>
                <DetailItem label="પિતાનું પૂરું નામ" value={student.fatherName} icon={User} fullWidth />
                <DetailItem label="પિતાનો અભ્યાસ" value={student.fatherEdu} icon={GraduationCap} />
                <DetailItem label="પિતાનો વ્યવસાય" value={student.fatherOcc} icon={Building} />
                <DetailItem label="પિતાનો આધાર નંબર" value={student.fatherAadhaar} icon={CreditCard} />
                <DetailItem label="આધાર મુજબ પિતાનું નામ" value={student.fatherNameOnAadhaar} icon={User} />
                <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />
                <DetailItem label="માતાનું નામ" value={student.motherName} icon={User} />
                <DetailItem label="માતાનો અભ્યાસ" value={student.motherEdu} icon={GraduationCap} />
                <DetailItem label="માતાનો વ્યવસાય" value={student.motherOcc} icon={Building} />
                <DetailItem label="માતાનો આધાર નંબર" value={student.motherAadhaar} icon={CreditCard} />
              </div>
            )}

            {/* GOVT & BANK TAB */}
            {activeTab === 'govt' && (
              <div style={detailGridStyle}>
                <DetailItem label="આધાર નંબર" value={student.aadhaarNo} icon={CreditCard} />
                <DetailItem label="આધાર કાર્ડ મુજબ નામ" value={student.nameOnAadhaar} icon={User} />
                <DetailItem label="વિદ્યાર્થી DISE UID" value={student.uid} icon={CreditCard} />
                <DetailItem label="રેશનકાર્ડ નંબર" value={student.rationCard} icon={FileText} />
                <DetailItem label="જન્મ પ્રમાણપત્ર નામ" value={student.birthCertName} icon={User} />
                <DetailItem label="જન્મ પ્રમાણપત્ર નંબર" value={student.birthCertNo} icon={FileText} />
                <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />
                <DetailItem label="બેંક ખાતા નંબર" value={student.bankAccount} icon={CreditCard} />
                <DetailItem label="IFSC કોડ" value={student.ifscCode} icon={CreditCard} />
                <DetailItem label="બેંકનું નામ" value={student.bankName} icon={Building} />
                <DetailItem label="ખાતાધારકનું નામ" value={student.bankHolderName} icon={User} />
              </div>
            )}

            {/* ACADEMIC TAB */}
            {activeTab === 'academic' && (
              <div style={detailGridStyle}>
                <DetailItem label="પ્રવેશ તારીખ" value={student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('gu-IN') : null} icon={Calendar} />
                <DetailItem label="શૈક્ષણિક વર્ષ" value={student.academicYear} icon={Calendar} />
                <DetailItem label="અગાઉની શાળા" value={student.prevSchool} icon={School} />
                <DetailItem label="જૂનો શાળા જી.આર. નં." value={student.oldSchoolGrNo} icon={FileText} />
                <DetailItem label="પરિણામ" value={student.result} icon={FileCheck} />
                <DetailItem label="ટકાવારી (%)" value={student.percentage ? `${student.percentage}%` : null} icon={FileCheck} />
                <DetailItem label="હાજરી (%)" value={student.attendance ? `${student.attendance}%` : null} icon={FileCheck} />
                <DetailItem label="પરિવહન સેવા (Transportation)" value={student.transportation} icon={Building} />
                <DetailItem label="દિવ્યાંગતા?" value={student.isHandicapped} icon={User} />
                <DetailItem label="દિવ્યાંગતા ટકાવારી" value={student.handicapPercentage ? `${student.handicapPercentage}%` : null} icon={User} />

                {student.status === 'Javak' && (
                  <>
                    <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'rgba(244,63,94,0.1)', margin: '10px 0' }} />
                    <DetailItem label="કમી કર્યાની (જાવક) તારીખ" value={student.leavingDate ? new Date(student.leavingDate).toLocaleDateString('gu-IN') : null} icon={Calendar} style={{ color: '#f43f5e' }} />
                    <DetailItem label="ગયેલ શાળા" value={student.destinationSchool} icon={School} style={{ color: '#f43f5e' }} />
                    <DetailItem label="જાવક નોંધ / રીમાર્ક" value={student.remarks} icon={FileText} fullWidth style={{ color: '#f43f5e' }} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const DetailItem = ({ label, value, icon: Icon, fullWidth, style }) => {
  return (
    <div style={{ 
      gridColumn: fullWidth ? 'span 2' : 'span 1',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      border: '1px solid rgba(255, 255, 255, 0.03)',
      ...style
    }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '6px', 
        backgroundColor: 'rgba(43, 140, 238, 0.05)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={16} color="#2b8cee" />
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f8fafc', marginTop: '2px', wordBreak: 'break-word' }}>
          {value !== undefined && value !== null && value !== '' ? value.toString() : '-'}
        </div>
      </div>
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

const gridStyle = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'start',
  flexWrap: 'wrap',
};

const summaryCardStyle = {
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  '@media (max-width: 900px)': {
    width: '100%',
  },
};

const avatarStyle = (gender) => ({
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  backgroundColor: gender === 'Boy' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
  border: gender === 'Boy' ? '2px solid rgba(16, 185, 129, 0.4)' : '2px solid rgba(245, 158, 11, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  fontWeight: '700',
  color: gender === 'Boy' ? '#10b981' : '#f59e0b',
});

const summaryDividerStyle = {
  width: '100%',
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  margin: '1.5rem 0',
};

const summaryDetailsStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.95rem',
};

const summaryLabelStyle = {
  color: '#94a3b8',
  fontWeight: '500',
};

const summaryValueStyle = {
  fontWeight: '600',
  color: '#f8fafc',
};

const tabContentStyle = {
  padding: '1rem 0',
};

const detailGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
};

export default StudentDetailPage;
