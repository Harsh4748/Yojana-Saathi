const { matchSchemes } = require('../services/eligibilityEngine');
const Scheme = require('../models/Scheme');

// Mock Data for Hackathon MVP
const MOCK_SCHEMES = [
  {
    name: { en: "MYSY Scholarship", hi: "MYSY स्कॉलरशिप" },
    state: "Gujarat",
    benefitAmount: 50000,
    eligibility: {
      maxIncome: 600000,
      education: ["UG", "Diploma"]
    }
  },
  {
    name: { en: "Post Matric Scholarship for SC", hi: "SC छात्रों के लिए पोस्ट मैट्रिक स्कॉलरशिप" },
    state: "ALL",
    benefitAmount: 15000,
    eligibility: {
      category: ["SC"],
      maxIncome: 250000
    }
  },
  {
    name: { en: "PM Kisan Samman Nidhi", hi: "पीएम किसान सम्मान निधि" },
    state: "ALL",
    benefitAmount: 6000,
    eligibility: {
      occupation: ["Farmer"]
    }
  }
];

exports.match = async (req, res) => {
  try {
    const profile = req.body;
    
    // Fetch active schemes from MongoDB
    const schemes = await Scheme.find({ isActive: true }).lean();
    
    const result = matchSchemes(profile, schemes);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    await Scheme.findByIdAndDelete(id);
    res.json({ success: true, message: "Scheme deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete scheme", error: error.message });
  }
};

exports.createScheme = async (req, res) => {
  try {
    const newScheme = await Scheme.create(req.body);
    res.json({ success: true, message: "Scheme created successfully", data: newScheme });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create scheme", error: error.message });
  }
};

exports.updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedScheme = await Scheme.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: "Scheme updated successfully", data: updatedScheme });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update scheme", error: error.message });
  }
};

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).lean();
    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getOptions = async (req, res) => {
  try {
    const states = await Scheme.distinct('state', { isActive: true });
    const categories = await Scheme.distinct('eligibility.category', { isActive: true });
    const educations = await Scheme.distinct('eligibility.education', { isActive: true });
    const occupations = await Scheme.distinct('eligibility.occupation', { isActive: true });

    res.json({
      success: true,
      data: {
        states: states.filter(s => s && s !== 'ALL').sort(),
        categories: categories.filter(Boolean).sort(),
        educations: educations.filter(Boolean).sort(),
        occupations: occupations.filter(Boolean).sort()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const csv = require('csvtojson');
exports.uploadSchemes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    
    const jsonArray = await csv().fromFile(req.file.path);
    const formattedSchemes = jsonArray.map(row => {
      const getArray = (val) => {
        if (!val || val.toLowerCase() === 'all' || val.toLowerCase() === 'null') return [];
        return val.split(',').map(s => s.trim()).filter(Boolean);
      };

      return {
        slug: row.slug || Math.random().toString(36).substring(7),
        name: { en: row.name_en || row.name || '', hi: row.name_hi || '', gu: row.name_gu || '' },
        benefitAmount: Number(row.benefitAmount || row.benefit_amount) || 0,
        state: row.state || 'ALL',
        type: row.type || 'scholarship',
        documentsRequired: getArray(row.documentsRequired || row.documents_required),
        applyLink: row.applyLink || row.apply_link || '',
        applySteps: getArray(row.applySteps || row.apply_steps),
        deadline: (row.deadline) ? new Date(row.deadline) : null,
        lastVerifiedDate: (row.lastVerifiedDate || row.last_verified_date) ? new Date(row.lastVerifiedDate || row.last_verified_date) : null,
        eligibility: {
          maxIncome: (row.maxIncome || row.max_income) ? Number(row.maxIncome || row.max_income) : null,
          minAge: (row.minAge || row.min_age) ? Number(row.minAge || row.min_age) : null,
          maxAge: (row.maxAge || row.max_age) ? Number(row.maxAge || row.max_age) : null,
          education: getArray(row.education),
          category: getArray(row.category),
          gender: getArray(row.gender),
          occupation: getArray(row.occupation),
          disabilityRequired: String(row.disability || row.disabilityRequired).toLowerCase() === 'yes' || String(row.disability || row.disabilityRequired).toLowerCase() === 'true',
          minorityRequired: String(row.minority || row.minorityRequired).toLowerCase() === 'yes' || String(row.minority || row.minorityRequired).toLowerCase() === 'true'
        }
      };
    });

    await Scheme.insertMany(formattedSchemes);
    res.json({ success: true, message: `${formattedSchemes.length} schemes uploaded successfully!` });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Failed to upload schemes", error: error.message });
  }
};
