import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { studentAPI } from '../api/api';
import { ArrowLeft, Save, User, Users, CreditCard, GraduationCap } from 'lucide-react';

const AddStudentPage = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    grNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Boy',
    dob: '',
    standard: '1',
    category: 'OBC',
    address: '',
    oldSchoolGrNo: '',
    newSchoolGrNo: '',
    dietNo: '',
    prevSchool: '',
    mobile: '',
    birthPlace: '',
    caste: '',
    fatherName: '',
    fatherEdu: '',
    fatherOcc: '',
    fatherAadhaar: '',
    fatherNameOnAadhaar: '',
    motherName: '',
    motherEdu: '',
    motherOcc: '',
    motherAadhaar: '',
    aadhaarNo: '',
    nameOnAadhaar: '',
    uid: '',
    rationCard: '',
    birthCertName: '',
    birthCertNo: '',
    bankAccount: '',
    ifscCode: '',
    bankName: '',
    bankHolderName: '',
    admissionDate: new Date().toISOString().split('T')[0],
    academicYear: `${new Date().getFullYear()}-${(new Date().getFullYear() + 1).toString().substring(2)}`,
    result: '',
    percentage: '',
    attendance: '',
    transportation: 'No',
    isHandicapped: 'No',
    handicapPercentage: '',
    status: 'Active',
    remarks: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          setFetching(true);
          const student = await studentAPI.getById(id);
          // Format date strings for input fields
          const formattedStudent = { ...student };
          if (student.dob) {
            formattedStudent.dob = student.dob.split('T')[0];
          }
          if (student.admissionDate) {
            formattedStudent.admissionDate = student.admissionDate.split('T')[0];
          }
          setFormData(formattedStudent);
        } catch (err) {
          console.error('Error fetching student for edit:', err);
          setError('સુધારવા માટે વિદ્યાર્થીની વિગતો મેળવવામાં નિષ્ફળતા.');
        } finally {
          setFetching(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-generate full name
      if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
        const first = name === 'firstName' ? value : prev.firstName;
        const middle = name === 'middleName' ? value : prev.middleName;
        const last = name === 'lastName' ? value : prev.lastName;
        updated.fullName = `${first} ${middle} ${last}`.trim();
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.grNo || !formData.firstName || !formData.lastName || !formData.gender) {
      setError('કૃપા કરીને ફરજિયાત ફિલ્ડ્સ (જી.આર. નં, પ્રથમ નામ, અટક, જાતિ) ભરો.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Convert numeric fields properly
      const payload = {
        ...formData,
        grNo: parseInt(formData.grNo, 10),
        standard: parseInt(formData.standard, 10),
        percentage: formData.percentage !== '' ? parseFloat(formData.percentage) : null,
        attendance: formData.attendance !== '' ? parseFloat(formData.attendance) : null,
        handicapPercentage: formData.handicapPercentage !== '' ? parseFloat(formData.handicapPercentage) : null,
      };

      if (isEditMode) {
        await studentAPI.update(id, payload);
        alert('વિદ્યાર્થીની વિગતો સફળતાપૂર્વક અપડેટ કરવામાં આવી છે.');
      } else {
        await studentAPI.create(payload);
        alert('નવો વિદ્યાર્થી સફળતાપૂર્વક ઉમેરવામાં આવ્યો છે.');
      }
      navigate('/students');
    } catch (err) {
      console.error('Error saving student:', err);
      setError(err.response?.data?.message || 'વિદ્યાર્થી સાચવવામાં ક્ષતિ આવી છે. કૃપા કરીને જી.આર. નંબર અજોડ છે તેની ખાતરી કરો.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>માહિતી લોડ થઈ રહી છે...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>
            {isEditMode ? 'વિદ્યાર્થીની વિગતો સુધારો' : 'નવો વિદ્યાર્થી દાખલ કરો'}
          </h1>
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ padding: '12px', borderRadius: '6px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Tab Selection */}
        <div className="glass-card" style={{ padding: '10px 1.5rem 0' }}>
          <div className="tabs-header" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              વૈયક્તિક માહિતી
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'family' ? 'active' : ''}`}
              onClick={() => setActiveTab('family')}
            >
              <Users size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              કૌટુંબિક માહિતી
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'govt' ? 'active' : ''}`}
              onClick={() => setActiveTab('govt')}
            >
              <CreditCard size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              સરકારી/બેંક વિગતો
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
              onClick={() => setActiveTab('academic')}
            >
              <GraduationCap size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              શૈક્ષણિક વિગતો
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="glass-card">
          {/* PERSONAL TAB */}
          {activeTab === 'personal' && (
            <div style={formGridStyle}>
              <div className="form-group">
                <label className="form-label">જી.આર. નંબર (GR No) *</label>
                <input
                  type="number"
                  name="grNo"
                  className="form-control"
                  placeholder="જી.આર. નંબર લખો"
                  value={formData.grNo}
                  onChange={handleChange}
                  required
                  disabled={isEditMode}
                />
              </div>

              <div className="form-group">
                <label className="form-label">પ્રથમ નામ *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="પ્રથમ નામ લખો"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">પિતૃ નામ</label>
                <input
                  type="text"
                  name="middleName"
                  className="form-control"
                  placeholder="પિતૃ નામ લખો"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">અટક *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="અટક લખો"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">જાતિ *</label>
                <select
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Boy">કુમાર (Boy)</option>
                  <option value="Girl">કન્યા (Girl)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">જન્મ તારીખ</label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">અભ્યાસનું ધોરણ *</label>
                <select
                  name="standard"
                  className="form-control"
                  value={formData.standard}
                  onChange={handleChange}
                  required
                >
                  <option value="0">બાલવાટિકા (Balwatika)</option>
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

              <div className="form-group">
                <label className="form-label">કેટેગરી</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="OBC">OBC (બક્ષીપંચ)</option>
                  <option value="SC">SC (અનુસૂચિત જાતિ)</option>
                  <option value="ST">ST (અનુસૂચિત જનજાતિ)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">પેટા જ્ઞાતિ (Caste)</label>
                <input
                  type="text"
                  name="caste"
                  className="form-control"
                  placeholder="હિન્દુ દરજી, હિન્દુ પટેલ વગેરે લખો"
                  value={formData.caste}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">જન્મ સ્થળ</label>
                <input
                  type="text"
                  name="birthPlace"
                  className="form-control"
                  placeholder="ગામ/શહેરનું નામ"
                  value={formData.birthPlace}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">મોબાઈલ નંબર</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-control"
                  placeholder="૧૦ આંકડાનો મોબાઈલ નંબર લખો"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">સરનામું</label>
                <textarea
                  name="address"
                  className="form-control"
                  placeholder="પૂરું સરનામું લખો"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>
          )}

          {/* FAMILY TAB */}
          {activeTab === 'family' && (
            <div style={formGridStyle}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">પિતાનું પૂરું નામ</label>
                <input
                  type="text"
                  name="fatherName"
                  className="form-control"
                  placeholder="પિતાનું નામ લખો"
                  value={formData.fatherName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">પિતાનો અભ્યાસ</label>
                <input
                  type="text"
                  name="fatherEdu"
                  className="form-control"
                  placeholder="પિતાની શૈક્ષણિક લાયકાત"
                  value={formData.fatherEdu}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">પિતાનો વ્યવસાય</label>
                <input
                  type="text"
                  name="fatherOcc"
                  className="form-control"
                  placeholder="પિતાનો વ્યવસાય/નોકરી"
                  value={formData.fatherOcc}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">પિતાનો આધાર નંબર</label>
                <input
                  type="text"
                  name="fatherAadhaar"
                  className="form-control"
                  placeholder="૧૨ આંકડાનો આધાર નંબર"
                  value={formData.fatherAadhaar}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">આધાર મુજબ પિતાનું નામ</label>
                <input
                  type="text"
                  name="fatherNameOnAadhaar"
                  className="form-control"
                  placeholder="પિતાનું નામ આધાર મુજબ લખો"
                  value={formData.fatherNameOnAadhaar}
                  onChange={handleChange}
                />
              </div>

              <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '15px 0' }} />

              <div className="form-group">
                <label className="form-label">માતાનું નામ</label>
                <input
                  type="text"
                  name="motherName"
                  className="form-control"
                  placeholder="માતાનું નામ લખો"
                  value={formData.motherName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">માતાનો અભ્યાસ</label>
                <input
                  type="text"
                  name="motherEdu"
                  className="form-control"
                  placeholder="માતાની શૈક્ષણિક લાયકાત"
                  value={formData.motherEdu}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">માતાનો વ્યવસાય</label>
                <input
                  type="text"
                  name="motherOcc"
                  className="form-control"
                  placeholder="માતાનો વ્યવસાય/નોકરી"
                  value={formData.motherOcc}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">માતાનો આધાર નંબર</label>
                <input
                  type="text"
                  name="motherAadhaar"
                  className="form-control"
                  placeholder="૧૨ આંકડાનો આધાર નંબર"
                  value={formData.motherAadhaar}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* GOVT & BANK TAB */}
          {activeTab === 'govt' && (
            <div style={formGridStyle}>
              <div className="form-group">
                <label className="form-label">વિદ્યાર્થીનો આધાર નંબર</label>
                <input
                  type="text"
                  name="aadhaarNo"
                  className="form-control"
                  placeholder="૧૨ આંકડાનો આધાર નંબર લખો"
                  value={formData.aadhaarNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">આધાર મુજબ નામ</label>
                <input
                  type="text"
                  name="nameOnAadhaar"
                  className="form-control"
                  placeholder="વિદ્યાર્થીનું નામ આધાર કાર્ડ મુજબ"
                  value={formData.nameOnAadhaar}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">વિદ્યાર્થી DISE UID નંબર</label>
                <input
                  type="text"
                  name="uid"
                  className="form-control"
                  placeholder="૧૮ આંકડાનો યુનિક આઈડી લખો"
                  value={formData.uid}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">રેશનકાર્ડ નંબર</label>
                <input
                  type="text"
                  name="rationCard"
                  className="form-control"
                  placeholder="રેશનકાર્ડ નંબર"
                  value={formData.rationCard}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">જન્મ પ્રમાણપત્ર મુજબ નામ</label>
                <input
                  type="text"
                  name="birthCertName"
                  className="form-control"
                  placeholder="જન્મ પ્રમાણપત્ર મુજબ પૂરું નામ લખો"
                  value={formData.birthCertName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">જન્મ પ્રમાણપત્ર નંબર</label>
                <input
                  type="text"
                  name="birthCertNo"
                  className="form-control"
                  placeholder="જન્મ પ્રમાણપત્ર નંબર લખો"
                  value={formData.birthCertNo}
                  onChange={handleChange}
                />
              </div>

              <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '15px 0' }} />

              <div className="form-group">
                <label className="form-label">બેંક ખાતા નંબર</label>
                <input
                  type="text"
                  name="bankAccount"
                  className="form-control"
                  placeholder="વિદ્યાર્થીનો બેંક ખાતા નંબર લખો"
                  value={formData.bankAccount}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">બેંક IFSC કોડ</label>
                <input
                  type="text"
                  name="ifscCode"
                  className="form-control"
                  placeholder="૧૧ આંકડાનો આઈએફએસસી કોડ"
                  value={formData.ifscCode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">બેંકનું નામ</label>
                <input
                  type="text"
                  name="bankName"
                  className="form-control"
                  placeholder="બેંકનું નામ લખો"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">બેંક પાસબુક મુજબ ખાતાધારકનું નામ</label>
                <input
                  type="text"
                  name="bankHolderName"
                  className="form-control"
                  placeholder="ખાતાધારકનું નામ લખો"
                  value={formData.bankHolderName}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* ACADEMIC TAB */}
          {activeTab === 'academic' && (
            <div style={formGridStyle}>
              <div className="form-group">
                <label className="form-label">પ્રવેશ તારીખ (Admission Date)</label>
                <input
                  type="date"
                  name="admissionDate"
                  className="form-control"
                  value={formData.admissionDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">શૈક્ષણિક વર્ષ (દા.ત. 2026-27)</label>
                <input
                  type="text"
                  name="academicYear"
                  className="form-control"
                  value={formData.academicYear}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">અગાઉ અભ્યાસ કરેલ શાળાનું નામ</label>
                <input
                  type="text"
                  name="prevSchool"
                  className="form-control"
                  placeholder="અગાઉની શાળાનું નામ લખો"
                  value={formData.prevSchool}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">અગાઉની શાળાનો GR No.</label>
                <input
                  type="text"
                  name="oldSchoolGrNo"
                  className="form-control"
                  placeholder="જૂનો શાળા જી.આર. નં લખો"
                  value={formData.oldSchoolGrNo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">પરિણામ (દા.ત. પાસ/નાપાસ)</label>
                <input
                  type="text"
                  name="result"
                  className="form-control"
                  placeholder="પ્રથમ સત્ર / વાર્ષિક પરિણામ વિગત"
                  value={formData.result}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ટકાવારી (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="percentage"
                  className="form-control"
                  placeholder="ટકાવારી"
                  value={formData.percentage}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">હાજરી (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="attendance"
                  className="form-control"
                  placeholder="હાજરી ટકાવારી"
                  value={formData.attendance}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">વાહન સુવિધા (Transportation)</label>
                <select
                  name="transportation"
                  className="form-control"
                  value={formData.transportation}
                  onChange={handleChange}
                >
                  <option value="No">ના (No)</option>
                  <option value="Yes">હા (Yes)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">દિવ્યાંગતા છે?</label>
                <select
                  name="isHandicapped"
                  className="form-control"
                  value={formData.isHandicapped}
                  onChange={handleChange}
                >
                  <option value="No">ના (No)</option>
                  <option value="Yes">હા (Yes)</option>
                </select>
              </div>

              {formData.isHandicapped === 'Yes' && (
                <div className="form-group">
                  <label className="form-label">દિવ્યાંગતા ટકાવારી (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="handicapPercentage"
                    className="form-control"
                    placeholder="દિવ્યાંગતા ટકાવારી લખો"
                    value={formData.handicapPercentage}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={footerButtonsStyle}>
          <Link to="/students" className="btn btn-secondary" style={{ width: '150px' }}>
            રદ કરો
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '180px' }}
            disabled={loading}
          >
            <Save size={18} /> {loading ? 'સાચવી રહ્યું છે...' : 'માહિતી સાચવો'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.25rem',
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
};

const footerButtonsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '1rem',
};

export default AddStudentPage;
