# ATSense AI — AI-Powered Resume ATS Analyzer

ATSense AI is a full-stack AI-powered Resume ATS Analyzer that evaluates resumes against job descriptions using NLP and AI-driven insights. The platform helps users optimize resumes for Applicant Tracking Systems (ATS) by providing ATS scores, keyword analysis, resume suggestions, and AI-generated improvements.

---

## Live Demo

Frontend: [https://at-sense-ai.vercel.app/
](https://at-sense-ai.vercel.app/)
Backend API Docs: [https://atsense-ai.onrender.com/docs](https://atsense-ai.onrender.com/docs)

---

## Features

- Resume ATS score analysis
- Keyword matching between resume and job description
- Missing keyword detection
- AI-powered resume insights using Gemini API
- Resume rewriting and optimization suggestions
- PDF export functionality
- Resume history storage using SQLite
- Responsive modern UI
- Full-stack deployment using Render and Vercel

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- jsPDF

### Backend
- FastAPI
- Python
- spaCy NLP
- Gemini API
- SQLite

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## Project Structure

```bash
ATSense-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── uploads/
│   ├── requirements.txt
│   └── main.py
│
└── README.md
```

---

## Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/ATSense-AI.git
cd ATSense-AI
```

---

## Backend Setup

### Create Virtual Environment

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

#### Windows

```bash
venv\Scripts\activate
```

#### Mac/Linux

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

## Frontend Setup

### Install Dependencies

```bash
cd frontend

npm install
```

### Run Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## NLP Processing

ATSense AI uses spaCy NLP to:

- extract meaningful keywords
- remove stopwords
- compare resume keywords with job descriptions
- calculate ATS compatibility scores

---

## Future Improvements

- User authentication
- Advanced ATS scoring algorithms
- Resume templates
- Interview preparation assistant
- Cloud database integration
- Skill gap analysis

---

- GitHub: https://github.com/BushraFatima0
- LinkedIn: www.linkedin.com/in/bushra-fatima-6001b0347
