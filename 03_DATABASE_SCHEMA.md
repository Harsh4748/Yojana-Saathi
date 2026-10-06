# 03 - Database Schema (MongoDB + Mongoose)

Database name: `yojana_saathi`

## Collections
1. `schemes` (core data)
2. `admins`
3. `reminders`
4. `feedback`
5. `analytics` (optional)

---

## 1. schemes
```js
const SchemeSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },   // "post-matric-sc"
  name: {
    en: { type: String, required: true },
    hi: String,
    gu: String
  },
  description: { en: String, hi: String, gu: String },
  type: { type: String, enum: ['scholarship', 'yojana', 'loan', 'skill'], required: true },
  level: { type: String, enum: ['central', 'state'], required: true },
  state: { type: String, default: 'ALL' },                // "Gujarat" ya "ALL"
  provider: String,                                        // "Ministry of Social Justice"

  eligibility: {
    minAge: Number,
    maxAge: Number,
    gender: [String],            // ["Female"]; empty = sab
    category: [String],          // ["SC","ST"]; empty = sab
    maxIncome: Number,           // annual family income
    education: [String],         // ["UG","PG"]; empty = sab
    occupation: [String],        // ["Student","Farmer"]
    disabilityRequired: Boolean, // true = sirf divyang
    minorityRequired: Boolean,
    otherConditions: [String]    // free-text notes (rule engine skip karta hai)
  },

  benefit: { en: String, hi: String, gu: String },
  benefitAmount: Number,         // optional, sorting ke liye
  documents: [{
    name: { en: String, hi: String, gu: String },
    howToGet: { en: String, hi: String, gu: String }
  }],
  applySteps: [{ en: String, hi: String, gu: String }],
  applyLink: String,
  deadline: Date,                // null = year-round
  isActive: { type: Boolean, default: true },
  lastVerifiedOn: Date,
  sourceUrl: String
}, { timestamps: true });

SchemeSchema.index({ 'name.en': 'text', 'description.en': 'text', provider: 'text' });
SchemeSchema.index({ type: 1, state: 1, isActive: 1 });
```

## 2. admins
```js
{
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'admin' }
}
```

## 3. reminders
```js
{
  email: String,
  schemeId: { type: ObjectId, ref: 'Scheme' },
  remindOn: [Date],        // deadline - 7 days, deadline - 1 day
  sent: [Boolean],
  language: String
}
```

## 4. feedback
```js
{
  helpful: Boolean,
  comment: String,
  language: String,
  createdAt: Date
}
```

## 5. analytics (optional, anonymous)
```js
{
  date: Date,
  totalMatches: Number,
  topSchemes: [{ schemeId: ObjectId, count: Number }]
}
```

## Notes
- **User profile ko kabhi store nahi karna** (privacy).
- Multi-language fields object mein rakhe hain taaki naya language add karna aasan ho.
- `lastVerifiedOn` UI mein dikhao, trust badhta hai.
