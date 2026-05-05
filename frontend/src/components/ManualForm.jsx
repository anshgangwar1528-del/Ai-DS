import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Loader2, CheckCircle2, XCircle, TrendingUp } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ManualForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const formattedData = {
        CGPA: parseFloat(data.CGPA),
        Internships: parseInt(data.Internships),
        Projects: parseInt(data.Projects),
        Coding_Skills: parseInt(data.Coding_Skills),
        Communication_Skills: parseInt(data.Communication_Skills),
        Aptitude_Test_Score: parseInt(data.Aptitude_Test_Score),
        Soft_Skills_Rating: parseInt(data.Soft_Skills_Rating),
        Certifications: parseInt(data.Certifications),
        Backlogs: parseInt(data.Backlogs),
        Degree: data.Degree,
        Specialization: data.Specialization,
      }
      
      const response = await axios.post(`${API_URL}/predict`, formattedData)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const InputField = ({ label, name, type = "text", placeholder, options, validation, step }) => (
    <div className="space-y-2 relative group">
      <label className="text-sm font-semibold text-slate-300 ml-1">{label}</label>
      {options ? (
        <select 
          className="w-full px-4 py-3 rounded-xl glass-input text-white outline-none appearance-none"
          {...register(name, validation)}
        >
          <option value="" className="bg-[#1a1b26]">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt} className="bg-[#1a1b26]">{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          step={step || (type === 'number' ? '1' : undefined)}
          min={validation?.min !== undefined ? validation.min : undefined}
          max={validation?.max !== undefined ? validation.max : undefined}
          className="w-full px-4 py-3 rounded-xl glass-input text-white outline-none placeholder:text-slate-500"
          placeholder={placeholder}
          {...register(name, validation)} 
        />
      )}
      {errors[name] && <span className="absolute -bottom-5 left-1 text-xs text-red-400 font-medium">* Required</span>}
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="border-b border-white/10 pb-5 mb-8">
        <h3 className="text-2xl font-bold tracking-tight text-white">
          Candidate Assessment
        </h3>
        <p className="text-slate-400 mt-2 font-light">
          Please provide accurate details. Our AI model will evaluate these metrics against thousands of successful placements.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          
          <InputField label="Degree" name="Degree" options={['B.Tech', 'B.Sc', 'BCA', 'MCA']} validation={{ required: true }} />
          <InputField label="Specialization" name="Specialization" placeholder="e.g. CSE, IT" validation={{ required: true }} />
          <InputField label="CGPA (out of 10)" name="CGPA" type="number" step="0.01" placeholder="8.5" validation={{ required: true, min: 0, max: 10 }} />
          <InputField label="Internships" name="Internships" type="number" placeholder="1" validation={{ required: true, min: 0 }} />
          <InputField label="Projects" name="Projects" type="number" placeholder="2" validation={{ required: true, min: 0 }} />
          <InputField label="Coding Skills (1-10)" name="Coding_Skills" type="number" placeholder="8" validation={{ required: true, min: 1, max: 10 }} />
          <InputField label="Comm. Skills (1-10)" name="Communication_Skills" type="number" placeholder="7" validation={{ required: true, min: 1, max: 10 }} />
          <InputField label="Aptitude Score" name="Aptitude_Test_Score" type="number" placeholder="85" validation={{ required: true, min: 0, max: 100 }} />
          <InputField label="Soft Skills (1-10)" name="Soft_Skills_Rating" type="number" placeholder="8" validation={{ required: true, min: 1, max: 10 }} />
          <InputField label="Certifications" name="Certifications" type="number" placeholder="2" validation={{ required: true, min: 0 }} />
          <InputField label="Active Backlogs" name="Backlogs" type="number" placeholder="0" validation={{ required: true, min: 0 }} />
          
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="relative w-full md:w-auto px-10 py-4 group overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          <span className="relative flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={22} /> : <TrendingUp size={22} />}
            {loading ? 'Analyzing Profile...' : 'Run Prediction Engine'}
          </span>
        </button>
      </form>

      {/* Results Section */}
      {error && (
        <div className="p-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-4 animate-fade-in-up">
          <XCircle className="shrink-0" size={24} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className={`relative overflow-hidden p-8 rounded-2xl border animate-fade-in-up flex flex-col items-center justify-center text-center gap-4 ${
          result.placement === 1 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {/* Subtle glow behind icon */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl rounded-full ${result.placement === 1 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}></div>
          
          {result.placement === 1 ? (
            <>
              <CheckCircle2 size={56} className="text-emerald-400 mb-2 relative z-10 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              <h4 className="text-3xl font-bold text-white relative z-10">High Placement Probability!</h4>
              <p className="text-emerald-200/80 text-lg relative z-10 max-w-lg">
                This candidate's metrics strongly align with successful placements. Outstanding profile.
              </p>
            </>
          ) : (
            <>
              <XCircle size={56} className="text-rose-400 mb-2 relative z-10 drop-shadow-[0_0_10px_rgba(251,113,133,0.5)]" />
              <h4 className="text-3xl font-bold text-white relative z-10">Low Placement Probability</h4>
              <p className="text-rose-200/80 text-lg relative z-10 max-w-lg">
                This profile requires improvement. Consider focusing on skill development, projects, or internships.
              </p>
            </>
          )}
          
          {result.probability !== undefined && (
            <div className="mt-6 px-6 py-3 bg-black/40 border border-white/10 rounded-full text-lg font-semibold tracking-wide text-white relative z-10 shadow-lg">
              AI Confidence Score: <span className={result.placement === 1 ? "text-emerald-400" : "text-rose-400"}>{(result.probability * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
