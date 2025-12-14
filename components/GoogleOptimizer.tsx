import React, { useState } from 'react';
import { generateOptimizationData, generateMenuDescription, generateGooglePost, generateQnA } from '../services/geminiService';
import { OptimizationResult, Tenant, QnAPair } from '../types';
import { MapPin, Search, Camera, FileText, Sparkles, Copy, CheckCircle, ArrowRight, Utensils, Megaphone, HelpCircle, Info } from 'lucide-react';

interface GoogleOptimizerProps {
  tenant: Tenant;
  onConsumeCredit: () => boolean;
}

type Tab = 'info' | 'menu' | 'posts' | 'qna';

export const GoogleOptimizer: React.FC<GoogleOptimizerProps> = ({ tenant, onConsumeCredit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [isLoading, setIsLoading] = useState(false);

  // -- STATE FOR INFO OPTIMIZER --
  const [location, setLocation] = useState(tenant.location || '');
  const [cuisine, setCuisine] = useState(tenant.cuisineType || '');
  const [infoResult, setInfoResult] = useState<OptimizationResult | null>(null);

  // -- STATE FOR MENU ENGINEER --
  const [dishName, setDishName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [dishStyle, setDishStyle] = useState<'gourmet' | 'rustic' | 'simple'>('rustic');
  const [menuResult, setMenuResult] = useState('');

  // -- STATE FOR POST CREATOR --
  const [postTopic, setPostTopic] = useState<'update' | 'offer' | 'event'>('update');
  const [postDetails, setPostDetails] = useState('');
  const [postResult, setPostResult] = useState('');

  // -- STATE FOR Q&A --
  const [qnaResult, setQnaResult] = useState<QnAPair[]>([]);

  // -- HANDLERS --

  const handleInfoOptimize = async () => {
    if (!onConsumeCredit()) return alert("Crediti esauriti.");
    setIsLoading(true);
    try {
      const data = await generateOptimizationData({
        restaurantName: tenant.name,
        cuisineType: cuisine,
        location: location,
        currentDescription: ""
      });
      setInfoResult(data);
    } catch (e) { alert("Errore"); } finally { setIsLoading(false); }
  };

  const handleMenuOptimize = async () => {
    if (!dishName) return alert("Inserisci il nome del piatto.");
    if (!onConsumeCredit()) return alert("Crediti esauriti.");
    setIsLoading(true);
    try {
      const desc = await generateMenuDescription({ dishName, ingredients, style: dishStyle });
      setMenuResult(desc);
    } catch (e) { alert("Errore"); } finally { setIsLoading(false); }
  };

  const handlePostCreate = async () => {
    if (!postDetails) return alert("Inserisci qualche dettaglio.");
    if (!onConsumeCredit()) return alert("Crediti esauriti.");
    setIsLoading(true);
    try {
      const post = await generateGooglePost({ topic: postTopic, details: postDetails, restaurantName: tenant.name });
      setPostResult(post);
    } catch (e) { alert("Errore"); } finally { setIsLoading(false); }
  };

  const handleQnAGenerate = async () => {
    if (!onConsumeCredit()) return alert("Crediti esauriti.");
    setIsLoading(true);
    try {
      const pairs = await generateQnA({ restaurantName: tenant.name, cuisineType: cuisine });
      setQnaResult(pairs);
    } catch (e) { alert("Errore"); } finally { setIsLoading(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiato!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-white/5 w-64 h-64 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
             <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-400/30">
               <MapPin className="text-blue-300" size={24} />
             </div>
             <h2 className="text-2xl font-bold">Google Maps Optimizer</h2>
          </div>
          <p className="text-blue-100 max-w-xl leading-relaxed text-sm">
            Una suite completa per dominare la ricerca locale. Ottimizza il profilo, rendi irresistibile il menu e pubblica aggiornamenti che convertono.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {[
          { id: 'info', label: 'Info & SEO', icon: <Info size={16}/> },
          { id: 'menu', label: 'Menu Engineering', icon: <Utensils size={16}/> },
          { id: 'posts', label: 'Google Posts', icon: <Megaphone size={16}/> },
          { id: 'qna', label: 'Q&A Automatici', icon: <HelpCircle size={16}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- TAB: INFO OPTIMIZER --- */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
           {!infoResult ? (
             <div className="space-y-4">
               <h3 className="font-bold text-slate-800">Ottimizza Descrizione & Keyword</h3>
               <div className="grid md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Città" value={location} onChange={e => setLocation(e.target.value)} className="p-3 border rounded-lg w-full" />
                 <input type="text" placeholder="Cucina" value={cuisine} onChange={e => setCuisine(e.target.value)} className="p-3 border rounded-lg w-full" />
               </div>
               <button onClick={handleInfoOptimize} disabled={isLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                 {isLoading ? 'Analisi...' : 'Ottimizza Profilo'}
               </button>
             </div>
           ) : (
             <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border">
                  <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Descrizione Profilo</h4>
                  <p className="text-sm text-slate-700">{infoResult.optimizedDescription}</p>
                  <button onClick={() => copyToClipboard(infoResult.optimizedDescription)} className="mt-2 text-blue-600 text-xs font-bold flex items-center"><Copy size={12} className="mr-1"/> Copia</button>
                </div>
                <div>
                   <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Parole Chiave Suggerite</h4>
                   <div className="flex flex-wrap gap-2">
                     {infoResult.keywords.map((k, i) => <span key={i} className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs border border-purple-100">{k}</span>)}
                   </div>
                </div>
                <button onClick={() => setInfoResult(null)} className="text-slate-400 text-sm underline">Ricomincia</button>
             </div>
           )}
        </div>
      )}

      {/* --- TAB: MENU ENGINEER --- */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
           <div className="mb-6">
              <h3 className="font-bold text-slate-800 mb-1">Menu Engineer AI</h3>
              <p className="text-sm text-slate-500">Google indicizza i piatti. Trasforma "Canederli" in una descrizione che fa venire fame.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Nome Piatto (es. Carbonara)" 
                value={dishName} 
                onChange={e => setDishName(e.target.value)} 
                className="p-3 border rounded-lg w-full"
              />
              <input 
                type="text" 
                placeholder="Ingredienti principali (opzionale)" 
                value={ingredients} 
                onChange={e => setIngredients(e.target.value)} 
                className="p-3 border rounded-lg w-full"
              />
              <select 
                value={dishStyle} 
                onChange={e => setDishStyle(e.target.value as any)}
                className="p-3 border rounded-lg w-full"
              >
                <option value="rustic">Rustico / Tradizionale</option>
                <option value="gourmet">Gourmet / Elegante</option>
                <option value="simple">Semplice / Diretto</option>
              </select>
           </div>

           <button 
             onClick={handleMenuOptimize} 
             disabled={isLoading} 
             className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold flex items-center justify-center mb-6"
           >
             {isLoading ? <Sparkles className="animate-spin" /> : 'Genera Descrizione "Food Porn"'}
           </button>

           {menuResult && (
             <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 relative">
                <p className="text-orange-900 italic text-lg">"{menuResult}"</p>
                <button 
                  onClick={() => copyToClipboard(menuResult)} 
                  className="absolute top-2 right-2 text-orange-400 hover:text-orange-700"
                >
                  <Copy size={18}/>
                </button>
             </div>
           )}
        </div>
      )}

      {/* --- TAB: POST CREATOR --- */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
           <div className="mb-6">
              <h3 className="font-bold text-slate-800 mb-1">Google Post Creator</h3>
              <p className="text-sm text-slate-500">I post scadono dopo 7 giorni. Creane uno nuovo ogni settimana per rimanere in cima alle ricerche.</p>
           </div>

           <div className="space-y-4 mb-4">
              <div className="flex space-x-4">
                 <button onClick={() => setPostTopic('update')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${postTopic === 'update' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600'}`}>Aggiornamento</button>
                 <button onClick={() => setPostTopic('offer')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${postTopic === 'offer' ? 'bg-green-50 border-green-200 text-green-700' : 'border-slate-200 text-slate-600'}`}>Offerta Speciale</button>
                 <button onClick={() => setPostTopic('event')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${postTopic === 'event' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-slate-200 text-slate-600'}`}>Evento</button>
              </div>
              
              <textarea 
                placeholder="Dettagli grezzi (es. Venerdì musica dal vivo, birra media a 3 euro)" 
                value={postDetails}
                onChange={e => setPostDetails(e.target.value)}
                className="w-full p-3 border rounded-lg h-24"
              />
           </div>

           <button 
             onClick={handlePostCreate} 
             disabled={isLoading} 
             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center mb-6"
           >
             {isLoading ? <Sparkles className="animate-spin" /> : 'Scrivi Post'}
           </button>

           {postResult && (
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                <p className="text-slate-800 whitespace-pre-wrap">{postResult}</p>
                <button 
                  onClick={() => copyToClipboard(postResult)} 
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
                >
                  <Copy size={18}/>
                </button>
             </div>
           )}
        </div>
      )}

      {/* --- TAB: Q&A --- */}
      {activeTab === 'qna' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fadeIn">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Domande & Risposte (Q&A)</h3>
                <p className="text-sm text-slate-500">Anticipa i dubbi dei clienti. Copia queste domande nel tuo profilo Google Maps.</p>
              </div>
              <button onClick={handleQnAGenerate} disabled={isLoading} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Genera Q&A</button>
           </div>

           {qnaResult.length > 0 && (
             <div className="space-y-4">
               {qnaResult.map((pair, idx) => (
                 <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-start mb-2">
                       <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded mr-2 mt-0.5">DOMANDA</span>
                       <p className="font-bold text-slate-800 text-sm">{pair.question}</p>
                    </div>
                    <div className="flex items-start">
                       <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded mr-2 mt-0.5">RISPOSTA</span>
                       <p className="text-slate-600 text-sm italic">{pair.answer}</p>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      )}

    </div>
  );
};