import { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Server, 
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeWebsite = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  const checkHeader = (headers, headerName) => {
    if (!headers) return false;
    const lowerHeaders = Object.keys(headers).reduce((acc, key) => {
      acc[key.toLowerCase()] = headers[key];
      return acc;
    }, {});
    return !!lowerHeaders[headerName.toLowerCase()];
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="text-center space-y-4 py-8">
          <div className="flex justify-center items-center gap-3">
            <Shield className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Website Health & Security Analyser
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Real-time analysis of website availability, performance and security
          </p>
        </header>

        {/* Input Section */}
        <form onSubmit={analyzeWebsite} className="max-w-3xl mx-auto flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Enter URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Main Dashboard */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-full ${result.status === 'up' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Status</p>
                    <p className={`text-xl font-bold ${result.status === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {result.status ? result.status.toUpperCase() : 'UNKNOWN'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Response Time</p>
                    <p className="text-xl font-bold text-white">
                      {result.response_time_ms ? `${result.response_time_ms} ms` : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center text-center gap-3">
                  <div className="p-3 rounded-full bg-purple-500/20 text-purple-500">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Status Code</p>
                    <p className="text-xl font-bold text-white">
                      {result.status_code || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-full ${result.is_https ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {result.is_https ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm font-medium">HTTPS Status</p>
                    <p className={`text-xl font-bold ${result.is_https ? 'text-green-400' : 'text-red-400'}`}>
                      {result.is_https ? 'Secure' : 'Not Secure'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Score and Checks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Security Score */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-white mb-6">Security Score</h3>
                  
                  {/* Circular Progress Bar */}
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-slate-700 stroke-current"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className={`${getScoreColor(result.security_score)} stroke-current transition-all duration-1000 ease-out`}
                        strokeWidth="8"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (result.security_score || 0)) / 100}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(result.security_score)}`}>
                        {result.security_score || 0}%
                      </span>
                    </div>
                  </div>
                  <p className={`mt-6 text-xl font-medium ${getScoreColor(result.security_score)}`}>
                    {getScoreText(result.security_score)}
                  </p>
                </div>

                {/* Security Checks Section */}
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    Security Headers
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Content-Security-Policy', label: 'CSP' },
                      { name: 'X-Frame-Options', label: 'X-Frame-Options' },
                      { name: 'Strict-Transport-Security', label: 'HSTS' },
                    ].map((check) => {
                      const passed = checkHeader(result.headers, check.name);
                      return (
                        <div key={check.name} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                          <span className="font-medium text-slate-300">{check.label}</span>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            passed ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {passed ? 'Pass' : 'Fail'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Warnings Panel */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-yellow-500" />
                    Security Warnings
                  </h3>
                  <div className="space-y-3">
                    {result.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-200/90 leading-relaxed">{warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Side Panel (Spans 1 column) */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              
              {/* Processing Steps */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h3 className="text-base font-semibold text-white mb-4">Processing Steps</h3>
                <div className="space-y-4">
                  {[
                    'Resolving DNS & IP Address',
                    'Checking HTTP/HTTPS Status',
                    'Measuring Response Time',
                    'Analyzing SSL/TLS Certificate',
                    'Scanning Security Headers',
                    'Evaluating Content Security Policy',
                    'Checking X-Frame-Options',
                    'Verifying Strict Transport Security',
                    'Calculating Security Score',
                    'Generating Threat Report'
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample JSON Response */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h3 className="text-base font-semibold text-white mb-4">Sample JSON Response</h3>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-700/50">
                  <pre className="text-xs text-green-400 font-mono">
                    <code>{JSON.stringify(result, null, 2)}</code>
                  </pre>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h3 className="text-base font-semibold text-white mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Tailwind CSS', 'Vite', 'Lucide Icons', 'Flask Backend', 'Docker'].map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-slate-900 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
