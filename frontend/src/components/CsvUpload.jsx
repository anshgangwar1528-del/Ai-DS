import { useState, useRef } from 'react'
import axios from 'axios'
import { UploadCloud, FileSpreadsheet, Loader2, Download, X, Users, CheckCircle, XCircle, Info } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function CsvUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [showFormat, setShowFormat] = useState(false)
  const fileInputRef = useRef(null)

  const expectedColumns = [
    'Degree', 'Specialization', 'CGPA', 'Internships', 'Projects', 
    'Coding_Skills', 'Communication_Skills', 'Aptitude_Test_Score', 
    'Soft_Skills_Rating', 'Certifications', 'Backlogs'
  ]

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && (selected.name.endsWith('.csv') || selected.name.endsWith('.xlsx') || selected.name.endsWith('.xls'))) {
      setFile(selected)
      setError(null)
      setResult(null)
    } else {
      setFile(null)
      setError('Invalid file type. Please upload a .csv, .xls, or .xlsx file.')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/predict_csv`, formData)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process the dataset. Check format.')
    } finally {
      setLoading(false)
    }
  }

  const downloadCsv = () => {
    if (!result?.csv_content) return
    const blob = new Blob([result.csv_content], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // Always download as CSV since the backend converts the result back to CSV
    link.setAttribute('download', `nexus_predictions.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="border-b border-white/10 pb-5 mb-8 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Bulk Dataset Processing
          </h3>
          <p className="text-slate-400 mt-2 font-light">
            Upload a CSV or Excel file containing student records. Our AI pipeline will process all records concurrently.
          </p>
        </div>
        <button 
          onClick={() => setShowFormat(!showFormat)}
          className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          <Info size={16} />
          View Expected Format
        </button>
      </div>

      {showFormat && (
        <div className="p-5 glass-panel rounded-2xl mb-8 animate-fade-in-up">
          <h4 className="text-white font-semibold mb-3">Expected File Columns</h4>
          <p className="text-sm text-slate-400 mb-4">Your file must include the following column headers (exact spelling):</p>
          <div className="flex flex-wrap gap-2">
            {expectedColumns.map(col => (
              <span key={col} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-md text-xs text-purple-200">
                {col}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">*Note: Age and Gender are handled automatically if omitted.</p>
        </div>
      )}

      <div 
        className={`relative overflow-hidden border-2 border-dashed rounded-3xl p-10 md:p-16 text-center transition-all duration-300 cursor-pointer group ${
          file 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-slate-700 bg-black/20 hover:border-purple-500/50 hover:bg-purple-500/5'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files }}) }}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        
        {!file ? (
          <div className="flex flex-col items-center gap-5">
            <div className="p-6 bg-slate-800/50 rounded-full text-purple-400 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <UploadCloud size={48} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">Drag & drop your CSV or Excel file here</p>
              <p className="text-slate-400 mt-2 font-light">or click to browse from your computer</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="p-6 bg-purple-500/20 rounded-full text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              <FileSpreadsheet size={48} strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-full border border-white/10">
              <p className="text-lg font-medium text-white">{file.name}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-400 font-light">{(file.size / 1024).toFixed(2)} KB • Ready for analysis</p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-5 bg-red-500/10 text-red-400 rounded-xl border border-red-500/30 animate-fade-in-up flex items-center gap-3">
          <XCircle size={20} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {file && !result && (
        <div className="flex justify-center animate-fade-in-up">
          <button 
            onClick={handleUpload}
            disabled={loading}
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
            {loading ? 'Processing Dataset...' : 'Initiate Bulk Analysis'}
          </button>
        </div>
      )}

      {result && result.stats && (
        <div className="space-y-8 animate-fade-in-up mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 glass-panel rounded-2xl flex flex-col items-center justify-center text-center gap-3 border-t-4 border-t-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full"></div>
              <Users size={32} className="text-blue-400" />
              <div>
                <p className="text-slate-400 font-medium">Total Processed</p>
                <p className="text-4xl font-extrabold text-white mt-1">{result.stats.placed + result.stats.not_placed}</p>
              </div>
            </div>
            
            <div className="p-6 glass-panel rounded-2xl flex flex-col items-center justify-center text-center gap-3 border-t-4 border-t-emerald-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
              <CheckCircle size={32} className="text-emerald-400" />
              <div>
                <p className="text-slate-400 font-medium">Predicted Placed</p>
                <p className="text-4xl font-extrabold text-emerald-400 mt-1">{result.stats.placed}</p>
              </div>
            </div>
            
            <div className="p-6 glass-panel rounded-2xl flex flex-col items-center justify-center text-center gap-3 border-t-4 border-t-rose-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full"></div>
              <XCircle size={32} className="text-rose-400" />
              <div>
                <p className="text-slate-400 font-medium">Predicted Not Placed</p>
                <p className="text-4xl font-extrabold text-rose-400 mt-1">{result.stats.not_placed}</p>
              </div>
            </div>

          </div>
          
          <div className="flex justify-center pt-4">
            <button 
              onClick={downloadCsv}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-wide rounded-xl transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={24} />
              Download Annotated Dataset (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
