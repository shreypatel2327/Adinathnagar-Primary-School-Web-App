import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentAPI } from '../api/api';
import { 
  toGujaratiNumbers, 
  formatDateGujarati, 
  dateToGujaratiWords 
} from '../utils/gujaratiUtils';
import { ArrowLeft, Printer, GraduationCap } from 'lucide-react';

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
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text-primary)' }}>વિદ્યાર્થી માહિતી લોડ થઈ રહી છે...</div>;
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

  // Stylesheet injection
  const cssStyles = isBonafide ? `
    @page { size: A4 portrait; margin: 10mm; }
    .bonafide-cert {
      font-family: 'Mukta Vaani', sans-serif;
      padding: 20px;
      line-height: 2.5;
      color: #000;
      font-size: 18px;
      background-color: #ffffff;
      width: 210mm;
      height: 297mm;
      box-sizing: border-box;
      position: relative;
    }
    .bonafide-cert .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 2px; }
    .bonafide-cert .subheader { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .bonafide-cert .subheader td { font-size: 18px; font-weight: bold; padding: 5px 0; }
    .bonafide-cert .title-container { position: relative; text-align: center; margin-top: 30px; margin-bottom: 60px; }
    .bonafide-cert .main-title { font-size: 22px; font-weight: bold; border-bottom: 2px solid black; display: inline-block; padding-bottom: 2px; }
    .bonafide-cert .photo-box { position: absolute; right: 0; top: -10px; width: 110px; height: 130px; border: 1.5px solid black; text-align: center; line-height: 130px; font-size: 14px; }
    .bonafide-cert .content { font-size: 20px; text-align: justify; margin-top: 40px; }
    .bonafide-cert .line { border-bottom: 1px dotted black; font-weight: bold; padding: 0 5px; display: inline-block; text-align: center; }
    .bonafide-cert .footer-table { width: 100%; margin-top: 80px; }
    .bonafide-cert .footer-table td { font-size: 18px; font-weight: bold; text-align: center; vertical-align: bottom; }
    .bonafide-cert .sign-area { margin-top: 10px; border-top: 1.5px solid black; width: 160px; display: inline-block; }
  ` : `
    @page { size: A4 portrait; margin: 5mm; }
    .valiform-cert {
      font-family: 'Mukta Vaani', sans-serif;
      margin: 0;
      padding: 4mm;
      font-size: 13px;
      color: #000;
      background-color: #ffffff;
      width: 210mm;
      height: 297mm;
      box-sizing: border-box;
    }
    .valiform-cert .main-table { width: 100%; border-collapse: collapse; border: 1.5px solid black; }
    .valiform-cert .main-table td { border: 1px solid black; padding: 3px 6px; color: #000; }
    .valiform-cert .bg-label { font-weight: bold; width: 30%; }
    .valiform-cert .center { text-align: center; }
    .valiform-cert .bold { font-weight: bold; }
    .valiform-cert .left-bold { text-align: left; font-weight: bold; padding-left: 5px; }
    .valiform-cert .left-align-bold { text-align: left; font-weight: bold; padding-left: 5px; vertical-align: middle; }
    .valiform-cert .header-logo { width: 80px; }
    .valiform-cert .photo-box { width: 100px; height: 120px; border: 1.2px solid black; text-align: center; vertical-align: middle; }
  `;

  return (
    <div style={pageContainerStyle}>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      
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
            /* BONAFIDE CERTIFICATE CUSTOM HTML DESIGN */
            <div className="bonafide-cert">
              <div className="header">નગર પ્રાથમિક શિક્ષણ સમિતિ સંચાલિત</div>
              
              <table className="subheader">
                <tbody>
                  <tr>
                    <td width="70%">શાળાનું નામ : <span className="line" style={{ minWidth: '250px' }}>આદિનાથનગર પ્રાથમિક શાળા</span></td>
                    <td width="30%" style={{ textAlign: 'right' }}>તાલુકો : <span className="line" style={{ minWidth: '80px' }}>AMC</span></td>
                  </tr>
                </tbody>
              </table>

              <br />
              <div className="title-container">
                <div className="main-title">બોનાફાઈડ સર્ટી / જન્મ તારીખનો દાખલો</div>
                <div className="photo-box">ફોટો</div>
              </div>

              <br />
              <div className="content">
                આથી પ્રમાણપત્ર આપવામાં આવે છે કે શ્રી <span className="line" style={{ minWidth: '250px' }}>{fullName}</span> 
                અત્રેની પ્રાથમિક શાળામાં ધો. <span className="line" style={{ minWidth: '60px' }}>{student.standard === 0 ? 'બાલવાટિકા' : toGujaratiNumbers(student.standard)}</span> માં <span className="line" style={{ minWidth: '100px' }}>{student.status === 'Active' ? 'ચાલુ અભ્યાસ કરે છે' : 'અભ્યાસ કરતા હતા'}</span>. 
                જેમની જન્મ તારીખ <span className="line" style={{ minWidth: '120px' }}>{dobFormatted}</span> શબ્દોમાં <span className="line" style={{ minWidth: '280px' }}>{dobWords}</span> 
                છે. જે શાળાના વયપત્રક નંબર <span className="line" style={{ minWidth: '80px' }}>{toGujaratiNumbers(student.grNo)}</span> પરથી ખરાઈ કરી લખી આપવામાં આવે છે.
              </div>
              <br />
              <table className="footer-table">
                <tbody>
                  <tr>
                    <td width="33%" style={{ textAlign: 'left' }}>અમદાવાદ<br />તારીખ : <span style={{ minWidth: '100px' }}>{todayDateStr}</span></td>
                    <td width="33%">વર્ગ શિક્ષકની સહી<br /><br /><br /><div className="sign-area"></div></td>
                    <td width="33%" style={{ textAlign: 'right' }}>முખ્ય શિક્ષકની સહી<br /><br /><br /><div className="sign-area"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* VALI FORM CUSTOM HTML DESIGN */
            <div className="valiform-cert">
              <table width="100%" style={{ marginBottom: '5px' }}>
                <tbody>
                  <tr>
                    <td width="15%" style={{ border: 'none' }}>
                      <GraduationCap size={44} color="#2b8cee" />
                    </td>
                    <td className="center" style={{ border: 'none' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>નગર પ્રાથમિક શિક્ષણ સમિતિ, અમદાવાદ</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>વાલી ફોર્મ</div>
                      <div style={{ marginTop: '5px' }}>વાલી ફોર્મ નંબર : <span style={{ border: '1.5px solid black', padding: '2px 25px', fontWeight: 'bold' }}>{toGujaratiNumbers(student.grNo)}</span></div>
                    </td>
                    <td width="15%" className="photo-box" style={{ border: '1.2px solid black', display: 'table-cell' }}>ફોટો</td>
                  </tr>
                </tbody>
              </table>

              <table className="main-table">
                <tbody>
                  <tr>
                    <td rowSpan="2" className="center bold" width="4%">૧</td>
                    <td rowSpan="2" className="bg-label">વિદ્યાર્થીનું પૂરેપૂરું નામ :</td>
                    <td className="center bold">ગુજરાતી</td>
                    <td className="center bold">નામ: {firstName}</td>
                    <td className="center bold">પિતાનું નામ: {middleName}</td>
                    <td className="center bold">અટક: {lastName}</td>
                  </tr>
                  <tr>
                    <td className="center bold">અંગ્રેજી</td>
                    <td colSpan="3" className="center bold" style={{ textTransform: 'uppercase' }}>{englishName}</td>
                  </tr>
                  <tr>
                    <td rowSpan="2" className="center bold">૨</td>
                    <td className="bg-label">પિતાનું નામ</td>
                    <td colSpan="4">{middleName}</td>
                  </tr>
                  <tr>
                    <td className="bg-label">પિતાનો અભ્યાસ</td>
                    <td colSpan="4">{student.fatherEdu || '-'}</td>
                  </tr>
                  <tr>
                    <td rowSpan="2" className="center bold">૩</td>
                    <td className="bg-label">માતાનું નામ</td>
                    <td colSpan="4">{student.motherName || '-'}</td>
                  </tr>
                  <tr>
                    <td className="bg-label">માતાનો અભ્યાસ</td>
                    <td colSpan="4">{student.motherEdu || '-'}</td>
                  </tr>
                  <tr>
                    <td rowSpan="2" className="center bold">૪</td>
                    <td className="bg-label">પિતાનો વ્યવસાય</td>
                    <td colSpan="4">{student.fatherOcc || '-'}</td>
                  </tr>
                  <tr>
                    <td className="bg-label">માતાનો વ્યવસાય</td>
                    <td colSpan="4">{student.motherOcc || '-'}</td>
                  </tr>
                  <tr>
                    <td className="center bold">૫</td>
                    <td className="bg-label">ધર્મ અને જ્ઞાતિ</td>
                    <td colSpan="4">{student.caste || '-'}</td>
                  </tr>
                  <tr>
                    <td className="center bold">૬</td>
                    <td className="bg-label">જાતિ (કુમાર / કન્યા)</td>
                    <td colSpan="4">{student.gender === 'Boy' ? 'કુમાર' : 'કન્યા'}</td>
                  </tr>

                  <tr>
                    <td rowSpan="2" className="center bold">૭</td>
                    <td className="left-align-bold" rowSpan="2">જન્મ તારીખ</td>
                    <td className="center bold">આંકડામાં</td>
                    <td colSpan="3" className="left-bold">{dobFormatted}</td>
                  </tr>
                  <tr>
                    <td className="center bold">શબ્દોમાં</td>
                    <td colSpan="3" className="left-bold">{dobWords}</td>
                  </tr>

                  <tr>
                    <td className="center bold">૮</td>
                    <td className="bg-label">જન્મ સ્થળ</td>
                    <td colSpan="4">{student.birthPlace || '-'}</td>
                  </tr>

                  <tr>
                    <td rowSpan="2" className="center bold">૯</td>
                    <td className="bg-label">હાલનું રહેઠાણનું સરનામું</td>
                    <td colSpan="4">{student.address || '-'}</td>
                  </tr>
                  <tr>
                    <td className="bg-label">મોબાઈલ નંબર</td>
                    <td colSpan="4">{toGujaratiNumbers(student.mobile)}</td>
                  </tr>

                  <tr>
                    <td className="center bold">૧૧</td>
                    <td className="bg-label">વિદ્યાર્થીની માતૃભાષા</td>
                    <td colSpan="4">ગુજરાતી</td>
                  </tr>
                  <tr>
                    <td className="center bold">૧૨</td>
                    <td className="bg-label">જન્મ તારીખ માટે કયો આધાર આપ્યો?</td>
                    <td colSpan="4">જન્મ પ્રમાણપત્ર</td>
                  </tr>
                </tbody>
              </table>

              <table width="100%" style={{ marginTop: '10px' }}>
                <tbody>
                  <tr>
                    <td width="20%">તારીખ: {todayDateStr}</td>
                    <td width="30%">વાલીની સહી __________</td>
                    <td width="50%" style={{ textAlign: 'right' }}>
                      શિક્ષકનું નામ: <b>આદિનાથનગર શાળા શિક્ષક</b> &nbsp;&nbsp;&nbsp;
                      સહી: __________
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />

              <div style={{ border: '1px solid black', marginTop: '5px', padding: '5px' }}>
                <div className="center bold">શાળાના ઉપયોગ માટે</div>
                <p style={{ margin: '5px 0' }}>
                  સામાન્ય વયપત્રક નંબર <strong style={{ textDecoration: 'underline', padding: '0 10px' }}>{toGujaratiNumbers(student.grNo)}</strong> 
                  તારીખ <strong style={{ textDecoration: 'underline', padding: '0 10px' }}>{admissionDateFormatted}</strong> ના રોજ દાખલ કર્યો.
                </p>
                <p style={{ margin: '5px 0' }}>શાળાનું નામ: <b>આદિનાથનગર પ્રાથમિક શાળા</b></p>
              </div>
              <br />
              <br />
              
              <div style={{ textAlign: 'right', marginTop: '15px', fontWeight: 'bold' }}>
                આચાર્યના સહી / સિક્કો
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
  backgroundColor: 'var(--bg-primary)',
  padding: '1.5rem',
  color: 'var(--text-primary)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: 'var(--bg-secondary)',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
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
  transform: 'translateY(-50%)',
  color: '#1e293b',
  fontFamily: "'Mukta Vaani', sans-serif",
  whiteSpace: 'nowrap',
};

export default CertificatePage;
