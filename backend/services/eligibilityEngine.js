const rules = [
  { field: 'age', check: (p, e) => { if (e.minAge != null && p.age < e.minAge) return { ok: false, gap: e.minAge - p.age, required: `>= ${e.minAge}` }; if (e.maxAge != null && p.age > e.maxAge) return { ok: false, gap: p.age - e.maxAge, required: `<= ${e.maxAge}` }; return { ok: true }; } },
  { field: 'gender', check: (p, e) => (!e.gender?.length || e.gender.some(g => g.toLowerCase() === (p.gender || '').toLowerCase())) ? { ok: true } : { ok: false, required: e.gender.join('/') } },
  { field: 'category', check: (p, e) => (!e.category?.length || e.category.includes(p.category)) ? { ok: true } : { ok: false, required: e.category.join('/') } },
  { field: 'income', check: (p, e) => (e.maxIncome == null || p.income <= e.maxIncome) ? { ok: true } : { ok: false, gap: p.income - e.maxIncome, required: `<= ${e.maxIncome}` } },
  { field: 'education', check: (p, e) => (!e.education?.length || e.education.includes(p.education)) ? { ok: true } : { ok: false, required: e.education.join('/') } },
  { field: 'occupation', check: (p, e) => (!e.occupation?.length || e.occupation.includes(p.occupation)) ? { ok: true } : { ok: false, required: e.occupation.join('/') } },
  { field: 'disability', check: (p, e) => (!e.disabilityRequired || p.disability) ? { ok: true } : { ok: false, required: 'Divyang' } },
  { field: 'minority', check: (p, e) => (!e.minorityRequired || p.minority) ? { ok: true } : { ok: false, required: 'Minority' } }
];

function evaluateScheme(profile, scheme) {
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
  if (failed.length === 1 && failed[0].field === 'income') return { status: 'nearMiss', matchPercent, passed, failed };
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
