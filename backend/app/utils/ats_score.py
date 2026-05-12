import spacy
import re

nlp = spacy.load("en_core_web_sm")


def clean_text(text):

    text = text.lower()

    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)

    return text


def extract_keywords(text):

    text = clean_text(text)

    doc = nlp(text)

    keywords = set()

    for token in doc:

        if token.is_stop or token.is_punct:
            continue

        if len(token.text) < 3:
            continue

        if token.pos_ in ["NOUN", "PROPN"]:

            keywords.add(token.text)

    return keywords


def calculate_ats_score(resume_text, job_description):

    resume_keywords = extract_keywords(resume_text)

    jd_keywords = extract_keywords(job_description)

    matched_keywords = resume_keywords.intersection(jd_keywords)

    missing_keywords = jd_keywords.difference(resume_keywords)

    if len(jd_keywords) == 0:
        score = 0
    else:
        score = int((len(matched_keywords) / len(jd_keywords)) * 100)

    return {
    "ats_score": score,
    "matched_keywords": list(matched_keywords)[:8],
    "missing_keywords": list(missing_keywords)[:8]
}