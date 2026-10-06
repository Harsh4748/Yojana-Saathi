import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Link as LinkIcon, Sparkles } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import { useLanguage } from '../LanguageContext';
import Footer from '../components/Footer';

function SchemeDetail() {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { scheme, profile } = location.state || { scheme: null, profile: null };

  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (scheme) {
      fetchAiExplanation();
    }
  }, [scheme, profile, language]);

  const fetchAiExplanation = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme, profile, language }) 
      });
      const data = await response.json();
      if (data.success) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation("AI explanation could not be generated.");
      }
    } catch (err) {
      setAiExplanation("Failed to connect to AI Service.");
    }
    setLoadingAi(false);
  };

  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No scheme selected</h2>
        <button onClick={() => navigate('/results')} className="px-6 py-2 bg-brand-500 text-white rounded-lg">Go back to Results</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={18} /> Back
          </button>
          
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium text-sm appearance-none cursor-pointer shadow-sm"
          >
            <option value="en">🇬🇧 English</option>
            <option value="hi">🇮🇳 Hindi</option>
            <option value="gu">🇮🇳 Gujarati</option>
          </select>
        </div>

        {/* Header */}
        <div className="glass-card p-8 mb-8 border-t-4 border-t-brand-500">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-4">
            {scheme.state === 'ALL' ? 'Central Scheme' : `${scheme.state} State Scheme`}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{scheme.name.en}</h1>
          <h2 className="text-xl font-medium text-slate-600 mb-6">{scheme.name.hi}</h2>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="bg-slate-100 px-4 py-2 rounded-lg font-semibold text-slate-800">
              Benefit: <span className="text-green-600">₹{scheme.benefitAmount}</span>
            </div>
            {scheme.deadline && (
              <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-lg font-semibold text-red-700 flex items-center gap-2">
                Last Date: {new Date(scheme.deadline).toLocaleDateString('en-GB')}
              </div>
            )}
            {scheme.lastVerifiedDate && (
              <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg font-medium text-slate-500 flex items-center gap-2">
                ✓ Verified on {new Date(scheme.lastVerifiedDate).toLocaleDateString('en-GB')}
              </div>
            )}
            {scheme.applyLink ? (
              <a href={scheme.applyLink.startsWith('http') ? scheme.applyLink : `https://${scheme.applyLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors shadow-sm">
                Apply Now <LinkIcon size={16} />
              </a>
            ) : (
              <button disabled className="flex items-center gap-2 px-6 py-2 bg-slate-300 text-slate-500 rounded-lg font-semibold cursor-not-allowed">
                Apply Offline Only
              </button>
            )}
          </div>
        </div>

        {/* AI Explanation (FR-7) */}
        <div className="glass-card p-8 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles size={100} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
            <Sparkles className="text-purple-500" /> AI Guide (Yojana Saathi)
          </h3>
          <div className="prose prose-slate max-w-none relative z-10">
            {loadingAi ? (
              <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                <div className="w-4 h-4 rounded-full bg-purple-400"></div>
                <div className="w-4 h-4 rounded-full bg-purple-400 animation-delay-200"></div>
                <div className="w-4 h-4 rounded-full bg-purple-400 animation-delay-400"></div>
                <span className="ml-2">Reading the scheme rules for you...</span>
              </div>
            ) : (
              <p className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                {aiExplanation}
              </p>
            )}
          </div>
        </div>

        {/* Basic Eligibility Requirements */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Basic Eligibility Requirements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scheme.eligibility?.minAge || scheme.eligibility?.maxAge ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Age Limit</div>
                <div className="font-semibold text-slate-800">
                  {scheme.eligibility.minAge ? `${scheme.eligibility.minAge}+ ` : 'Any '} 
                  {scheme.eligibility.maxAge ? `(Max: ${scheme.eligibility.maxAge})` : ''}
                </div>
              </div>
            ) : null}
            
            {scheme.eligibility?.gender?.length > 0 ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Gender</div>
                <div className="font-semibold text-slate-800">{scheme.eligibility.gender.join(', ')}</div>
              </div>
            ) : null}
            
            {scheme.eligibility?.maxIncome ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Family Income</div>
                <div className="font-semibold text-slate-800">Up to ₹{scheme.eligibility.maxIncome.toLocaleString()}</div>
              </div>
            ) : null}

            {scheme.eligibility?.category?.length > 0 ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Category</div>
                <div className="font-semibold text-slate-800">{scheme.eligibility.category.join(', ')}</div>
              </div>
            ) : null}

            {scheme.eligibility?.education?.length > 0 ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Education</div>
                <div className="font-semibold text-slate-800">{scheme.eligibility.education.join(', ')}</div>
              </div>
            ) : null}
            
            {scheme.eligibility?.occupation?.length > 0 ? (
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Occupation</div>
                <div className="font-semibold text-slate-800">{scheme.eligibility.occupation.join(', ')}</div>
              </div>
            ) : null}
          </div>
          {Object.keys(scheme.eligibility || {}).length === 0 && (
            <p className="text-slate-500 italic">No specific basic eligibility criteria listed.</p>
          )}
        </div>

        {/* Details Checklist */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Documents Required</h3>
            <ul className="space-y-3">
              {(scheme.documentsRequired && scheme.documentsRequired.length > 0 ? scheme.documentsRequired : ['Aadhar Card', 'Income Certificate', 'Bank Passbook', 'Passport Size Photo']).map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-brand-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Application Steps</h3>
            <ol className="space-y-4 pl-2">
              <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Visit the official portal.</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Register using Aadhar & Mobile.</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Fill form & upload documents.</li>
              <li className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-brand-500 before:rounded-full">Submit and save reference number.</li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* RAG Chatbot Integration */}
      {/* <Chatbot scheme={scheme} /> */}
      <Footer />
    </div>
  );
}

export default SchemeDetail;
