import { useState } from "react"
import axios from "axios"
import jsPDF from "jspdf"

import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar"

import "react-circular-progressbar/dist/styles.css"


function parseAISections(text) {

    const sections = {
        strengths: [],
        missingSkills: [],
        improvements: [],
        atsTips: [],
        interviewQuestions: []
    }

    let currentSection = ""

    const lines = text.split("\n")

    lines.forEach((line) => {

        const cleanLine = line.trim()

        if (cleanLine.includes("STRENGTHS:")) {
            currentSection = "strengths"
        }

        else if (cleanLine.includes("MISSING_SKILLS:")) {
            currentSection = "missingSkills"
        }

        else if (cleanLine.includes("IMPROVEMENTS:")) {
            currentSection = "improvements"
        }

        else if (cleanLine.includes("ATS_TIPS:")) {
            currentSection = "atsTips"
        }

        else if (cleanLine.includes("INTERVIEW_QUESTIONS:")) {
            currentSection = "interviewQuestions"
        }

        else {

            if (
                cleanLine &&
                currentSection
            ) {
                sections[currentSection].push(cleanLine)
            }
        }
    })

    return sections
}

function formatFileSize(bytes) {

    if (bytes < 1024) return bytes + " B"

    else if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(1) + " KB"

    else
        return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function ResumeUpload() {

    const [file, setFile] = useState(null)
    const [jobDescription, setJobDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [rewriteLoading, setRewriteLoading] = useState(false)

    const [rewrittenResume, setRewrittenResume] = useState("")

    const [analysisData, setAnalysisData] = useState(null)

    const [loadingIndex, setLoadingIndex] = useState(0)


    const loadingMessages = [
        "Extracting resume data...",
        "Analyzing ATS compatibility...",
        "Matching job keywords...",
        "Detecting missing skills...",
        "Generating AI insights...",
        "Optimizing recruiter alignment..."
    ]

    const parsedAI = analysisData
    ? parseAISections(analysisData.ai_feedback)
    : null

    const handleAnalyze = async () => {

        let interval

        if (!file) {
            alert("Please upload resume PDF")
            return
        }

        if (!jobDescription) {
            alert("Please paste job description")
            return
        }

        const formData = new FormData()

        formData.append("file", file)
        formData.append("job_description", jobDescription)

        
        try {

            setLoading(true)

            let current = 0

            interval = setInterval(() => {
                current = (current + 1) % loadingMessages.length
                setLoadingIndex(current)
            }, 1200)

            const response = await axios.post(
                "http://127.0.0.1:8000/analyze-resume/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            setAnalysisData(response.data)

        } catch (error) {

            console.error(error)
            alert("Analysis failed")

        } finally {

            clearInterval(interval)
            setLoading(false)
        }
    }
    const handleRewriteResume = async () => {

        if (!file || !jobDescription) {
            alert("Upload resume and add job description")
            return
        }

        const formData = new FormData()

        formData.append("file", file)
        formData.append("job_description", jobDescription)

        try {

            setRewriteLoading(true)

            const response = await axios.post(
                "http://127.0.0.1:8000/rewrite-resume/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            setRewrittenResume(response.data.rewritten_resume)

        } catch (error) {

            console.error(error)

            alert("Resume rewrite failed")

        } finally {

            setRewriteLoading(false)
        }
    }

    const downloadPDF = () => {

        if (!rewrittenResume) {
            return
        }

        const doc = new jsPDF()

        const margin = 15

        const pageWidth = doc.internal.pageSize.getWidth()

        const textWidth = pageWidth - margin * 0.1

        const lines = doc.splitTextToSize(rewrittenResume, textWidth)

        let y = 20

        doc.setFont("helvetica", "bold")
        doc.setFontSize(24)

        doc.text("ATSense AI - Optimized Resume", margin, y)
        doc.line(margin, y + 4, 190, y + 4)

        y += 15

        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)

        lines.forEach((line) => {

            if (y > 280) {
                doc.addPage()
                y = 20
            }

            const trimmed = line.trim()

            // Detect headings
            const isHeading =
                trimmed.toUpperCase() === trimmed &&
                trimmed.length < 40

            if (isHeading) {

                y += 4

                doc.setFont("helvetica", "bold")
                doc.setFontSize(15)

                doc.text(trimmed, margin, y)

                y += 10

                doc.setFont("helvetica", "normal")
                doc.setFontSize(11)

            }

            else {

                const parts = trimmed.split(/(\*\*.*?\*\*)/g)

                let x = margin + 2

                parts.forEach((part) => {

                    const isBold =
                        part.startsWith("**") &&
                        part.endsWith("**")

                    const cleanText = part.replace(/\*\*/g, "")

                    doc.setFont(
                        "helvetica",
                        isBold ? "bold" : "normal"
                    )

                    doc.text(cleanText, x, y)

                    x += doc.getTextWidth(cleanText)
                })

                y += 7
            }
        })

        doc.save("ATSense_Optimized_Resume.pdf")
    }

    return (

        <div className="max-w-6xl mx-auto mt-16 px-6">

            {/* Upload + Job Description Grid */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">

                <h2 className="text-3xl font-bold mb-10 text-center">
                    Resume ATS Analysis
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Upload Resume */}
                    <div>

                        <label className="block mb-3 text-lg font-medium text-white">
                            Upload Resume
                        </label>

                        <div className="bg-black border border-gray-800 rounded-3xl p-5">

                            {!file ? (

                                <label
                                    htmlFor="fileUpload"
                                    className="
                                        border-2 border-dashed border-gray-700
                                        hover:border-cyan-500/40
                                        transition-all duration-300
                                        rounded-2xl
                                        h-[320px]
                                        flex flex-col items-center justify-center
                                        cursor-pointer
                                        group
                                        bg-gray-950
                                    "
                                >

                                    {/* Upload Icon */}
                                    <div className="
                                        w-20 h-20 rounded-full
                                        bg-cyan-500/10
                                        flex items-center justify-center
                                        text-4xl mb-6
                                        group-hover:scale-110 transition
                                    ">
                                        📄
                                    </div>

                                    <div className="text-2xl font-bold text-white mb-3">
                                        Upload Resume PDF
                                    </div>

                                    <div className="text-gray-400 text-sm mb-6">
                                        Click below to browse your files
                                    </div>

                                    <div className="
                                        bg-gradient-to-r from-cyan-500 to-blue-600
                                        hover:scale-105
                                        transition
                                        px-6 py-3 rounded-xl
                                        text-sm font-semibold shadow-xl
                                    ">
                                        Choose File
                                    </div>

                                </label>

                            ) : (

                                <div className="
                                    bg-gray-900 border border-gray-800
                                    rounded-2xl p-5 h-[320px]
                                    flex flex-col justify-center
                                ">

                                    <div className="flex flex-col items-center text-center">

                                        <div className="
                                            w-24 h-24 rounded-3xl
                                            bg-green-500/10
                                            flex items-center justify-center
                                            text-5xl mb-6
                                        ">
                                            📑
                                        </div>

                                        <div className="font-bold text-xl text-white mb-2 break-all">
                                            {file.name}
                                        </div>

                                        <div className="text-green-400 mb-8">
                                            Resume uploaded successfully
                                        </div>

                                        <button
                                            onClick={() => setFile(null)}
                                            className="
                                                bg-red-500/10 hover:bg-red-500/20
                                                text-red-300 px-5 py-2 rounded-xl
                                                transition
                                            "
                                        >
                                            <span className="text-[19px]">🗙</span> Remove File
                                        </button>

                                    </div>

                                </div>

                            )}

                            <input
                                id="fileUpload"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                            />

                        </div>

                    </div>

                    {/* Job Description */}
                    <div>

                        <label className="block mb-3 text-lg font-medium">
                            Paste Job Description
                        </label>

                        <div className="bg-black border border-gray-800 rounded-3xl p-5">

                            <textarea
                                rows="12"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here..."
                                className="
                                    w-full h-[320px]
                                    bg-gray-950
                                    border border-gray-700
                                    rounded-2xl
                                    p-5
                                    text-gray-300
                                    focus:outline-none
                                    focus:border-cyan-500
                                    resize-none
                                "
                            />

                        </div>

                    </div>

                </div>

                {/* Buttons */}
                <div className="mt-8">

                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className={`
                            w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300
                            flex items-center justify-center gap-3
                            ${loading
                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.01]"
                            }
                        `}
                    >

                        {loading ? (

                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>

                                <div className="flex flex-col items-start leading-tight">

                                    <span>
                                        ATSense AI Processing...
                                    </span>

                                    <span className="text-sm text-cyan-100 font-normal">
                                        {loadingMessages[loadingIndex]}
                                    </span>

                                </div>
                            </>

                        ) : (

                            "Analyze Resume"

                        )}

                    </button>

                    <button
                        onClick={handleRewriteResume}
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.01] transition py-4 rounded-xl text-lg font-semibold shadow-xl"
                    >

                        {rewriteLoading
                            ? "Generating Optimized Resume..."
                            : "Generate Optimized Resume"}

                    </button>

                </div>

            </div>

            {/* Results Section */}
            {analysisData && (

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ATS Score */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-10 shadow-2xl flex flex-col items-center justify-center">

                        <h3 className="text-3xl font-bold mb-8 text-blue-300">
                            ATS Match Score
                        </h3>

                        <div className="w-52 h-52">

                            <CircularProgressbar
                                value={analysisData.analysis.ats_score}
                                text={`${analysisData.analysis.ats_score}%`}
                                styles={buildStyles({

                                    textSize: "16px",

                                    pathColor:
                                        analysisData.analysis.ats_score > 70
                                            ? "#22c55e"
                                            : analysisData.analysis.ats_score >=40
                                                ? "#f6f33b"
                                                : "#ef4444",

                                    textColor: "#ffffff",

                                    trailColor: "#111827",

                                    pathTransitionDuration: 1.5
                                })}
                            />

                        </div>

                        <div className="mt-8">
                        {analysisData.analysis.ats_score > 80 && (
                            <div className="bg-green-500/20 text-green-300 px-6 py-3 rounded-full text-xl font-bold">
                                Excellent
                            </div>
                        )}

                        {analysisData.analysis.ats_score > 60 &&
                            analysisData.analysis.ats_score <= 80 && (
                                <div className="bg-blue-500/20 text-blue-300 px-6 py-3 rounded-full text-xl font-bold">
                                    Good
                                </div>
                            )}

                        {analysisData.analysis.ats_score >= 40 &&
                            analysisData.analysis.ats_score <= 60 && (
                                <div className="bg-yellow-500/20 text-yellow-300 px-4 py-1.5 rounded-full text-xl font-bold">
                                    Fair
                                </div>
                            )}

                        {analysisData.analysis.ats_score < 40 && (
                            <div className="bg-red-500/20 text-red-300 px-6 py-3 rounded-full text-xl font-bold">
                                Poor
                            </div>
                        )}

                    </div>

                    </div>

                    {/* Matched Skills */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">

                        <h3 className="text-2xl font-bold mb-6 text-green-400">
                            Matched Keywords
                        </h3>

                        <div className="flex flex-wrap gap-3">

                            {analysisData.analysis.matched_keywords.map(
                                (skill, index) => (

                                    <span
                                        key={index}
                                        className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>

                    {/* Missing Skills */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">

                        <h3 className="text-2xl font-bold mb-6 text-red-400">
                            Missing Keywords
                        </h3>

                        <div className="flex flex-wrap gap-3">

                            {analysisData.analysis.missing_keywords.map(
                                (skill, index) => (

                                    <span
                                        key={index}
                                        className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                )
                            )}

                        </div>

                    </div>

                </div>
            )}

            {/* AI Insights Dashboard */}
            {parsedAI && (

                <div className="mt-14 space-y-8">

                    <h2 className="text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        AI Career Insights
                    </h2>

                    {/* Top Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Strengths */}
                        <div className="bg-gradient-to-br from-green-500/10 to-green-900/20 border border-green-500/20 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">

                            <h3 className="text-3xl font-bold text-green-400 mb-6">
                                Resume Strengths
                            </h3>

                            <ul className="space-y-4 text-gray-300">

                                {parsedAI.strengths.map((item, index) => (
                                    <li
                                        key={index}
                                        className="bg-black/30 p-4 rounded-xl border border-green-500/10"
                                    >
                                        {item}
                                    </li>
                                ))}

                            </ul>

                        </div>

                        {/* Missing Skills */}
                        <div className="bg-gradient-to-br from-red-500/10 to-red-900/20 border border-red-500/20 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">

                            <h3 className="text-3xl font-bold text-red-400 mb-6">
                                Missing Skills
                            </h3>

                            <div className="flex flex-wrap gap-4">

                                {parsedAI.missingSkills.map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-red-500/10 border border-red-500/20 px-5 py-3 rounded-2xl text-red-200"
                                    >
                                        {item}
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                    {/* Improvements + ATS Tips */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Improvements */}
                        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/20 border border-yellow-500/20 rounded-3xl p-8 shadow-2xl">

                            <h3 className="text-3xl font-bold text-yellow-300 mb-6">
                                Resume Improvements
                            </h3>

                            <div className="space-y-4">

                                {parsedAI.improvements.map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-black/30 p-4 rounded-xl border border-yellow-500/10 text-gray-300"
                                    >
                                        {item}
                                    </div>
                                ))}

                            </div>

                        </div>

                        {/* ATS Tips */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-8 shadow-2xl">

                            <h3 className="text-3xl font-bold text-cyan-300 mb-6">
                                ATS Optimization Tips
                            </h3>

                            <div className="space-y-4">

                                {parsedAI.atsTips.map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-black/30 p-4 rounded-xl border border-cyan-500/10 text-gray-300"
                                    >
                                        {item}
                                    </div>
                                ))}

                            </div>

                        </div>

                    </div>

                    {/* Interview Questions */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-900/20 border border-purple-500/20 rounded-3xl p-8 shadow-2xl">

                        <h3 className="text-4xl font-bold text-purple-300 mb-8 text-center">
                            AI Interview Questions
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {parsedAI.interviewQuestions.map((question, index) => (

                                <div
                                    key={index}
                                    className="bg-black/40 border border-purple-500/10 rounded-2xl p-6 hover:scale-[1.02] transition"
                                >

                                    <div className="text-purple-400 font-bold text-lg mb-3">
                                        Question {index + 1}
                                    </div>

                                    <div className="text-gray-300 leading-7">
                                        {question}
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>

                </div>
            )}

            {/* Rewritten Resume */}
            {rewrittenResume && (

                <div className="mt-14 bg-gradient-to-br from-purple-500/10 to-indigo-900/20 border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-purple-500/20 bg-black/20">

                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">

                            AI Optimized Resume

                        </h2>

                        <div className="flex gap-4">

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(rewrittenResume)
                                    alert("Copied to clipboard!")
                                }}
                                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-semibold transition"
                            >
                                Copy
                            </button>

                            <button
                                onClick={downloadPDF}
                                className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-xl font-semibold transition"
                            >
                                Download PDF
                            </button>

                        </div>

                    </div>

                    {/* Resume Box */}
                    <div className="p-6">

                        <div className="bg-black/40 border border-purple-500/10 rounded-2xl p-6 text-gray-300 leading-8 overflow-y-auto h-[550px] whitespace-pre-wrap">

                            {rewrittenResume}

                        </div>

                    </div>

                </div>

            )}


        </div>
    )
}

export default ResumeUpload