import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Share2, FileText, ChevronDown, ChevronUp, BookOpen, ExternalLink, Copy, Check } from 'lucide-react';
import { ResearchItem } from '../types';

interface ReportViewProps {
  topic: string;
  content: string;
  researchData: ResearchItem[];
}

const ReportView: React.FC<ReportViewProps> = ({ topic, content, researchData }) => {
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${topic.replace(/\s+/g, '_').toLowerCase()}_report.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden mb-8 relative">
        {/* Glow effect behind the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />

        {/* Header Actions */}
        <div className="bg-white/5 border-b border-white/5 px-6 py-5 flex items-center justify-between sticky top-0 backdrop-blur-xl z-20">
          <div className="flex items-center space-x-3">
             <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
                <FileText className="h-4 w-4 text-primary-400" />
             </div>
             <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Generated Report</span>
                <span className="text-sm font-semibold text-white truncate max-w-[200px] md:max-w-md block">{topic}</span>
             </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleCopy}
              className="group flex items-center space-x-2 px-3 py-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/10"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" />}
              <span className="hidden sm:inline text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="group flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-200 transition-all border border-white/5 hover:border-white/10 shadow-sm"
              title="Download Markdown"
            >
              <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="px-8 py-12 md:px-16 md:py-16 bg-gradient-to-b from-transparent to-slate-900/30">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            {topic}
          </h1>
          <div className="flex items-center space-x-4 mb-12 text-sm text-slate-400 border-b border-white/10 pb-6">
            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">Comprehensive Review</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString()}</span>
            <span>•</span>
            <span>StarDustAI Agent</span>
          </div>
          
          <div className="report-content prose prose-lg prose-invert max-w-none 
              prose-headings:font-serif prose-headings:text-slate-50 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
              prose-p:text-slate-300 prose-p:leading-8 prose-p:mb-6
              prose-li:text-slate-300 prose-li:marker:text-primary-400
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary-500 prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-300
          ">
            <ReactMarkdown
              components={{
                a: ({node, ...props}) => (
                  <a 
                    {...props} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center transition-colors"
                  >
                    {props.children}
                    <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
                  </a>
                )
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-950/30 border-t border-white/5 px-8 py-8 text-center">
          <p className="text-slate-500 text-sm">Generated by AI • Content should be verified for critical applications.</p>
        </div>
      </div>

      {/* Sources / Raw Data Section */}
      <div className="mt-8 bg-slate-900/20 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:bg-slate-900/30 hover:border-white/10">
        <button 
          onClick={() => setShowSources(!showSources)}
          className="w-full px-8 py-5 flex items-center justify-between text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full transition-colors ${showSources ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'}`}>
               <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className={`block font-semibold transition-colors ${showSources ? 'text-primary-400' : 'text-slate-300 group-hover:text-white'}`}>Research Notes & Methodology</span>
              <span className="text-xs text-slate-500">Source data from {researchData.length} analysis vectors</span>
            </div>
          </div>
          {showSources ? <ChevronUp className="h-5 w-5 text-primary-400" /> : <ChevronDown className="h-5 w-5 text-slate-500 group-hover:text-slate-300" />}
        </button>
        
        {showSources && (
          <div className="px-8 py-8 space-y-10 border-t border-white/5 animate-in fade-in slide-in-from-top-4 bg-slate-950/20">
            {researchData.map((item, index) => (
              <div key={index} className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-medium text-slate-400">
                    {index + 1}
                </div>
                <h3 className="font-serif font-bold text-slate-200 text-lg mb-4">
                  {item.question}
                </h3>
                <div className="text-slate-400 prose prose-sm prose-invert max-w-none leading-relaxed bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <ReactMarkdown>{item.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView;