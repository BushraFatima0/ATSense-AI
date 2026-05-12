from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import shutil

from app.utils.pdf_parser import extract_text_from_pdf
from app.utils.ats_score import calculate_ats_score
from app.utils.ai_analyzer import generate_ai_feedback
from app.utils.resume_rewriter import rewrite_resume

from app.database import SessionLocal, engine
from app.models import ResumeAnalysis
from sqlalchemy.orm import Session
from fastapi import Depends

app = FastAPI()

from app.database import Base
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "ATSense AI Backend Running"
    }

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text= extract_text_from_pdf(file_path)

    return{
        "filename": file.filename,
        "extracted_text": extracted_text[:3000]
    }


@app.post("/analyze-resume/")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db)
):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text_from_pdf(file_path)

    analysis = calculate_ats_score(
        resume_text,
        job_description
    )

    ai_feedback = generate_ai_feedback(
    resume_text,
    job_description
    )

    new_analysis = ResumeAnalysis(

        ats_score=analysis["ats_score"],

        matched_keywords=", ".join(
            analysis["matched_keywords"]
        ),

        missing_keywords=", ".join(
            analysis["missing_keywords"]
        ),

        ai_feedback=ai_feedback,

        rewritten_resume=""
    )

    db.add(new_analysis)

    db.commit()

    return {
    "analysis": analysis,
    "ai_feedback": ai_feedback
    }

@app.get("/history")
def get_history(
    db: Session = Depends(get_db)
):

    history = db.query(
        ResumeAnalysis
    ).all()

    return history

@app.delete("/clear-history")
def clear_history(
    db: Session = Depends(get_db)
):

    db.query(ResumeAnalysis).delete()

    db.commit()

    return {
        "message": "History cleared"
    }

@app.post("/rewrite-resume/")
async def rewrite_resume_api(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text_from_pdf(file_path)

    rewritten_resume = rewrite_resume(
        resume_text,
        job_description
    )

    return {
        "rewritten_resume": rewritten_resume
    }
