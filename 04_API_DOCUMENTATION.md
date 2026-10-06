# 04 - API Documentation

Base URL: `http://localhost:5000/api`

## Public APIs

### 1. POST `/match`
Profile se eligible schemes nikaalta hai.

**Request**
```json
{
  "age": 19,
  "gender": "Male",
  "state": "Gujarat",
  "category": "OBC",
  "income": 200000,
  "education": "UG",
  "occupation": "Student",
  "disability": false,
  "minority": false,
  "language": "hi"
}
```

**Response**
```json
{
  "eligible": [
    {
      "scheme": { "_id": "...", "slug": "mysy", "name": "MYSY", "benefit": "..." },
      "matchPercent": 100,
      "reasons": ["Income 2.5 lakh se kam hai", "Gujarat ke student ho"]
    }
  ],
  "nearMiss": [
    {
      "scheme": { "...": "..." },
      "matchPercent": 80,
      "missing": [{ "field": "income", "yourValue": 270000, "required": "<= 250000", "gap": 20000 }]
    }
  ],
  "totalChecked": 25
}
```

### 2. GET `/schemes`
Query: `type`, `level`, `state`, `search`, `page`, `limit`

### 3. GET `/schemes/:slug`
Ek scheme ki poori detail.

### 4. POST `/ai/explain`
**Request**
```json
{ "schemeSlug": "mysy", "profile": { "...": "..." }, "language": "gu" }
```
**Response**
```json
{ "explanation": "Simple bhasha mein explanation..." }
```

### 5. POST `/ai/chat`
**Request**
```json
{ "message": "Income certificate kahan banta hai?", "schemeSlug": "mysy", "language": "hi", "history": [] }
```
**Response**
```json
{ "reply": "..." }
```

### 6. POST `/reminders`
```json
{ "email": "user@example.com", "schemeSlug": "mysy", "language": "hi" }
```

### 7. POST `/feedback`
```json
{ "helpful": true, "comment": "Bahut useful", "language": "hi" }
```

## Admin APIs (JWT required)
Header: `Authorization: Bearer <token>`

| Method | Endpoint | Kaam |
|---|---|---|
| POST | `/admin/login` | Login, token return |
| POST | `/admin/schemes` | Scheme add |
| PUT | `/admin/schemes/:id` | Scheme update |
| DELETE | `/admin/schemes/:id` | Scheme delete/deactivate |
| GET | `/admin/stats` | Basic analytics |

## Error Format
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "income", "message": "Income number hona chahiye" }] }
```

## Status Codes
200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 429 Too Many Requests, 500 Server Error
