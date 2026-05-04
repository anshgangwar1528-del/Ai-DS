import { useState } from 'react'
import ManualForm from './components/ManualForm'
import CsvUpload from './components/CsvUpload'
import { Sparkles, FileText, UploadCloud } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('manual')

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white relative flex flex-col font-sans selection:bg-purple-500/30">
      
      {/* Immersive Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/20 blur-[150px] animate-float pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/20 blur-[150px] animate-float-delayed pointer-events-none" />
      <div className="fixed top-[40%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full glass-panel z-20 sticky top-0 px-6 py-5 flex items-center justify-between border-b-0 border-white/5">
        <div className="max-w-6xl mx-auto w-full flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30">
            <Sparkles size={24} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-indigo-200">
            HireSense
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 z-10 flex flex-col gap-10 mt-8">
        
        {/* Hero Section */}
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-purple-300 mb-6 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            AI-Powered Career Insights
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Unlock Your <br className="md:hidden"/> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Placement Potential
            </span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Enter your academic profile or upload a dataset to instantly receive highly accurate placement predictions driven by advanced machine learning.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1.5 glass-panel rounded-2xl mx-auto w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'manual' 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText size={18} />
            Single Profile
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'csv' 
                ? 'bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg text-white' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UploadCloud size={18} />
            Bulk Analysis
          </button>
        </div>

        {/* Dynamic Form Area */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 animate-fade-in-up shadow-2xl relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 opacity-50"></div>
          {activeTab === 'manual' ? <ManualForm /> : <CsvUpload />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center z-10 mt-12 border-t border-white/5 bg-black/20">
        <p className="text-sm font-medium text-slate-500">
          © {new Date().getFullYear()} HireSense Systems. Powered by Advanced ML.
        </p>
      </footer>
    </div>
  )
}

export default App
