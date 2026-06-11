import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentAPI } from '../api/api';
import { 
  toGujaratiNumbers, 
  formatDateGujarati, 
  dateToGujaratiWords 
} from '../utils/gujaratiUtils';
import { ArrowLeft, Printer, Download } from 'lucide-react';

const CertificatePage = () => {
  const { type, id } = useParams(); // type can be 'bonafide' or 'valiform'
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await studentAPI.getById(id);
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student for certificate:', err);
        setError('વિદ્યાર્થીની વિગતો મેળવવામાં નિષ્ફળતા.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>વિદ્યાર્થી માહિતી લોડ થઈ રહી છે...</div>;
  }

  if (error || !student) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="badge badge-danger" style={{ marginBottom: '1rem', padding: '10px 16px' }}>{error || 'વિદ્યાર્થી મળ્યો નથી.'}</div>
        <br />
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <ArrowLeft size={16} /> પાછા જાઓ
        </button>
      </div>
    );
  }

  const isBonafide = type === 'bonafide';

  // Format student details
  const todayDateStr = formatDateGujarati(new Date().toISOString());
  const dobFormatted = student.dob ? formatDateGujarati(student.dob) : '';
  const dobWords = student.dob ? dateToGujaratiWords(student.dob) : '';
  const admissionDateFormatted = student.admissionDate ? formatDateGujarati(student.admissionDate) : '';

  const firstName = student.firstName || '';
  const middleName = student.middleName || '';
  const lastName = student.lastName || '';
  const fullName = student.fullName || `${firstName} ${middleName} ${lastName}`.trim();
  const englishName = `${lastName} ${firstName} ${middleName}`.toUpperCase().trim();

  return (
    <div style={pageContainerStyle}>
      {/* Action Header - Hidden during print */}
      <div className="no-print" style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
            {isBonafide ? 'બોનાફાઇડ પ્રમાણપત્ર પ્રિવ્યુ' : 'વાલી ફોર્મ પ્રિવ્યુ'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={18} /> પ્રિન્ટ કરો (Print)
          </button>
        </div>
      </div>

      {/* Preview scale wrapper to fit A4 on screen nicely */}
      <div style={previewScaleWrapperStyle}>
        <div className="print-wrapper">
          {isBonafide ? (
            /* BONAFIDE CERTIFICATE CANVAS */
            <div className="print-canvas" style={{ ...canvasStyle, backgroundImage: "url('/bonafide_template.png')" }}>
              {/* Full Name */}
              <div style={{ ...posStyle, left: '52.9%', top: '41.2%', fontSize: '18px', fontWeight: 'bold' }}>
                {fullName}
              </div>
              
              {/* Standard */}
              <div style={{ ...posStyle, left: '43.8%', top: '45.4%', fontSize: '18px', fontWeight: 'bold' }}>
                {student.standard === 0 ? 'બાલવાટિકા' : toGujaratiNumbers(student.standard)}
              </div>

              {/* DOB Figures */}
              <div style={{ ...posStyle, left: '9.0%', top: '49.8%', fontSize: '18px', fontWeight: 'bold' }}>
                {dobFormatted}
              </div>

              {/* DOB Words */}
              <div style={{ ...posStyle, left: '38.5%', top: '49.8%', fontSize: '18px', fontWeight: 'bold' }}>
                {dobWords}
              </div>

              {/* GR No */}
              <div style={{ ...posStyle, left: '33.8%', top: '54.4%', fontSize: '18px', fontWeight: 'bold' }}>
                {toGujaratiNumbers(student.grNo)}
              </div>

              {/* Date Issued (Today) */}
              <div style={{ ...posStyle, left: '17.3%', top: '82.3%', fontSize: '16px', fontWeight: 'bold' }}>
                {todayDateStr}
              </div>
            </div>
          ) : (
            /* VALI FORM CANVAS */
            <div className="print-canvas" style={{ ...canvasStyle, backgroundImage: "url('/valiform_template.png')" }}>
              {/* Student Name (First Name) */}
              <div style={{ ...posStyle, left: '48.4%', top: '16.0%', fontSize: '13px', fontWeight: 'bold' }}>
                {firstName}
              </div>

              {/* Father Name */}
              <div style={{ ...posStyle, left: '67.0%', top: '16.0%', fontSize: '13px', fontWeight: 'bold' }}>
                {middleName}
              </div>

              {/* Surname */}
              <div style={{ ...posStyle, left: '87.2%', top: '16.0%', fontSize: '13px', fontWeight: 'bold' }}>
                {lastName}
              </div>

              {/* English Name */}
              <div style={{ ...posStyle, left: '44.4%', top: '18.5%', fontSize: '13px', fontWeight: 'bold' }}>
                {englishName}
              </div>

              {/* Father Name Repeat */}
              <div style={{ ...posStyle, left: '36.5%', top: '21.3%', fontSize: '13px' }}>
                {middleName}
              </div>

              {/* Father Edu */}
              <div style={{ ...posStyle, left: '36.5%', top: '24.2%', fontSize: '13px' }}>
                {student.fatherEdu || '-'}
              </div>

              {/* Mother Name */}
              <div style={{ ...posStyle, left: '36.5%', top: '26.7%', fontSize: '13px' }}>
                {student.motherName || '-'}
              </div>

              {/* Mother Edu */}
              <div style={{ ...posStyle, left: '36.5%', top: '29.2%', fontSize: '13px' }}>
                {student.motherEdu || '-'}
              </div>

              {/* Father Occ */}
              <div style={{ ...posStyle, left: '36.5%', top: '32.1%', fontSize: '13px' }}>
                {student.fatherOcc || '-'}
              </div>

              {/* Mother Occ */}
              <div style={{ ...posStyle, left: '36.5%', top: '34.7%', fontSize: '13px' }}>
                {student.motherOcc || '-'}
              </div>

              {/* Caste */}
              <div style={{ ...posStyle, left: '36.5%', top: '37.5%', fontSize: '13px' }}>
                {student.caste || '-'}
              </div>

              {/* Gender */}
              <div style={{ ...posStyle, left: '36.5%', top: '39.9%', fontSize: '13px' }}>
                {student.gender === 'Boy' ? 'કુમાર' : 'કન્યા'}
              </div>

              {/* DOB Figures */}
              <div style={{ ...posStyle, left: '44.2%', top: '42.8%', fontSize: '13px', fontWeight: 'bold' }}>
                {dobFormatted}
              </div>

              {/* DOB Words */}
              <div style={{ ...posStyle, left: '44.2%', top: '45.4%', fontSize: '13px', fontWeight: 'bold' }}>
                {dobWords}
              </div>

              {/* Birth Place */}
              <div style={{ ...posStyle, left: '36.5%', top: '48.0%', fontSize: '13px' }}>
                {student.birthPlace || '-'}
              </div>

              {/* Address */}
              <div style={{ ...posStyle, left: '36.5%', top: '50.8%', fontSize: '12px', width: '300px', lineHeight: '1.2' }}>
                {student.address || '-'}
              </div>

              {/* Mobile */}
              <div style={{ ...posStyle, left: '36.5%', top: '53.5%', fontSize: '13px', fontWeight: 'bold' }}>
                {toGujaratiNumbers(student.mobile)}
              </div>

              {/* Birth Cert Lang */}
              <div style={{ ...posStyle, left: '36.5%', top: '56.1%', fontSize: '13px' }}>
                ગુજરાતી
              </div>

              {/* Birth Cert Document */}
              <div style={{ ...posStyle, left: '36.5%', top: '58.6%', fontSize: '13px' }}>
                જન્મ પ્રમાણપત્ર
              </div>

              {/* Date Issued (Today) */}
              <div style={{ ...posStyle, left: '10.3%', top: '64.7%', fontSize: '13px' }}>
                {todayDateStr}
              </div>

              {/* Class Teacher Name (Admin Name / User) */}
              <div style={{ ...posStyle, left: '40.2%', top: '66.4%', fontSize: '13px', fontWeight: 'bold' }}>
                આદિનાથનગર શાળા
              </div>

              {/* GR No */}
              <div style={{ ...posStyle, left: '21.8%', top: '72.0%', fontSize: '13px', fontWeight: 'bold' }}>
                {toGujaratiNumbers(student.grNo)}
              </div>

              {/* Admission Date */}
              <div style={{ ...posStyle, left: '41.2%', top: '72.0%', fontSize: '13px', fontWeight: 'bold' }}>
                {admissionDateFormatted}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const pageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#0d0f12',
  padding: '1.5rem',
  color: '#f8fafc',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#12161b',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  marginBottom: '1.5rem',
};

const previewScaleWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowX: 'auto',
  padding: '1rem 0',
};

const canvasStyle = {
  position: 'relative',
  width: '210mm',
  height: '297mm',
  backgroundColor: 'white',
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  color: 'black',
  overflow: 'hidden',
};

const posStyle = {
  position: 'absolute',
  transform: 'translateY(-50%)', // Align text vertically center to the coordinate point
  color: '#1e293b',
  fontFamily: "'Mukta Vaani', sans-serif",
  whiteSpace: 'nowrap',
};

export default CertificatePage;
