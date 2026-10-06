import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Languages, Search, Mic, Filter, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useEffect, useState } from 'react';

function Home() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOccupation, setFilterOccupation] = useState('');
  const [occupations, setOccupations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/options')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOccupations(data.data.occupations || []);
        }
      })
      .catch(console.error);

    fetch('http://localhost:5000/api/schemes')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSchemes(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleLanguageChange = () => {
    if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('gu');
    else setLanguage('en');
  };
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-[40%] left-[60%] w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Navigation */}
      <nav className="glass-panel mx-4 mt-4 lg:mx-auto lg:max-w-6xl px-6 py-4 flex justify-between items-center z-10 relative sticky top-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Yojana Saathi</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Languages size={18} className="absolute left-3 text-slate-500 pointer-events-none" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer appearance-none shadow-sm transition-all"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>
          <button onClick={() => navigate('/admin')} className="hidden sm:block px-5 py-2 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100">
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-600 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          Hackathon Demo Live
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
          Aapka Haq,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">
            Aapke Tak.
          </span>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Find scholarships and government schemes you are eligible for in seconds. Powered by AI, explained in your language.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <Link to="/profile" className="group relative px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg overflow-hidden shadow-2xl hover:shadow-slate-900/20 transition-all hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">Check Eligibility <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
          </Link>
          
          {/* 
          <button className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2">
            <Mic size={20} className="text-brand-500" />
            Voice Search
          </button>
          */}
        </div>

        {/* Available Schemes Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Available Schemes</h2>
            <p className="mt-2 text-lg text-slate-600">Explore the list of schemes and see what you qualify for.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center"><div className="animate-pulse flex gap-2"><div className="w-3 h-3 bg-brand-500 rounded-full"></div><div className="w-3 h-3 bg-brand-500 rounded-full animation-delay-200"></div><div className="w-3 h-3 bg-brand-500 rounded-full animation-delay-400"></div></div></div>
          ) : (
            <>
              <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search schemes by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                  />
                </div>
                <div className="md:w-64 relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                  <select 
                    value={filterOccupation}
                    onChange={(e) => setFilterOccupation(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm appearance-none font-medium text-slate-700 cursor-pointer hover:border-brand-300 transition-colors"
                  >
                    <option value="">All Occupations</option>
                    {occupations.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.filter(s => {
                  const matchesSearch = (s.name.en || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.name.hi || '').toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesOcc = !filterOccupation || (s.eligibility?.occupation || []).includes(filterOccupation);
                  return matchesSearch && matchesOcc;
                }).map((scheme, idx) => (
                <div key={idx} onClick={() => navigate('/scheme', { state: { scheme } })} className="glass-card p-6 border-t-4 border-t-brand-500 hover:-translate-y-1 transition-transform cursor-pointer h-full flex flex-col">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wide">
                      {scheme.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-3 leading-snug">{scheme.name.en}</h3>
                  <h4 className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">{scheme.name.hi}</h4>
                  <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-slate-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">State: <span className="font-semibold">{scheme.state}</span></span>
                      <span className="text-green-600 font-bold">₹{scheme.benefitAmount}</span>
                    </div>
                    {scheme.deadline && (
                      <div className="text-xs text-red-500 font-medium flex justify-end mt-1">
                        Last Date: {new Date(scheme.deadline).toLocaleDateString('en-GB')}
                      </div>
                    )}
                    {scheme.lastVerifiedDate && (
                      <div className="text-xs text-slate-400 flex justify-end mt-1">
                        ✓ Verified on {new Date(scheme.lastVerifiedDate).toLocaleDateString('en-GB')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {schemes.filter(s => {
                const matchesSearch = (s.name.en || '').toLowerCase().includes(searchQuery.toLowerCase()) || (s.name.hi || '').toLowerCase().includes(searchQuery.toLowerCase());
                const matchesOcc = !filterOccupation || (s.eligibility?.occupation || []).includes(filterOccupation);
                return matchesSearch && matchesOcc;
              }).length === 0 && (
                <p className="col-span-full text-center text-slate-500">No matching schemes found.</p>
              )}
            </div>
            </>
          )}
        </div>

        {/* Feature Cards */}
        <div className="mt-32 pb-20 grid md:grid-cols-3 gap-6 text-left relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">100% Accurate</h3>
            <p className="text-slate-600">Our rule engine checks your eligibility precisely against official government criteria without any AI hallucinations.</p>
          </div>
          
          <div className="glass-card p-6 transform hover:-translate-y-2 transition-all duration-300 delay-100">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Languages size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Simple Language</h3>
            <p className="text-slate-600">Complex government documents are simplified and explained by AI in Hindi, Gujarati, or English.</p>
          </div>

          <div className="glass-card p-6 transform hover:-translate-y-2 transition-all duration-300 delay-200">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Near-Miss Hints</h3>
            <p className="text-slate-600">Missed a scheme by a small margin? We'll tell you exactly why and suggest alternatives immediately.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
