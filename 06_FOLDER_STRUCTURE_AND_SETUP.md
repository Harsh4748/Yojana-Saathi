# 06 - Folder Structure & Setup

## Folder Structure
```
yojana-saathi/
├── client/                       # React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                  # axios instance + api functions
│   │   ├── components/
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── StepForm/
│   │   │   ├── VoiceInput.jsx
│   │   │   ├── SchemeCard.jsx
│   │   │   ├── DocumentChecklist.jsx
│   │   │   ├── ChatWidget.jsx
│   │   │   └── ShareButton.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── SchemeDetail.jsx
│   │   │   └── admin/ (Login.jsx, Dashboard.jsx, SchemeEditor.jsx)
│   │   ├── context/ProfileContext.jsx
│   │   ├── i18n/ (en.json, hi.json, gu.json, index.js)
│   │   ├── hooks/ (useSpeech.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── server/                       # Node + Express
│   ├── config/db.js
│   ├── models/ (Scheme.js, Admin.js, Reminder.js, Feedback.js)
│   ├── routes/ (match.js, schemes.js, ai.js, reminders.js, admin.js, feedback.js)
│   ├── controllers/
│   ├── services/ (eligibilityEngine.js, aiService.js, reminderService.js)
│   ├── middleware/ (validate.js, auth.js, errorHandler.js, rateLimit.js)
│   ├── seed/ (schemes.json, seed.js)
│   ├── cron/reminderJob.js
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── docs/                         # Ye saari .md files
└── README.md
```

## Setup Commands

### Backend
```bash
mkdir server && cd server
npm init -y
npm i express mongoose cors helmet dotenv jsonwebtoken bcryptjs joi express-rate-limit node-cron nodemailer axios
npm i -D nodemon
```
`package.json` scripts:
```json
"scripts": { "dev": "nodemon server.js", "start": "node server.js", "seed": "node seed/seed.js" }
```

### Frontend
```bash
npm create vite@latest client -- --template react
cd client
npm i axios react-router-dom react-i18next i18next tailwindcss @tailwindcss/vite lucide-react
```

## Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/yojana_saathi
JWT_SECRET=change_this_secret
LLM_API_KEY=your_llm_api_key
LLM_PROVIDER=gemini
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=app_password
CLIENT_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

> `.env` files ko kabhi GitHub par push mat karo. `.gitignore` mein daalo.

## Basic server/app.js
```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/match', require('./routes/match'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/admin', require('./routes/admin'));
app.use(require('./middleware/errorHandler'));

module.exports = app;
```

## Deployment
| Part | Platform |
|---|---|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas (M0 free) |

Deploy ke baad `CLIENT_URL` aur `VITE_API_URL` update karna na bhoolein.
