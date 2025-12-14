import React, { useState } from 'react';
import { Review, ReplyTone, ReplyLanguage } from '../types';
import { generateReviewReply } from '../services/geminiService';
import { Star, MessageSquare, Copy, CheckCircle, RefreshCw, AlertCircle, SlidersHorizontal, Globe } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onUpdateReview: (id: string, updates: Partial<Review>) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onUpdateReview }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedReply, setEditedReply] = useState(review.reply || '');
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ReplyTone>('formal');
  const [selectedLanguage, setSelectedLanguage] = useState<ReplyLanguage>('it');

  const handleGenerateReply = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const reply = await generateReviewReply({
        reviewText: review.text,
        authorName: review.author,
        rating: review.rating,
        tone: selectedTone,
        language: selectedLanguage,
      });
      setEditedReply(reply);
    } catch (err) {
      setError("Errore nella generazione AI. Riprova.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsReplied = () => {
    onUpdateReview(review.id, { 
      status: 'replied', 
      reply: editedReply 
    });
  };

  const handleReopen = () => {
    onUpdateReview(review.id, { status: 'pending' });
  };

  const toneOptions: { value: ReplyTone; label: string }[] = [
    { value: 'formal', label: 'Formale' },
    { value: 'informal', label: 'Informale' },
    { value: 'friendly', label: 'Amichevole' },
    { value: 'concise', label: 'Conciso' },
  ];

  const languageOptions: { value: ReplyLanguage; label: string }[] = [
    { value: 'it', label: '🇮🇹 IT' },
    { value: 'en', label: '🇬🇧 EN' },
    { value: 'de', label: '🇩🇪 DE' },
  ];
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border ${review.status === 'replied' ? 'border-green-100 opacity-75' : 'border-slate-200'} transition-all duration-200 overflow-hidden`}>
      {/* Header Section */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
             <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
               review.source === 'Google' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
               review.source === 'TripAdvisor' ? 'bg-green-50 text-green-700 border border-green-100' :
               review.source === 'TheFork' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
               'bg-slate-100 text-slate-700 border border-slate-200'
             }`}>
               {review.source}
             </span>
             <span className="text-sm text-slate-500">{review.date}</span>
          </div>
          <div className="flex items-center space-x-1">
             {[...Array(5)].map((_, i) => (
               <Star 
                key={i} 
                size={16} 
                className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
               />
             ))}
          </div>
        </div>
        
        <h3 className="font-bold text-slate-800 text-lg mb-1">{review.author}</h3>
        <p className="text-slate-600 leading-relaxed italic">"{review.text}"</p>
      </div>

      {/* Action Section */}
      <div className="p-5 bg-slate-50/50">
        {review.status === 'pending' ? (
          <div className="space-y-4">
            
            {/* Options Control */}
            {!editedReply && !isGenerating && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="flex items-center text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">
                    <SlidersHorizontal size={14} className="mr-1" />
                    Tono Risposta
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {toneOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedTone(option.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedTone === option.value
                            ? 'bg-red-50 border-red-200 text-red-800 ring-1 ring-red-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">
                    <Globe size={14} className="mr-1" />
                    Lingua
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedLanguage(option.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          selectedLanguage === option.value
                            ? 'bg-blue-50 border-blue-200 text-blue-800 ring-1 ring-blue-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!editedReply && !isGenerating && (
              <button 
                onClick={handleGenerateReply}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white border border-red-200 text-red-800 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm mt-2"
              >
                <MessageSquare size={18} />
                <span>Genera Risposta ({languageOptions.find(l => l.value === selectedLanguage)?.label})</span>
              </button>
            )}

            {isGenerating && (
               <div className="flex items-center space-x-2 text-red-600 animate-pulse py-2">
                 <RefreshCw size={18} className="animate-spin" />
                 <span>Creazione risposta <strong>{selectedTone}</strong> in <strong>{selectedLanguage.toUpperCase()}</strong>...</span>
               </div>
            )}

            {error && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {editedReply && (
              <div className="space-y-3 animate-fadeIn">
                <div className="relative">
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Bozza Risposta</label>
                    <div className="flex space-x-2">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-200 rounded-full text-slate-600">
                        {toneOptions.find(t => t.value === selectedTone)?.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-blue-100 rounded-full text-blue-700 border border-blue-200">
                        {languageOptions.find(l => l.value === selectedLanguage)?.label}
                      </span>
                    </div>
                  </div>
                  <textarea 
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[100px] bg-white text-gray-900"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      copied 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Copiato!' : 'Copia Risposta'}</span>
                  </button>
                  
                  <button 
                    onClick={handleMarkAsReplied}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span>Segna come Risposto</span>
                  </button>

                  <button
                    onClick={handleGenerateReply}
                    className="p-2 text-slate-400 hover:text-red-700 transition-colors"
                    title="Rigenera con gli stessi parametri"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-center">Copia la risposta e incollala nella piattaforma originale.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
             <div className="flex items-center text-green-600 font-medium space-x-2">
                <CheckCircle size={20} />
                <span>Risposta inviata</span>
             </div>
             {review.reply && (
               <div className="p-3 bg-slate-100 rounded text-sm text-slate-600 italic border-l-4 border-green-500">
                 {review.reply}
               </div>
             )}
             <button 
               onClick={handleReopen}
               className="text-sm text-slate-400 hover:text-slate-600 underline self-start"
             >
               Riapri per modifica
             </button>
          </div>
        )}
      </div>
    </div>
  );
};