import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowLeft, ExternalLink, Languages } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';

function Results() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No results found</h2>
        <button onClick={() => navigate('/profile')} className="px-6 py-2 bg-brand-500 text-white rounded-lg">Go back to Profile Form</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} /> Back to Profile
          </button>
          
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
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900">Your Matches</h2>
          <p className="mt-2 text-slate-600">We checked {results.totalChecked} schemes against your profile.</p>
        </div>

        {/* Eligible Schemes */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Eligible Schemes ({results.eligible?.length || 0})
          </h3>
          <div className="space-y-4">
            {results.eligible?.map((item, idx) => (
              <div key={idx} className="glass-card p-6 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{item.scheme.name.en} / {item.scheme.name.hi}</h4>
                    <p className="text-sm text-slate-500 mt-1">State: {item.scheme.state}</p>
                    <p className="font-semibold text-green-700 mt-2">Benefit: ₹{item.scheme.benefitAmount}</p>
                    {item.scheme.deadline && (
                      <p className="text-sm text-red-500 font-medium mt-1 flex items-center gap-1">
                        Last Date: {new Date(item.scheme.deadline).toLocaleDateString('en-GB')}
                      </p>
                    )}
                    {item.scheme.lastVerifiedDate && (
                      <p className="text-xs text-slate-400 mt-1">
                        ✓ Verified on {new Date(item.scheme.lastVerifiedDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold shrink-0">
                    {item.matchPercent}% Match
                  </div>
                </div>
                <button onClick={() => navigate('/scheme', { state: { scheme: item.scheme, profile: location.state?.profile } })} className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Details & Apply <ExternalLink size={16} />
                </button>
              </div>
            ))}
            {results.eligible?.length === 0 && <p className="text-slate-500">No eligible schemes found for your exact profile.</p>}
          </div>
        </div>

        {/* Near Miss Schemes */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" /> Near-Miss Schemes ({results.nearMiss?.length || 0})
          </h3>
          <p className="text-slate-500 mb-4">You missed these by just one requirement (e.g., slightly higher income).</p>
          <div className="space-y-4">
            {results.nearMiss?.map((item, idx) => (
              <div key={idx} className="glass-card p-6 border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{item.scheme.name.en} / {item.scheme.name.hi}</h4>
                    <p className="text-sm text-slate-500 mt-1">State: {item.scheme.state}</p>
                    <p className="font-semibold text-amber-700 mt-2">Benefit: ₹{item.scheme.benefitAmount}</p>
                    {item.scheme.deadline && (
                      <p className="text-sm text-red-500 font-medium mt-1 flex items-center gap-1">
                        Last Date: {new Date(item.scheme.deadline).toLocaleDateString('en-GB')}
                      </p>
                    )}
                    {item.scheme.lastVerifiedDate && (
                      <p className="text-xs text-slate-400 mt-1">
                        ✓ Verified on {new Date(item.scheme.lastVerifiedDate).toLocaleDateString('en-GB')}
                      </p>
                    )}
                    <div className="mt-3 bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm">
                      <span className="font-semibold text-amber-900">Why you missed it: </span>
                      <span className="text-amber-800">Your {item.failed[0].field} is {item.failed[0].yourValue}, but required is {item.failed[0].required}. (Gap: {item.failed[0].gap})</span>
                    </div>
                  </div>
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold">
                    {item.matchPercent}% Match
                  </div>
                </div>
              </div>
            ))}
            {results.nearMiss?.length === 0 && <p className="text-slate-500">No near-miss schemes.</p>}
          </div>
        </div>

      </div>
      
      {/* Global Chatbot for Results Page */}
      <Chatbot />
      <Footer />
    </div>
  );
}

export default Results;
