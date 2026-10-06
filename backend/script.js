const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb://127.0.0.1:27017/yojana_saathi').then(async () => {
  const Scheme = require('./models/Scheme');
  const data = JSON.parse(fs.readFileSync('temp_data.json', 'utf-8'));
  
  let updated = 0;
  let inserted = 0;
  
  for(let parsed of data) {
    const payload = {
      slug: Math.random().toString(36).substring(7),
      name: { en: parsed.name || '', hi: parsed.name_hi || '' },
      type: parsed.type || 'scholarship',
      state: parsed.state || 'ALL',
      benefitAmount: Number(parsed.benefit_amount || parsed.benefitAmount) || 0,
      documentsRequired: Array.isArray(parsed.documents_required) ? parsed.documents_required : (parsed.documentsRequired || []),
      applyLink: parsed.apply_link || parsed.applyLink || '',
      applySteps: Array.isArray(parsed.apply_steps) ? parsed.apply_steps : (parsed.applySteps || []),
      deadline: parsed.deadline ? new Date(parsed.deadline) : null,
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
    };
    
    const existing = await Scheme.findOne({ 'name.en': payload.name.en });
    if(existing) {
      await Scheme.updateOne({ _id: existing._id }, payload);
      updated++;
    } else {
      await Scheme.create(payload);
      inserted++;
    }
  }
  
  console.log(`Successfully processed! Inserted: ${inserted}, Updated: ${updated}`);
  process.exit(0);
}).catch(console.error);
