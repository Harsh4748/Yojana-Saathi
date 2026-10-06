const { GoogleGenerativeAI } = require("@google/generative-ai");

const LANG = { hi: 'Hindi', gu: 'Gujarati', en: 'English' };

function buildExplainPrompt(profile, scheme, language) {
  const isGeneral = !profile || Object.keys(profile).length === 0;
  
  return `
You are a helpful assistant for Indian citizens.
${isGeneral 
  ? `Explain in very simple ${LANG[language] || 'English'} (class 8 level) what this scheme is about, who is eligible, and what they will get.`
  : `Explain in very simple ${LANG[language] || 'English'} (class 8 level) why this person is eligible for the scheme, what they will get, and the next 3 steps to apply.`}
Use ONLY the data given. Do not invent numbers, dates or links.
At the very end of your response, add a new line: "💡 Tip: You can change the language from the top menu!" (Translate this tip to the requested language).

${isGeneral ? '' : `USER PROFILE: ${JSON.stringify(profile)}`}
SCHEME DATA: ${JSON.stringify({
    name: scheme.name.en, benefit: scheme.benefitAmount,
    eligibility: scheme.eligibility
  })}
Keep it under 100 words. Format with simple bullet points.`;
}

async function explain(profile, scheme, language) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return fallbackExplanation(scheme, language);
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildExplainPrompt(profile, scheme, language);
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("AI Error:", e.message || e);
    return fallbackExplanation(scheme, language);
  }
}

function fallbackExplanation(scheme, language) {
  if (language === 'hi') return `Aap is scheme ke liye qualify karte hain. Isme aapko fayda milega. Adhik jankari ke liye official website par check karein.`;
  if (language === 'gu') return `તમે આ યોજના માટે પાત્ર છો. તમને આમાં ફાયદો મળશે. વધુ માહિતી માટે સત્તાવાર વેબસાઇટ તપાસો.`;
  return `You qualify for this scheme and can benefit from it. Please check the official website for more details.`;
}

function buildChatPrompt(question, scheme, language, history) {
  const isGeneral = !scheme;
  return `
You are Yojana Saathi, a helper for scholarships and government schemes in India.
Answer in simple ${LANG[language] || 'English'}.
RULES:
- Answer ONLY from CONTEXT below, or use your general knowledge about Indian schemes if no context is provided.
- If the answer is not known, say: "Mujhe is baare mein pakki jaankari nahi hai, kripya official website check karein."
- Never guess income limits, dates or amounts.
- Be short (max 50 words).

CONTEXT:
${isGeneral ? 'General platform help. Inform users they can search schemes, check eligibility using the Profile Form, and view details.' : JSON.stringify({
    name: scheme.name?.en || 'Scheme', benefit: scheme.benefitAmount || 0,
    eligibility: scheme.eligibility || {}
})}

QUESTION: ${question}`;
}

async function chat(question, scheme, language, history) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "I don't have enough information right now. (Please set API Key)";
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = buildChatPrompt(question, scheme, language, history);
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("AI Chat Error:", e.message || e);
    return "Sorry, I couldn't understand or there was a network/quota error.";
  }
}

module.exports = { explain, chat };
