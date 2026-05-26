import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_ai_feedback(resume_text, job_description):

    prompt = fprompt = fprompt = f"""

        You are an expert ATS resume reviewer and career coach.

        Analyze the resume against the job description.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Return SHORT and HIGHLY READABLE content.

        STRICT FORMAT:

        STRENGTHS:
        - point
        - point
        - point

        MISSING_SKILLS:
        - point
        - point
        - point

        IMPROVEMENTS:
        - point
        - point
        - point

        ATS_TIPS:
        - point
        - point
        - point

        INTERVIEW_QUESTIONS:
        1. question
        2. question
        3. question
        4. question
        5. question

        Keep every point SHORT.
        ONLY state top 3 points for strenghts, missing_skills and impovements and ats_tips.
        Do NOT write paragraphs.

        """

    response = model.generate_content(prompt)

    return response.text