import google.generativeai as genai

model = genai.GenerativeModel("gemini-2.5-flash")


def rewrite_resume(resume_text, job_description):

    prompt = f"""
You are an expert ATS resume optimizer and professional resume writer.

Your task is to rewrite and optimize the resume for the given job description.

IMPORTANT RULES:
- Improve weak bullet points
- Use stronger action verbs
- Improve professionalism and clarity
- Optimize ATS keyword alignment
- Add measurable impact wording wherever possible
- Improve readability and structure
- Rewrite content meaningfully when needed
- Keep the resume realistic and truthful
- DO NOT invent fake projects, experience, companies, or achievements
- DO NOT use overly robotic or repetitive AI language
- Make the resume sound modern, professional, and recruiter-friendly

FORMATTING RULES:
- Use clear section headings
- Use concise bullet points
- Keep formatting professional and clean
- Avoid long paragraphs

JOB DESCRIPTION:
{job_description}

ORIGINAL RESUME:
{resume_text}

Return ONLY the optimized resume.
"""

    response = model.generate_content(prompt)

    return response.text