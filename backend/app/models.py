from sqlalchemy import Column, Integer, String, Text

from app.database import Base

class ResumeAnalysis(Base):

    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)

    ats_score = Column(Integer)

    matched_keywords = Column(Text)

    missing_keywords = Column(Text)

    ai_feedback = Column(Text)

    rewritten_resume = Column(Text)