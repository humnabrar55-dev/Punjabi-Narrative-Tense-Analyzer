
import React from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs`;

interface FileUploaderProps {
  onTextExtracted: (text: string) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onTextExtracted, isLoading }) => {
  const extractPdfText = async (data: ArrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // Shahmukhi (Arabic script) text items usually need to be reversed or joined correctly.
      // pdfjs extraction usually follows visual order, but for simplicity we join and rely on the UI RTL.
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      let extractedText = "";
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await extractPdfText(arrayBuffer);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else {
        extractedText = await file.text();
      }

      if (extractedText.trim()) {
        onTextExtracted(extractedText);
      } else {
        alert("Could not extract any text from the file.");
      }
    } catch (err) {
      console.error("File extraction error:", err);
      alert("Error extracting text. Please ensure it's a valid Punjabi document.");
    } finally {
      // Reset input value to allow re-uploading the same file if needed
      e.target.value = '';
    }
  };

  return (
    <div className="mb-6">
      <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer transition-colors ${isLoading ? 'bg-slate-100 opacity-50' : 'bg-slate-50 hover:bg-slate-100'}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-2 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Upload Corpus (PDF / DOCX / TXT)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf,.docx,.txt" 
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default FileUploader;
