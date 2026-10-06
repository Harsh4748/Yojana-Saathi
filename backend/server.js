const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const matchRoutes = require('./controllers/matchController');
const aiRoutes = require('./controllers/aiController');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Main API Route for Eligibility matching
app.post('/api/match', matchRoutes.match);
// Get All Schemes
app.get('/api/schemes', matchRoutes.getAllSchemes);
// Get Options for Dropdowns
app.get('/api/options', matchRoutes.getOptions);
// Admin Upload CSV
app.post('/api/admin/upload', upload.single('file'), matchRoutes.uploadSchemes);
// Admin Delete Scheme
app.delete('/api/admin/schemes/:id', matchRoutes.deleteScheme);
// Admin Create Scheme
app.post('/api/admin/schemes', matchRoutes.createScheme);
// Admin Update Scheme
app.put('/api/admin/schemes/:id', matchRoutes.updateScheme);
// AI Explanation Route
app.post('/api/ai/explain', aiRoutes.explainScheme);
// AI Chatbot Route
app.post('/api/ai/chat', aiRoutes.chatWithBot);

// Connect to Local MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/yojana_saathi')
  .then(() => console.log('MongoDB Connected to yojana_saathi'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
