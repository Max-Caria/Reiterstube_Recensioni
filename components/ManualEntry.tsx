import React, { useState } from 'react';
import { ReviewSource } from '../types';
import { PlusCircle, Sparkles, X, ArrowDown, FileText } from 'lucide-react';
import { parseRawReview } from '../services/geminiService';

interface ManualEntryProps {
  onAddReview: (text: string, source: ReviewSource, author: string, rating: number) => void;
}

export const ManualEntry: React.FC<ManualEntryProps> = ({ onAddReview }) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState<ReviewSource>('Manual');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Smart Import State
  const [showSmartPaste, setShowSmartPaste] = useState(false);
  const [rawInput, setRawInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && author.trim()) {
      onAddReview(text, source, author, rating);
      resetForm();
    }
  };

  const resetForm = () => {
    setText('');
    setAuthor('');
    setRating(5);
    setSource('Manual');
    setIsExpanded(false);
    setShowSmartPaste(false);
    setRawInput('');
  };

  const handleSmartParse = async () => {
    if (!rawInput.trim()) return;
    
    setIsParsing(true);
    try {
      const data = await parseRawReview(rawInput);
      setAuthor(data.author);
      setRating(data.rating);
      setText(data.text);
      setSource(data.source);
      setShowSmartPaste(false); // Close smart paste area
    } catch (error) {
      alert("Non sono riuscito a leggere il testo. Per favore, inserisci i dati a mano.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all duration-300">
      <div 
        className="p-4 bg-slate-50/50 cursor-pointer flex justify-between items-center hover:bg-slate-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="font-semibold text-slate-700 flex items-center">
          <PlusCircle className="mr-2 text-red-800" size={20} />
          Nuova Recensione da Rispondere
        </h2>
        <span className="text-slate-400 text-sm">{isExpanded ? 'Chiudi' : 'Apri'}</span>
      </div>

      {isExpanded && (
        <div className="animate-fadeIn">
          {/* Smart Paste Toggle Section */}
          <div className="px-5 pt-4">
             {!showSmartPaste ? (
               <button 
                 onClick={() => setShowSmartPaste(true)}
                 className="w-full py-4 border-2 border-dashed border-red-200 bg-red-50/30 rounded-lg text-red-800 font-medium flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors"
               >
                 <Sparkles size={20} className="mr-2" />
                 <span className="text-lg">Ho copiato un testo (TripAdvisor/Google)</span>
               </button>
             ) : (
               <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-red-800 flex items-center">
                      <FileText size={16} className="mr-1" /> Incolla qui sotto tutto il testo
                    </label>
                    <button onClick={() => setShowSmartPaste(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={20} />
                    </button>
                  </div>
                  <textarea 
                    className="w-full p-3 border border-red-200 rounded-lg text-sm h-32 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 mb-2 placeholder:text-slate-400"
                    placeholder="Esempio: Clicca col tasto destro e incolla qui tutto quello che hai copiato dalla recensione..."
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                  />
                  <button 
                    onClick={handleSmartParse}
                    disabled={isParsing || !rawInput.trim()}
                    className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white rounded-lg font-bold text-md flex items-center justify-center transition-colors shadow-md"
                  >
                    {isParsing ? (
                      <span>Sto leggendo...</span>
                    ) : (
                      <>
                        <span>Analizza e Compila Automaticamente</span>
                        <ArrowDown size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-2">Il sistema cercherà di capire da solo chi ha scritto la recensione, il voto e il testo.</p>
               </div>
             )}
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Cliente</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="Es. Mario Rossi"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dove l'ha scritta?</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                  value={source}
                  onChange={(e) => setSource(e.target.value as ReviewSource)}
                >
                  <option value="Manual">Manuale / Altro</option>
                  <option value="TripAdvisor">TripAdvisor</option>
                  <option value="TheFork">TheFork</option>
                  <option value="Google">Google Maps</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
               <label className="block text-sm font-medium text-slate-700 mb-1">Quante stelle ha messo?</label>
               <div className="flex space-x-4">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <label key={star} className="flex items-center cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                     <input 
                       type="radio" 
                       name="rating" 
                       value={star}
                       checked={rating === star}
                       onChange={() => setRating(star)}
                       className="mr-2 text-red-600 focus:ring-red-500 bg-white scale-125"
                     />
                     <span className={`text-lg ${rating >= star ? 'text-yellow-500 font-bold' : 'text-gray-300'}`}>{star}</span>
                   </label>
                 ))}
               </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Cosa ha scritto?</label>
              <textarea 
                required
                className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Scrivi o incolla qui il testo della recensione..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-red-800 hover:bg-red-900 text-white rounded-lg font-bold text-lg transition-colors shadow-sm"
            >
              Salva e Prepara Risposta
            </button>
          </form>
        </div>
      )}
    </div>
  );
};