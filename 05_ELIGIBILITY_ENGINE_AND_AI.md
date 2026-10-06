# 05 - Eligibility Engine & AI Design

## Principle
> **Code decide karta hai, AI samjhata hai.**
> Eligibility ka final decision rule engine se aata hai. LLM sirf explain karta hai.

---

## 1. Eligibility Engine (Node.js)

File: `server/services/eligibilityEngine.js`

```js
// Har rule ek chhota function hai: { ok, weight, reason, gap }
const rules = [
  {
    field: 'age',
    check: (p, e) => {
      if (e.minAge != null && p.age < e.minAge) return { ok: false, gap: e.minAge - p.age, required: `>= ${e.minAge}` };
      if (e.maxAge != null && p.age > e.maxAge) return { ok: false, gap: p.age - e.maxAge, required: `<= ${e.maxAge}` };
      return { ok: true };
    }
  },
  {
    field: 'gender',
    check: (p, e) => (!e.gender?.length || e.gender.includes(p.gender))
      ? { ok: true } : { ok: false, required: e.gender.join('/') }
  },
  {
    field: 'category',
    check: (p, e) => (!e.category?.length || e.category.includes(p.category))
      ? { ok: true } : { ok: false, required: e.category.join('/') }
  },
  {
    field: 'income',
    check: (p, e) => (e.maxIncome == null || p.income <= e.maxIncome)
      ? { ok: true }
      : { ok: false, gap: p.income - e.maxIncome, required: `<= ${e.maxIncome}` }
  },
  {
    field: 'education',
    check: (p, e) => (!e.education?.length || e.education.includes(p.education))
      ? { ok: true } : { ok: false, required: e.education.join('/') }
  },
  {
    field: 'occupation',
    check: (p, e) => (!e.occupation?.length || e.occupation.includes(p.occupation))
      ? { ok: true } : { ok: false, required: e.occupation.join('/') }
  },
  {
    field: 'disability',
    check: (p, e) => (!e.disabilityRequired || p.disability)
      ? { ok: true } : { ok: false, required: 'Divyang' }
  },
  {
    field: 'minority',
    check: (p, e) => (!e.minorityRequired || p.minority)
      ? { ok: true } : { ok: false, required: 'Minority' }
  }
];

function evaluateScheme(profile, scheme) {
  // State check
  if (scheme.state !== 'ALL' && scheme.state !== profile.state) return null;

  const failed = [];
  const passed = [];

  for (const rule of rules) {
    const res = rule.check(profile, scheme.eligibility || {});
    if (res.ok) passed.push(rule.field);
    else failed.push({ field: rule.field, yourValue: profile[rule.field], ...res });
  }

  const total = rules.length;
  const matchPercent = Math.round((passed.length / total) * 100);

  if (failed.length === 0) return { status: 'eligible', matchPercent, passed, failed };
  if (failed.length === 1 && failed[0].field === 'income') {
    return { status: 'nearMiss', matchPercent, passed, failed };
  }
  if (failed.length === 1) return { status: 'nearMiss', matchPercent, passed, failed };
  return { status: 'notEligible', matchPercent, passed, failed };
}

function matchSchemes(profile, schemes) {
  const eligible = [], nearMiss = [];
  for (const scheme of schemes) {
    const r = evaluateScheme(profile, scheme);
    if (!r) continue;
    if (r.status === 'eligible') eligible.push({ scheme, ...r });
    else if (r.status === 'nearMiss') nearMiss.push({ scheme, ...r });
  }
  eligible.sort((a, b) => (b.scheme.benefitAmount || 0) - (a.scheme.benefitAmount || 0));
  return { eligible, nearMiss, totalChecked: schemes.length };
}

module.exports = { matchSchemes, evaluateScheme };
```

### Controller (use)
```js
// server/controllers/matchController.js
const Scheme = require('../models/Scheme');
const { matchSchemes } = require('../services/eligibilityEngine');

exports.match = async (req, res, next) => {
  try {
    const profile = req.body;                       // validated by middleware
    const schemes = await Scheme.find({ isActive: true }).lean();
    res.json(matchSchemes(profile, schemes));
  } catch (err) { next(err); }
};
```

---

## 2. AI Explanation Service

File: `server/services/aiService.js`

Provider-agnostic wrapper. Kisi bhi LLM (Gemini/OpenAI/Claude) ka SDK yahan plug karo.

```js
const LANG = { hi: 'Hindi', gu: 'Gujarati', en: 'English' };

function buildExplainPrompt(profile, scheme, language) {
  return `
You are a helpful assistant for Indian citizens.
Explain in very simple ${LANG[language]} (class 8 level) why this person is eligible
for the scheme, what they will get, and the next 3 steps to apply.
Use ONLY the data given. Do not invent numbers, dates or links.

USER PROFILE: ${JSON.stringify(profile)}
SCHEME DATA: ${JSON.stringify({
    name: scheme.name.en, benefit: scheme.benefit.en,
    eligibility: scheme.eligibility, documents: scheme.documents.map(d => d.name.en),
    applySteps: scheme.applySteps.map(s => s.en), deadline: scheme.deadline
  })}
Keep it under 120 words.`;
}

async function explain(profile, scheme, language) {
  try {
    const prompt = buildExplainPrompt(profile, scheme, language);
    return await callLLM(prompt);          // callLLM = tumhara LLM SDK call
  } catch (e) {
    return fallbackExplanation(scheme, language);   // AI fail hone par
  }
}

function fallbackExplanation(scheme, language) {
  return `${scheme.name[language] || scheme.name.en}: ${scheme.benefit[language] || scheme.benefit.en}`;
}

module.exports = { explain, buildExplainPrompt };
```

---

## 3. Chatbot (RAG) Prompt

```js
function buildChatPrompt(question, contextSchemes, language, history) {
  return `
You are Yojana Saathi, a helper for scholarships and government schemes in India.
Answer in simple ${LANG[language]}.
RULES:
- Answer ONLY from CONTEXT below.
- If the answer is not in CONTEXT, say: "Mujhe pakki jaankari nahi hai, kripya official website check karein."
- Never guess income limits, dates or amounts.
- Be short (max 100 words).

CONTEXT:
${JSON.stringify(contextSchemes)}

CHAT HISTORY: ${JSON.stringify(history.slice(-4))}
QUESTION: ${question}`;
}
```

**Context kaise nikaale:**
1. Agar `schemeSlug` mila to wahi scheme.
2. Warna `Scheme.find({ $text: { $search: question } }).limit(3)`.

---

## 4. Safety Rules for AI
- Prompt injection se bachne ke liye user input ko clearly "QUESTION" mein hi rakho.
- AI ko income/date khud decide karne mat do.
- Har AI answer ke neeche disclaimer: "Official site par verify karein."
- AI response ko 8-10 second timeout do, uske baad fallback.

## 5. Testing Checklist (Engine)
- [ ] Income exactly limit par (200000 vs 200000) eligible aaye
- [ ] Income 1 rupee zyada hone par nearMiss aaye
- [ ] Gender-specific scheme male ko na dikhe
- [ ] Other state ki scheme filter ho jaye
- [ ] Empty eligibility array = sab ke liye open
