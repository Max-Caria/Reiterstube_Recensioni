import React, { useState } from 'react';
import { ReviewSource } from '../types';
import { PlusCircle, Sparkles, X, ArrowDown } from 'lucide-react';
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
      alert("Impossibile analizzare il testo automaticamente. Compila i campi manualmente.");
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
          Inserimento Manuale / Importazione
        </h2>
        <span className="text-slate-400 text-sm">{isExpanded ? 'Chiudi' : 'Espandi'}</span>
      </div>

      {isExpanded && (
        <div className="animate-fadeIn">
          {/* Smart Paste Toggle Section */}
          <div className="px-5 pt-4">
             {!showSmartPaste ? (
               <button 
                 onClick={() => setShowSmartPaste(true)}
                 className="w-full py-3 border-2 border-dashed border-red-200 bg-red-50/30 rounded-lg text-red-700 font-medium flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors"
               >
                 <Sparkles size={18} className="mr-2" />
                 Incolla testo grezzo da TripAdvisor / TheFork (AI Magic)
               </button>
             ) : (
               <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-red-800 uppercase tracking-wide flex items-center">
                      <Sparkles size={12} className="mr-1" /> Importazione Intelligente
                    </label>
                    <button onClick={() => setShowSmartPaste(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={16} />
                    </button>
                  </div>
                  <textarea 
                    className="w-full p-3 border border-red-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 mb-2"
                    placeholder="Incolla qui tutto il blocco della recensione (es: 'Mario Rossi 5 stelle ieri... Il cibo era ottimo...')"
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                  />
                  <button 
                    onClick={handleSmartParse}
                    disabled={isParsing || !rawInput.trim()}
                    className="w-full py-2 bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white rounded-md font-medium text-sm flex items-center justify-center transition-colors"
                  >
                    {isParsing ? (
                      <span>Analisi in corso...</span>
                    ) : (
                      <>
                        <span>Estrai Dati e Compila Form</span>
                        <ArrowDown size={14} className="ml-1" />
                      </>
                    )}
                  </button>
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
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                  placeholder="Mario Rossi"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fonte</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                  value={source}
                  onChange={(e) => setSource(e.target.value as ReviewSource)}
                >
                  <option value="Manual">Manuale / Altro</option>
                  <option value="TripAdvisor">TripAdvisor</option>
                  <option value="TheFork">TheFork</option>
                  <option value="Google">Google</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
               <label className="block text-sm font-medium text-slate-700 mb-1">Valutazione (Stelle)</label>
               <div className="flex space-x-4">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <label key={star} className="flex items-center cursor-pointer">
                     <input 
                       type="radio" 
                       name="rating" 
                       value={star}
                       checked={rating === star}
                       onChange={() => setRating(star)}
                       className="mr-1 text-red-600 focus:ring-red-500 bg-white"
                     />
                     <span className={rating >= star ? 'text-yellow-500 font-bold' : 'text-gray-300'}>{star}</span>
                   </label>
                 ))}
               </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Testo Recensione</label>
              <textarea 
                required
                className="w-full p-3 border border-slate-300 rounded-lg text-sm h-24 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                placeholder="Incolla qui il testo della recensione..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Aggiungi alla lista
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
