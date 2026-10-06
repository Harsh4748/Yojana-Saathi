const { explain, chat } = require('../services/aiService');

exports.explainScheme = async (req, res) => {
  try {
    const { profile, scheme, language } = req.body;
    if (!scheme) return res.status(400).json({ success: false, message: "Scheme is required" });
    
    const lang = language || 'hi';
    const explanation = await explain(profile, scheme, lang);
    
    res.json({ success: true, explanation });
  } catch (error) {
    res.status(500).json({ success: false, message: "AI Error", error: error.message });
  }
};

exports.chatWithBot = async (req, res) => {
  try {
    const { question, scheme, language, history } = req.body;
    if (!question || !scheme) return res.status(400).json({ success: false, message: "Question and Scheme are required" });
    
    const reply = await chat(question, scheme, language, history);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, message: "Chat Error", error: error.message });
  }
};
