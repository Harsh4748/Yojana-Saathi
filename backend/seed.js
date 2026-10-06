const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');

const MONGO_URI = 'mongodb://127.0.0.1:27017/yojana_saathi';

const MOCK_SCHEMES = [
  {
    slug: 'mysy',
    name: { en: "MYSY Scholarship", hi: "MYSY स्कॉलरशिप", gu: "MYSY શિષ્યવૃત્તિ" },
    state: "Gujarat",
    type: "scholarship",
    level: "state",
    benefitAmount: 50000,
    eligibility: {
      maxIncome: 600000,
      education: ["UG", "Diploma"]
    }
  },
  {
    slug: 'post-matric-sc',
    name: { en: "Post Matric Scholarship for SC", hi: "SC छात्रों के लिए पोस्ट मैट्रिक स्कॉलरशिप" },
    state: "ALL",
    type: "scholarship",
    level: "central",
    benefitAmount: 15000,
    eligibility: {
      category: ["SC"],
      maxIncome: 250000
    }
  },
  {
    slug: 'pm-kisan',
    name: { en: "PM Kisan Samman Nidhi", hi: "पीएम किसान सम्मान निधि" },
    state: "ALL",
    type: "yojana",
    level: "central",
    benefitAmount: 6000,
    eligibility: {
      occupation: ["Farmer"]
    }
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Clearing old schemes...');
    await Scheme.deleteMany({});
    
    console.log('Inserting seed schemes...');
    await Scheme.insertMany(MOCK_SCHEMES);
    
    console.log('Schemes successfully added!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
