import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, User, BookOpen, Briefcase, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

function ProfileForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('yojana_profile');
    if (saved) return JSON.parse(saved);
    return {
      age: '', gender: '', state: '', category: '',
      income: '', education: '', course: '', occupation: '',
      disability: 'No', minority: 'No'
    };
  });

  const [dbOptions, setDbOptions] = useState({ states: [], categories: [], educations: [], occupations: [] });

  useEffect(() => {
    localStorage.setItem('yojana_profile', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    fetch('http://localhost:5000/api/options')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDbOptions(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'education') {
      setFormData({ ...formData, education: e.target.value, course: '' });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const getCourseOptions = (eduLevel) => {
    switch (eduLevel) {
      case '10th': return [{val: 'General', label: 'General (10th/below)'}];
      case '12th': return [
        {val: 'Arts', label: 'Arts (11th/12th)'},
        {val: 'Science', label: 'Science (11th/12th)'},
        {val: 'Commerce', label: 'Commerce (11th/12th)'}
      ];
      case 'Diploma': return [{val: 'Diploma', label: 'Diploma'}];
      case 'UG': return [
        {val: 'B.Tech', label: 'B.Tech / B.E'},
        {val: 'B.Sc', label: 'B.Sc'},
        {val: 'B.A', label: 'B.A'},
        {val: 'B.Com', label: 'B.Com'},
        {val: 'MBBS', label: 'MBBS'}
      ];
      case 'PG': return [
        {val: 'M.Tech', label: 'M.Tech'},
        {val: 'M.Sc', label: 'M.Sc'},
        {val: 'M.A', label: 'M.A'},
        {val: 'MBA', label: 'MBA'}
      ];
      default: return [];
    }
  };

  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        navigate('/results', { state: { results: data.data, profile: formData } });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Failed to connect to backend server. Make sure it's running.");
      console.error(err);
    }
    setLoading(false);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 relative">
      <div className="absolute left-0 right-0 h-1 bg-slate-200 top-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute left-0 h-1 bg-brand-500 top-1/2 -translate-y-1/2 z-0 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
      
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= num ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-200 text-slate-500'} ${num !== 1 && num !== 4 ? 'mx-auto' : ''} ${num === 4 ? 'ml-auto' : ''}`}>
          {step > num ? <CheckCircle2 size={20} /> : num}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-medium">
            <Home size={18} /> Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Let's find your schemes</h2>
          <p className="mt-2 text-slate-600">Answer a few questions to check your eligibility</p>
        </div>

        <div className="glass-card p-6 md:p-10">
          <StepIndicator />

          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-brand-600 border-b pb-2">
                  <User size={20} />
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all" placeholder="e.g. 19" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all">
                      <option value="">Select State</option>
                      {dbOptions.states.length > 0 ? dbOptions.states.map(s => <option key={s} value={s}>{s}</option>) : (
                        <>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all">
                      <option value="">Select Category</option>
                      {dbOptions.categories.length > 0 ? dbOptions.categories.map(c => <option key={c} value={c}>{c}</option>) : (
                        <>
                          <option value="General">General</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Income & Other Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-purple-600 border-b pb-2">
                  <Briefcase size={20} />
                  <h3 className="font-semibold text-lg">Income & Background</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Annual Family Income (₹)</label>
                    <input type="number" name="income" value={formData.income} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" placeholder="e.g. 200000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                    <select name="occupation" value={formData.occupation} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all">
                      <option value="">Select Occupation</option>
                      {dbOptions.occupations.length > 0 ? dbOptions.occupations.map(o => <option key={o} value={o}>{o}</option>) : (
                        <>
                          <option value="Student">Student</option>
                          <option value="Farmer">Farmer</option>
                          <option value="Self-employed">Self-employed</option>
                          <option value="Unemployed">Unemployed</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Any Disability?</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="disability" value="Yes" checked={formData.disability === 'Yes'} onChange={handleChange} className="w-4 h-4 text-purple-600 focus:ring-purple-500" /> Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="disability" value="No" checked={formData.disability === 'No'} onChange={handleChange} className="w-4 h-4 text-purple-600 focus:ring-purple-500" /> No
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Minority Community?</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="minority" value="Yes" checked={formData.minority === 'Yes'} onChange={handleChange} className="w-4 h-4 text-purple-600 focus:ring-purple-500" /> Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="minority" value="No" checked={formData.minority === 'No'} onChange={handleChange} className="w-4 h-4 text-purple-600 focus:ring-purple-500" /> No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Education */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <BookOpen size={20} />
                    <h3 className="font-semibold text-lg">Education Details</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Education Level (Optional)</label>
                    <select name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                      <option value="">Select Level</option>
                      {dbOptions.educations.length > 0 ? dbOptions.educations.map(e => <option key={e} value={e}>{e}</option>) : (
                        <>
                          <option value="10th">10th Pass</option>
                          <option value="12th">12th Pass</option>
                          <option value="Diploma">Diploma</option>
                          <option value="UG">Undergraduate (UG)</option>
                          <option value="PG">Postgraduate (PG)</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course / Stream (Optional)</label>
                    <select name="course" value={formData.course} onChange={handleChange} disabled={!formData.education} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50">
                      <option value="">{formData.education ? 'Select Course' : 'Select Education First'}</option>
                      {getCourseOptions(formData.education).map(opt => (
                        <option key={opt.val} value={opt.val}>{opt.label}</option>
                      ))}
                      {formData.education && <option value="Other">Other</option>}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Review Data */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-brand-600 border-b pb-2">
                  <CheckCircle2 size={20} />
                  <h3 className="font-semibold text-lg">Review Your Information</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Please verify your details. If you made a mistake, you can go back and change it.</p>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div className="text-slate-500">Age:</div> <div className="font-semibold text-slate-800">{formData.age}</div>
                  <div className="text-slate-500">Gender:</div> <div className="font-semibold text-slate-800">{formData.gender}</div>
                  <div className="text-slate-500">State:</div> <div className="font-semibold text-slate-800">{formData.state}</div>
                  <div className="text-slate-500">Category:</div> <div className="font-semibold text-slate-800">{formData.category}</div>
                  <div className="col-span-2 border-t border-slate-200 my-1"></div>
                  <div className="text-slate-500">Education:</div> <div className="font-semibold text-slate-800">{formData.education} ({formData.course})</div>
                  <div className="text-slate-500">Annual Income:</div> <div className="font-semibold text-slate-800">₹{formData.income}</div>
                  <div className="text-slate-500">Occupation:</div> <div className="font-semibold text-slate-800">{formData.occupation}</div>
                  <div className="text-slate-500">Disability/Minority:</div> <div className="font-semibold text-slate-800">{formData.disability} / {formData.minority}</div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="px-6 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors flex items-center gap-2">
                  <ArrowLeft size={18} /> Back
                </button>
              ) : <div></div>}
              <div className="flex gap-3">
                {step === 3 && (
                  <button type="button" onClick={() => { setFormData({...formData, education: '', course: ''}); nextStep(); }} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold transition-colors">
                    Skip
                  </button>
                )}
                <button type="submit" disabled={loading} className="px-8 py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-slate-900/20 hover:shadow-brand-500/30 flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Checking...' : step === 4 ? 'Confirm & Check Schemes' : 'Next'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfileForm;
