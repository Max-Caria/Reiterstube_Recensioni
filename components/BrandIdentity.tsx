import React, { useState, useEffect } from 'react';
import { BrandIdentity as IBrandIdentity } from '../types';
import { Mic, Save, Fingerprint, BookOpen, Target, Heart, MicOff } from 'lucide-react';

interface BrandIdentityProps {
  identity?: IBrandIdentity;
  onSave: (identity: IBrandIdentity) => void;
}

export const BrandIdentity: React.FC<BrandIdentityProps> = ({ identity, onSave }) => {
  const [vision, setVision] = useState(identity?.vision || '');
  const [values, setValues] = useState(identity?.values || '');
  const [history, setHistory] = useState(identity?.history || '');
  const [isSaved, setIsSaved] = useState(false);

  // Speech Recognition State
  const [listeningField, setListeningField] = useState<'vision' | 'values' | 'history' | null>(null);

  // Helper for Speech Recognition
  const toggleListening = (field: 'vision' | 'values' | 'history') => {
    if (listeningField === field) {
      setListeningField(null); // Stop listening
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Il tuo browser non supporta la dettatura vocale. Usa Chrome o Safari.");
      return;
    }

    // @ts-ignore - SpeechRecognition is not standard in all TS definitions
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListeningField(field);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'vision') setVision(prev => prev + (prev ? ' ' : '') + transcript);
      if (field === 'values') setValues(prev => prev + (prev ? ' ' : '') + transcript);
      if (field === 'history') setHistory(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onend = () => {
      setListeningField(null);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setListeningField(null);
    };

    recognition.start();
  };

  const handleSave = () => {
    onSave({ vision, values, history });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 bg-white/5 w-64 h-64 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 flex items-start justify-between">
           <div>
              <div className="flex items-center space-x-3 mb-2">
                 <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-400/30">
                   <Fingerprint className="text-emerald-300" size={24} />
                 </div>
                 <h2 className="text-2xl font-bold">Identità del Ristorante</h2>
              </div>
              <p className="text-emerald-100 max-w-xl leading-relaxed text-sm">
                Insegna all'Intelligenza Artificiale chi sei veramente. 
                Inserendo Visione, Valori e Storia, le risposte non sembreranno scritte da un robot, ma da te.
              </p>
           </div>
           <button 
             onClick={handleSave}
             className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
               isSaved ? 'bg-green-500 text-white' : 'bg-white text-emerald-900 hover:bg-emerald-50'
             }`}
           >
             <Save size={18} />
             <span>{isSaved ? 'Salvato!' : 'Salva Modifiche'}</span>
           </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* VISION */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center">
                 <Target size={18} className="text-blue-500 mr-2" />
                 Visione
              </h3>
              <button 
                onClick={() => toggleListening('vision')}
                className={`p-2 rounded-full transition-colors ${listeningField === 'vision' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                title="Dettatura Vocale"
              >
                 {listeningField === 'vision' ? <MicOff size={16}/> : <Mic size={16}/>}
              </button>
           </div>
           <p className="text-xs text-slate-400 mb-3">
              Che esperienza vuoi regalare? Es: "Vogliamo essere il rifugio caldo per chi ama la montagna."
           </p>
           <textarea 
             className="w-full flex-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
             placeholder="Clicca il microfono e parla..."
             value={vision}
             onChange={e => setVision(e.target.value)}
           />
        </div>

        {/* VALUES */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center">
                 <Heart size={18} className="text-red-500 mr-2" />
                 Valori
              </h3>
              <button 
                onClick={() => toggleListening('values')}
                className={`p-2 rounded-full transition-colors ${listeningField === 'values' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                title="Dettatura Vocale"
              >
                 {listeningField === 'values' ? <MicOff size={16}/> : <Mic size={16}/>}
              </button>
           </div>
           <p className="text-xs text-slate-400 mb-3">
              In cosa credi? Es: "Sostenibilità, Ingredienti a Km0, Accoglienza familiare."
           </p>
           <textarea 
             className="w-full flex-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
             placeholder="Clicca il microfono e parla..."
             value={values}
             onChange={e => setValues(e.target.value)}
           />
        </div>

        {/* HISTORY */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 flex items-center">
                 <BookOpen size={18} className="text-amber-500 mr-2" />
                 Storia & Tradizioni
              </h3>
              <button 
                onClick={() => toggleListening('history')}
                className={`p-2 rounded-full transition-colors ${listeningField === 'history' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                title="Dettatura Vocale"
              >
                 {listeningField === 'history' ? <MicOff size={16}/> : <Mic size={16}/>}
              </button>
           </div>
           <p className="text-xs text-slate-400 mb-3">
              Le tue radici. Es: "Fondato nel 1950 da nonno Hans, usiamo ancora la sua ricetta per i canederli."
           </p>
           <textarea 
             className="w-full flex-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none resize-none"
             placeholder="Clicca il microfono e parla..."
             value={history}
             onChange={e => setHistory(e.target.value)}
           />
        </div>

      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start text-yellow-800 text-sm">
         <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-0.5">
            <Fingerprint size={16} />
         </div>
         <div>
            <strong>Come funziona?</strong> Una volta salvati questi dati, l'Intelligenza Artificiale li leggerà ogni volta che genera una risposta a una recensione. Se un cliente loda il cibo, l'AI potrebbe rispondere citando la "ricetta di nonno Hans" o il "Km0", rendendo la risposta unica e personale.
         </div>
      </div>
    </div>
  );
};