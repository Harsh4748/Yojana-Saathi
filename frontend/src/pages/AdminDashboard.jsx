import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, Trash2, Edit, Plus, X, Filter, ChevronDown, Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('adminAuth') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [schemes, setSchemes] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScheme, setCurrentScheme] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: '', nameHi: '', type: '', state: '', benefitAmount: '', maxIncome: '', 
    category: '', education: '', documentsRequired: '', gender: '', minAge: '', 
    maxAge: '', occupation: '', disabilityRequired: false, minorityRequired: false, applyLink: '', deadline: ''
  });
  const [jsonInput, setJsonInput] = useState('');
  const [filterOccupation, setFilterOccupation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [occupations, setOccupations] = useState([]);

  const fetchSchemes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/schemes');
      const data = await res.json();
      if (data.success) setSchemes(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin@123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
      fetchSchemes();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSchemes();
      fetch('http://localhost:5000/api/options')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOccupations(data.data.occupations || []);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, schemes]);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this scheme?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/schemes/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSchemes(schemes.filter(s => s._id !== id));
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Error deleting scheme.");
    }
  };

  const openModal = (scheme = null) => {
    if (scheme) {
      setCurrentScheme(scheme);
      setFormData({
        nameEn: scheme.name.en,
        nameHi: scheme.name.hi || '',
        type: scheme.type,
        state: scheme.state,
        benefitAmount: scheme.benefitAmount,
        maxIncome: scheme.eligibility.maxIncome || '',
        category: scheme.eligibility.category?.join(',') || '',
        education: scheme.eligibility.education?.join(',') || '',
        gender: scheme.eligibility.gender?.join(',') || '',
        documentsRequired: scheme.documentsRequired?.join(',') || '',
        minAge: scheme.eligibility.minAge || '',
        maxAge: scheme.eligibility.maxAge || '',
        occupation: scheme.eligibility.occupation?.join(',') || '',
        disabilityRequired: scheme.eligibility.disabilityRequired || false,
        minorityRequired: scheme.eligibility.minorityRequired || false,
        applyLink: scheme.applyLink || '',
        deadline: scheme.deadline ? new Date(scheme.deadline).toISOString().split('T')[0] : '',
        lastVerifiedDate: scheme.lastVerifiedDate ? new Date(scheme.lastVerifiedDate).toISOString().split('T')[0] : ''
      });
    } else {
      setCurrentScheme(null);
      setFormData({ 
        nameEn: '', nameHi: '', type: '', state: '', benefitAmount: '', maxIncome: '', 
        category: '', education: '', documentsRequired: '', gender: '',
        minAge: '', maxAge: '', occupation: '', disabilityRequired: false, minorityRequired: false,
        applyLink: '', deadline: '', lastVerifiedDate: ''
      });
      setFile(null);
      setMessage('');
    }
    setIsModalOpen(true);
  };

  const handleSaveScheme = async (e) => {
    e.preventDefault();
    const payload = {
      slug: Math.random().toString(36).substring(7),
      name: { en: formData.nameEn, hi: formData.nameHi },
      type: formData.type,
      state: formData.state,
      benefitAmount: Number(formData.benefitAmount),
      documentsRequired: formData.documentsRequired ? formData.documentsRequired.split(',').map(s => s.trim()) : [],
      eligibility: {
        maxIncome: formData.maxIncome ? Number(formData.maxIncome) : null,
        category: formData.category ? formData.category.split(',').map(s => s.trim()).filter(Boolean) : [],
        education: formData.education ? formData.education.split(',').map(s => s.trim()).filter(Boolean) : [],
        gender: formData.gender ? formData.gender.split(',').map(s => s.trim()).filter(Boolean) : [],
        occupation: formData.occupation ? formData.occupation.split(',').map(s => s.trim()).filter(Boolean) : [],
        minAge: formData.minAge ? Number(formData.minAge) : null,
        maxAge: formData.maxAge ? Number(formData.maxAge) : null,
        disabilityRequired: formData.disabilityRequired,
        minorityRequired: formData.minorityRequired
      },
      applyLink: formData.applyLink,
      deadline: formData.deadline ? new Date(formData.deadline) : null,
      lastVerifiedDate: formData.lastVerifiedDate ? new Date(formData.lastVerifiedDate) : null
    };

    try {
      const url = currentScheme ? `http://localhost:5000/api/admin/schemes/${currentScheme._id}` : 'http://localhost:5000/api/admin/schemes';
      const method = currentScheme ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchSchemes();
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Error saving scheme");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/admin/upload', {
        method: 'POST',
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        setMessage(data.message || 'File uploaded successfully!');
        setFile(null);
        fetchSchemes(); // Refresh list
        setTimeout(() => setIsModalOpen(false), 1500);
      } else {
        setMessage('Error: ' + data.message);
      }
    } catch (err) {
      setMessage('Failed to connect to server.');
    }
    setLoading(false);
  };

  const handleJsonSubmit = async (e) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;
    try {
      const parsedData = JSON.parse(jsonInput);
      
      // Normalize into an array of schemes
      let schemesList = [];
      if (Array.isArray(parsedData)) {
        schemesList = parsedData;
      } else if (parsedData && Array.isArray(parsedData.schemes)) {
        schemesList = parsedData.schemes;
      } else if (parsedData && typeof parsedData === 'object') {
        schemesList = [parsedData];
      } else {
        throw new Error("Invalid format");
      }

      const payloads = schemesList.map(parsed => ({
        slug: Math.random().toString(36).substring(7),
        name: { en: parsed.name || '', hi: parsed.name_hi || '' },
        type: parsed.type || 'scholarship',
        state: parsed.state || 'ALL',
        benefitAmount: Number(parsed.benefit_amount || parsed.benefitAmount) || 0,
        documentsRequired: Array.isArray(parsed.documents_required) ? parsed.documents_required : (parsed.documentsRequired || []),
        applyLink: parsed.apply_link || parsed.applyLink || '',
        applySteps: Array.isArray(parsed.apply_steps) ? parsed.apply_steps : (parsed.applySteps || []),
        deadline: (parsed.deadline) ? new Date(parsed.deadline) : null,
        lastVerifiedDate: (parsed.lastVerifiedDate || parsed.last_verified_date) ? new Date(parsed.lastVerifiedDate || parsed.last_verified_date) : null,
        eligibility: {
          maxIncome: (parsed.max_income || parsed.maxIncome) ? Number(parsed.max_income || parsed.maxIncome) : null,
          category: (!parsed.category || parsed.category === 'ALL' || (Array.isArray(parsed.category) && parsed.category.includes('ALL'))) ? [] : (Array.isArray(parsed.category) ? parsed.category : [parsed.category]),
          education: Array.isArray(parsed.education) ? parsed.education : (parsed.education ? [parsed.education] : []),
          gender: (!parsed.gender || parsed.gender === 'ALL') ? [] : (Array.isArray(parsed.gender) ? parsed.gender : [parsed.gender]),
          occupation: Array.isArray(parsed.occupation) ? parsed.occupation : (parsed.occupation ? [parsed.occupation] : []),
          minAge: (parsed.min_age || parsed.minAge) ? Number(parsed.min_age || parsed.minAge) : null,
          maxAge: (parsed.max_age || parsed.maxAge) ? Number(parsed.max_age || parsed.maxAge) : null,
          disabilityRequired: parsed.disability === 'Yes' || parsed.disability === true,
          minorityRequired: parsed.minority === 'Yes' || parsed.minority === true
        }
      }));

      // Backend's Scheme.create() supports arrays!
      const res = await fetch('http://localhost:5000/api/admin/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloads.length === 1 ? payloads[0] : payloads)
      });
      
      const data = await res.json();
      if (data.success || Array.isArray(data.data)) {
        setJsonInput('');
        setIsModalOpen(false);
        fetchSchemes();
      } else {
        alert(data.message || "Failed to save schemes");
      }
    } catch (err) {
      alert("Invalid JSON format or Error: " + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-slate-500 mt-2">Sign in to manage schemes</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{loginError}</div>}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            
            <button type="submit" className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors">
              Login
            </button>
            <button type="button" onClick={() => navigate('/')} className="w-full py-2 text-slate-500 hover:text-slate-800 text-sm font-medium">
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} /> Back to Home
          </button>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
            Logout
          </button>
        </div>

        {/* Schemes List Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Manage Schemes</h2>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold mt-2 inline-block">{schemes.length} Total Schemes</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                <input 
                  type="text"
                  placeholder="Search schemes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                <select 
                  value={filterOccupation}
                  onChange={(e) => setFilterOccupation(e.target.value)}
                  className="pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm appearance-none font-medium text-slate-700 cursor-pointer hover:border-brand-300 transition-colors h-full text-sm"
                >
                  <option value="">All Occupations</option>
                  {occupations.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <button onClick={() => openModal()} className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors text-sm font-semibold shadow-sm hover:shadow h-full">
                <Plus size={18} /> Add New Scheme
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {schemes.filter(s => {
              const matchOcc = !filterOccupation || (s.eligibility?.occupation || []).includes(filterOccupation);
              const matchSearch = (s.name.en || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.name.hi || '').toLowerCase().includes(searchQuery.toLowerCase());
              return matchOcc && matchSearch;
            }).map((scheme) => (
              <div key={scheme._id} className="flex justify-between items-center p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{scheme.name.en}</h3>
                  <div className="flex gap-3 text-sm text-slate-500 mt-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">{scheme.type}</span> 
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">{scheme.state}</span> 
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">₹{scheme.benefitAmount}</span>
                    {scheme.lastVerifiedDate && <span className="text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded text-xs">✓ {new Date(scheme.lastVerifiedDate).toLocaleDateString('en-GB')}</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/scheme', { state: { scheme } })} className="p-2.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors border border-transparent hover:border-emerald-100" title="Preview as User">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => openModal(scheme)} className="p-2.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit Scheme">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(scheme._id)} className="p-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Scheme">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {schemes.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-500 mb-4">No schemes available in the database.</p>
                <button onClick={() => openModal()} className="text-brand-600 font-semibold hover:underline">Add your first scheme</button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900">{currentScheme ? 'Edit Scheme' : 'Add New Scheme'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="p-6">
              {/* CSV Upload Section (Only show on Add) */}
              {!currentScheme && (
                <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2"><Upload size={16}/> Option 1: Quick Upload via CSV</h3>
                  <form onSubmit={handleUpload} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
                      <button type="submit" disabled={!file || loading} className="shrink-0 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                    {message && <p className={`text-xs font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
                  </form>
                  
                  <div className="mt-6 border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">Option 2: Paste Raw JSON</h3>
                    <form onSubmit={handleJsonSubmit}>
                      <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder='{"name": "Scheme Name", "type": "scholarship"...}' className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono mb-3 resize-none bg-white"></textarea>
                      <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg disabled:opacity-50 w-full">Save from JSON</button>
                    </form>
                  </div>
                  
                  <div className="relative mt-8 mb-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 text-slate-500 font-medium">Option 3: Add Manually</span></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveScheme} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
                    <input type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name (Hindi)</label>
                    <input type="text" value={formData.nameHi} onChange={e => setFormData({...formData, nameHi: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. scholarship" required className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                    <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="e.g. ALL, Gujarat" required className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Benefit Amount (₹)</label>
                    <input type="number" value={formData.benefitAmount} onChange={e => setFormData({...formData, benefitAmount: e.target.value})} required className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Income Eligibility (₹)</label>
                    <input type="number" value={formData.maxIncome} onChange={e => setFormData({...formData, maxIncome: e.target.value})} placeholder="Leave blank if none" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categories (comma-separated)</label>
                    <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="SC, ST, OBC" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Education (comma-separated)</label>
                    <input type="text" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} placeholder="10th, 12th, B.Tech" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation (comma-separated)</label>
                    <input type="text" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="Student, Farmer, etc." className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender (comma-separated)</label>
                    <input type="text" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} placeholder="Male, Female, Other" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Age</label>
                    <input type="number" value={formData.minAge} onChange={e => setFormData({...formData, minAge: e.target.value})} placeholder="0" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Age</label>
                    <input type="number" value={formData.maxAge} onChange={e => setFormData({...formData, maxAge: e.target.value})} placeholder="100" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Apply Link (URL)</label>
                    <input type="url" value={formData.applyLink} onChange={e => setFormData({...formData, applyLink: e.target.value})} placeholder="https://..." className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deadline Date</label>
                    <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Verified Date</label>
                    <input type="date" value={formData.lastVerifiedDate} onChange={e => setFormData({...formData, lastVerifiedDate: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="disability" checked={formData.disabilityRequired} onChange={e => setFormData({...formData, disabilityRequired: e.target.checked})} className="w-4 h-4 text-brand-600 rounded" />
                    <label htmlFor="disability" className="text-sm font-medium text-slate-700">Divyang (Disability) Required?</label>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="minority" checked={formData.minorityRequired} onChange={e => setFormData({...formData, minorityRequired: e.target.checked})} className="w-4 h-4 text-brand-600 rounded" />
                    <label htmlFor="minority" className="text-sm font-medium text-slate-700">Minority Required?</label>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Documents Required (comma-separated)</label>
                    <textarea value={formData.documentsRequired} onChange={e => setFormData({...formData, documentsRequired: e.target.value})} placeholder="Aadhar Card, Income Certificate, Bank Passbook..." className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 h-20 resize-none"></textarea>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg shadow-sm">Save Scheme</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default AdminDashboard;
