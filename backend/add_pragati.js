require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yojana_saathi')
.then(async () => {
  console.log('MongoDB Connected to yojana_saathi');
  
  const pragatiScheme = {
    slug: 'aicte-pragati-scholarship-girls',
    name: {
      en: "AICTE Pragati Scholarship Scheme for Girls",
      hi: "एआईसीटीई प्रगति छात्रवृत्ति योजना (लड़कियों के लिए)",
      gu: "એઆઈસીટીઈ પ્રગતિ સ્કોલરશિપ યોજના (છોકરીઓ માટે)"
    },
    type: "scholarship",
    state: "ALL",
    benefitAmount: 50000,
    eligibility: {
      maxIncome: 800000,
      gender: "Female",
      category: ["General", "SC", "ST", "OBC", "EWS"],
      education: ["Diploma", "UG"],
      occupation: ["Student"]
    },
    // Adding extra fields as metadata/description for AI
    description: "Financial assistance for eligible girls pursuing technical degree or diploma education. Documents required: Academic marksheet, Income certificate, Admission proof, Institute certificate, Tuition fee receipt, Aadhaar, Bank account details."
  };

  try {
    const existing = await Scheme.findOne({ slug: pragatiScheme.slug });
    if (existing) {
      console.log('Scheme already exists!');
    } else {
      await Scheme.create(pragatiScheme);
      console.log('AICTE Pragati Scholarship added successfully!');
    }
  } catch (error) {
    console.error('Error inserting scheme:', error);
  }
  
  mongoose.disconnect();
})
.catch(err => console.log(err));
