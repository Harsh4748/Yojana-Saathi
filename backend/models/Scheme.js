const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: {
    en: { type: String, required: true },
    hi: String,
    gu: String
  },
  description: { en: String, hi: String, gu: String },
  type: { type: String, enum: ['scholarship', 'yojana', 'loan', 'skill'], default: 'scholarship' },
  level: { type: String, enum: ['central', 'state'], default: 'state' },
  state: { type: String, default: 'ALL' },
  provider: String,

  eligibility: {
    minAge: Number,
    maxAge: Number,
    gender: [String],
    category: [String],
    maxIncome: Number,
    education: [String],
    occupation: [String],
    disabilityRequired: { type: Boolean, default: false },
    minorityRequired: { type: Boolean, default: false },
    otherConditions: [String]
  },

  benefit: { en: String, hi: String, gu: String },
  benefitAmount: Number,
  documentsRequired: [String],
  applySteps: [String],
  applyLink: String,
  deadline: Date,
  lastVerifiedDate: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', SchemeSchema);
