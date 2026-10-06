# 09 - Sample Scheme Data (Seed)

> **Important:** Ye sirf format samajhne ke liye sample hai. Income limit, benefit aur deadline har saal badalte hain. **Official website se verify karke hi final data daalo.**

## Seed file: `server/seed/schemes.json`
```json
[
  {
    "slug": "post-matric-sc",
    "name": { "en": "Post Matric Scholarship for SC Students", "hi": "एससी छात्रों के लिए पोस्ट मैट्रिक छात्रवृत्ति", "gu": "SC વિદ્યાર્થીઓ માટે પોસ્ટ મેટ્રિક શિષ્યવૃત્તિ" },
    "type": "scholarship",
    "level": "central",
    "state": "ALL",
    "provider": "Ministry of Social Justice and Empowerment",
    "eligibility": {
      "category": ["SC"],
      "maxIncome": 250000,
      "education": ["12th", "Diploma", "UG", "PG"]
    },
    "benefit": { "en": "Fee reimbursement and maintenance allowance", "hi": "फीस और मेंटेनेंस भत्ता", "gu": "ફી અને નિર્વાહ ભથ્થું" },
    "documents": [
      { "name": { "en": "Aadhaar Card" } },
      { "name": { "en": "Caste Certificate" }, "howToGet": { "en": "Taluka/Mamlatdar office or Digital Gujarat portal" } },
      { "name": { "en": "Income Certificate" }, "howToGet": { "en": "Mamlatdar office or online state portal" } },
      { "name": { "en": "Previous Marksheet" } },
      { "name": { "en": "Bank Passbook" } }
    ],
    "applySteps": [
      { "en": "Register on National Scholarship Portal" },
      { "en": "Fill application and upload documents" },
      { "en": "Submit to institute for verification" }
    ],
    "applyLink": "https://scholarships.gov.in",
    "isActive": true,
    "sourceUrl": "https://scholarships.gov.in"
  },
  {
    "slug": "mysy-gujarat",
    "name": { "en": "Mukhyamantri Yuva Swavalamban Yojana (MYSY)" },
    "type": "scholarship",
    "level": "state",
    "state": "Gujarat",
    "provider": "Government of Gujarat",
    "eligibility": {
      "maxIncome": 600000,
      "education": ["UG", "PG", "Diploma"],
      "occupation": ["Student"]
    },
    "benefit": { "en": "Tuition fee assistance for higher education" },
    "documents": [
      { "name": { "en": "Aadhaar Card" } },
      { "name": { "en": "12th Marksheet" } },
      { "name": { "en": "Income Certificate" } }
    ],
    "applyLink": "https://mysy.guj.nic.in",
    "isActive": true,
    "sourceUrl": "https://mysy.guj.nic.in"
  },
  {
    "slug": "pm-kisan",
    "name": { "en": "PM-KISAN Samman Nidhi" },
    "type": "yojana",
    "level": "central",
    "state": "ALL",
    "provider": "Ministry of Agriculture",
    "eligibility": { "occupation": ["Farmer"] },
    "benefit": { "en": "Rs. 6,000 per year in 3 installments (verify current amount)" },
    "benefitAmount": 6000,
    "documents": [
      { "name": { "en": "Aadhaar Card" } },
      { "name": { "en": "Land records" } },
      { "name": { "en": "Bank account details" } }
    ],
    "applyLink": "https://pmkisan.gov.in",
    "isActive": true,
    "sourceUrl": "https://pmkisan.gov.in"
  }
]
```

## Seed script: `server/seed/seed.js`
```js
require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const data = require('./schemes.json');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Scheme.deleteMany({});
  await Scheme.insertMany(data.map(s => ({ ...s, lastVerifiedOn: new Date() })));
  console.log(`Seeded ${data.length} schemes`);
  process.exit(0);
})();
```

## Schemes ki list jo collect karni hain (target: 20-25)
**Scholarships**
- Post Matric Scholarship (SC / ST / OBC / Minority)
- Pre Matric Scholarship
- AICTE Pragati (girls), AICTE Saksham (divyang)
- Central Sector Scholarship
- Gujarat: MYSY, Digital Gujarat scholarships
- Merit-cum-Means for minorities

**Yojana**
- PM-KISAN, Ayushman Bharat (PM-JAY), PM Ujjwala
- PM Awas Yojana, Sukanya Samriddhi
- Atal Pension Yojana

**Skill / Loan**
- PM Kaushal Vikas Yojana, Mudra Loan, Stand-Up India

## Data Collection Checklist (har scheme ke liye)
- [ ] Official name + provider
- [ ] Eligibility (age, income, category, education, state)
- [ ] Benefit amount
- [ ] Documents list
- [ ] Apply steps + link
- [ ] Deadline (ya year-round)
- [ ] Source URL + verify date
