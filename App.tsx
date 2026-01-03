
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TranscriptionInput from './components/TranscriptionInput';
import AnalysisResults from './components/AnalysisResults';
import Charts from './components/Charts';
import { analyzeTranscription } from './geminiService';
import { AnalysisResponse } from './types';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, ImageRun, HeadingLevel } from 'docx';
import FileSaver from 'file-saver';
import html2canvas from 'html2canvas';

const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleAnalyze = async () => {
    if (!apiKey) { setError("Enter API Key."); return; }
    if (!transcription.trim()) { setError("Enter text."); return; }
    setIsLoading(true); setError(null);
    try {
      const result = await analyzeTranscription(transcription, apiKey);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const captureChart = async (id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
    return canvas.toDataURL('image/png').split(',')[1];
  };

  const exportToWord = async () => {
    if (!analysis) return;
    setIsExporting(true);
    try {
      const barImg = await captureChart('chart-hp-freq');

      const doc = new Document({
        sections: [{
          properties: { bidi: true },
          children: [
            new Paragraph({ text: "Punjabi Narrative Discourse Analysis", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: `Date: ${new Date().toLocaleDateString()}`, alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
            
            new Paragraph({ text: "1. Quantitative Summary", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ children: [
              new TextRun({ text: `• Total Segments: ${analysis.summary.totalSentences}\n`, color: "000000" }),
              new TextRun({ text: `• HP Instances: ${analysis.summary.hpCount}\n`, color: "000000" }),
              new TextRun({ text: `• Tense Dynamics: ${(analysis.summary.tenseSwitchRatio * 100).toFixed(1)}%`, color: "000000" }),
            ]}),

            new Paragraph({ text: "2. Narrative Analysis", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
              children: [new TextRun({ text: analysis.qualitativeAnalysis, font: "Arial Unicode MS", color: "000000" })],
              alignment: AlignmentType.LEFT,
              spacing: { after: 400 }
            }),

            new Paragraph({ text: "3. Statistical Distribution", heading: HeadingLevel.HEADING_2 }),
            ...(barImg ? [new Paragraph({ children: [new ImageRun({ data: decodeBase64(barImg), transformation: { width: 500, height: 250 } })], alignment: AlignmentType.CENTER })] : []),

            new Paragraph({ text: "4. Annotation Table", heading: HeadingLevel.HEADING_2, pageBreakBefore: true }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({ children: [
                  new TableCell({ children: [new Paragraph({ text: "Seg #", bold: true, color: "000000" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Text (Shahmukhi)", bold: true, color: "000000" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Tense/Cat", bold: true, color: "000000" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Reasoning", bold: true, color: "000000" })] }),
                ]}),
                ...analysis.sentences.map((s, idx) => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: (idx + 1).toString(), color: "000000" })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: s.originalText, rightToLeft: true, font: "Arial Unicode MS", color: "000000" })], alignment: AlignmentType.RIGHT })] }),
                    new TableCell({ children: [new Paragraph({ text: `${s.inferredTense}\n${s.hpCategory}`, size: 16, color: "000000" })] }),
                    new TableCell({ children: [new Paragraph({ text: s.reasoning, size: 14, italics: true, color: "000000" })] }),
                  ]
                }))
              ]
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      FileSaver.saveAs(blob, `Shahmukhi_Analysis_Report.docx`);
    } catch (err) {
      alert("Export failed.");
    } finally { setIsExporting(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header apiKey={apiKey} onSaveKey={(k) => { setApiKey(k); localStorage.setItem('GEMINI_API_KEY', k); }} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Research Dashboard</h2>
        </div>

        <TranscriptionInput value={transcription} onChange={setTranscription} onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg font-bold border border-red-200">{error}</div>}

        {analysis && !isLoading && (
          <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Segments</p>
                <p className="text-3xl font-bold text-slate-900">{analysis.summary.totalSentences}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200">
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">HP Instances</p>
                <p className="text-3xl font-bold text-indigo-700">{analysis.summary.hpCount}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase">Tense Dynamics</p>
                <p className="text-3xl font-bold text-slate-900">{(analysis.summary.tenseSwitchRatio * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-indigo-950 text-white p-8 rounded-2xl shadow-xl border border-indigo-900">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 mb-4">Qualitative Linguistic Narrative</h3>
              <p dir="auto" className="text-lg leading-relaxed italic text-white/90">{analysis.qualitativeAnalysis}</p>
            </div>

            <Charts data={analysis.sentences} />
            <AnalysisResults sentences={analysis.sentences} summary={analysis.summary} />

            <div className="flex justify-center pt-4 pb-12">
              <button 
                onClick={exportToWord} 
                disabled={isExporting} 
                className="flex items-center gap-3 px-14 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50 ring-4 ring-slate-900/10"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Final Report...
                  </>
                ) : "Download Research Report (.docx)"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
