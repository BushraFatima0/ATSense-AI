import ResumeUpload from "./components/ResumeUpload"

function App() {

  return (

    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent tracking-wide">
            ATSense AI
          </div>

          <div className="hidden md:flex items-center gap-10 text-gray-300 font-medium">

            <a href="#features" className="hover:text-cyan-300 transition">
              Features
            </a>

            <a href="#analyzer" className="hover:text-cyan-300 transition">
              Analyzer
            </a>

          </div>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

        {/* Background Glow */}
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[140px] rounded-full top-[-100px] left-[-100px]"></div>

        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[140px] rounded-full bottom-[-100px] right-[-100px]"></div>

        <div className="relative z-10 max-w-5xl text-center">

          <div className="inline-block px-5 py-2 mt-4 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 mb-8 backdrop-blur-sm">
            AI Powered Resume Intelligence Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight mb-8">

            Beat ATS Filters.
            <br />

            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Optimize Your Resume
            </span>

          </h1>

          <p className="text-xl md:text-2xl text-gray-400 leading-9 max-w-4xl mx-auto mb-12">
            ATSense AI analyzes resumes against job descriptions,
            detects missing skills, improves ATS compatibility,
            generates AI-powered insights, and rewrites resumes
            for maximum recruiter impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">

            <a
              href="#analyzer"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl"
            >
              Analyze Resume
            </a>

            <a
              href="#features"
              className="border border-white/10 hover:border-cyan-400 hover:text-cyan-300 transition px-10 py-5 rounded-2xl text-lg font-semibold bg-white/5 backdrop-blur-sm"
            >
              Explore Features
            </a>

          </div>

        </div>

      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-28"
      >

        <div className="text-center mb-20">

          <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Everything You Need To Improve Your Resume
          </h2>

          <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-8">
            ATSense combines AI analysis, ATS optimization,
            keyword matching, and resume enhancement into
            one intelligent platform.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Card 1 */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-900/20 border border-cyan-500/20 rounded-3xl p-8 hover:-translate-y-2 transition shadow-2xl">

            <div className="text-5xl mb-6">📄</div>

            <h3 className="text-2xl font-bold mb-4 text-cyan-300">
              ATS Analysis
            </h3>

            <p className="text-gray-400 leading-7">
              Analyze resumes against job descriptions and
              calculate ATS compatibility instantly.
            </p>

          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-900/20 border border-purple-500/20 rounded-3xl p-8 hover:-translate-y-2 transition shadow-2xl">

            <div className="text-5xl mb-6">🤖</div>

            <h3 className="text-2xl font-bold mb-4 text-purple-300">
              AI Resume Rewrite
            </h3>

            <p className="text-gray-400 leading-7">
              Generate optimized resume content using AI-powered
              resume enhancement workflows.
            </p>

          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-900/20 border border-green-500/20 rounded-3xl p-8 hover:-translate-y-2 transition shadow-2xl">

            <div className="text-5xl mb-6">🎯</div>

            <h3 className="text-2xl font-bold mb-4 text-green-300">
              Skill Gap Detection
            </h3>

            <p className="text-gray-400 leading-7">
              Identify missing keywords and skills recruiters
              expect for specific job roles.
            </p>

          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/20 border border-yellow-500/20 rounded-3xl p-8 hover:-translate-y-2 transition shadow-2xl">

            <div className="text-5xl mb-6">💡</div>

            <h3 className="text-2xl font-bold mb-4 text-yellow-300">
              AI Career Insights
            </h3>

            <p className="text-gray-400 leading-7">
              Receive interview questions, resume suggestions,
              and recruiter-focused improvement insights.
            </p>

          </div>

        </div>

      </section>

      {/* Analyzer Section */}
      <section
        id="analyzer"
        className="pb-28"
      >

        <ResumeUpload />

      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-gray-500">

        Built with React, FastAPI, Gemini AI & Tailwind CSS

      </footer>

    </div>
  )
}

export default App