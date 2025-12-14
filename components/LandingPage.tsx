import React, { useState } from 'react';
import { ArrowRight, Lock, Store, TrendingUp, Search, Users, ShieldCheck, Star, Zap, CheckCircle2, Clock, Coins, Bot, Globe, MapPin, Ghost, BrainCircuit, Network, TrendingDown, AlertTriangle, Hourglass, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onLogin: (code: string) => void;
  loginError: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, loginError }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(code);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-slate-900 text-white pt-12 pb-20 px-4 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left: Value Prop */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded-full border border-yellow-500/30">
              <Clock size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold tracking-wide uppercase">Risparmia 3 ore a settimana</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Rispondi alle recensioni nel tempo di un <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">caffè.</span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
              Google, TripAdvisor e TheFork premiano chi è attivo. 
              Il nostro sistema scrive risposte professionali per te in un click. 
              Zero sforzo, massima visibilità.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-green-400" />
                <span>Niente tecnologia complicata</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-green-400" />
                <span>Migliora la posizione su Google</span>
              </div>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full ml-auto">
            <div className="text-center mb-6">
               <h3 className="text-xl font-bold text-slate-800">Entra nel tuo Ristorante</h3>
               <p className="text-slate-500 text-sm mt-1">Inserisci il codice che ti abbiamo inviato</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Codice Accesso</label>
                <input 
                  type="password" 
                  className="w-full text-center text-lg p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-slate-50 placeholder:text-slate-300 transition-all"
                  placeholder="es. 2424"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              
              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center border border-red-100 flex items-center justify-center animate-shake">
                   <Lock size={12} className="mr-1" /> Codice errato. Riprova.
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-xl transform active:scale-[0.98]"
              >
                <span>Accedi</span>
                <ArrowRight size={18} className="ml-2" />
              </button>
            </form>

            <div className="mt-6 text-center">
               <p className="text-xs text-slate-400">Problemi con l'accesso?</p>
               <a href="#pricing" className="text-sm font-semibold text-red-600 hover:underline">Scrivi all'assistenza WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- PLATFORMS STRIP --- */}
      <div className="bg-slate-100 border-b border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Compatibile con tutte le piattaforme</p>
            <div className="flex justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center space-x-2 font-bold text-slate-600 text-xl"><MapPin size={24}/> <span>Google Maps</span></div>
                <div className="flex items-center space-x-2 font-bold text-slate-600 text-xl"><Globe size={24}/> <span>TripAdvisor</span></div>
                <div className="flex items-center space-x-2 font-bold text-slate-600 text-xl"><UtensilsIcon size={24}/> <span>TheFork</span></div>
            </div>
        </div>
      </div>

      {/* --- NEW SECTION: THE DEATH OF WEBSITES / RISE OF LLMs --- */}
      <section className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute top-10 left-10 text-slate-600"><BrainCircuit size={120} strokeWidth={0.5} /></div>
           <div className="absolute bottom-10 right-10 text-slate-600"><Network size={120} strokeWidth={0.5} /></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-red-400 bg-red-900/20 px-4 py-1.5 rounded-full border border-red-500/30 mb-6 animate-pulse">
                <Ghost size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Scenario 2025</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Il tuo Sito Web è <span className="text-red-500 line-through decoration-4 decoration-red-600">Morto</span>. <br/>
              Lunga Vita all'Intelligenza Artificiale.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              In futuro i clienti non visiteranno più i siti web. Chiederanno a <strong>ChatGPT, Gemini e Siri</strong> dove andare a cena. Se questi "robot" non trovano dati freschi su di te, per loro <strong>non esisti</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* CARD 1: The Problem */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors">
               <div className="bg-red-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-red-500 mb-6">
                 <Globe size={28} />
               </div>
               <h3 className="text-xl font-bold mb-3 text-white">I siti sono invisibili</h3>
               <p className="text-slate-400 leading-relaxed text-sm">
                 Le AI non leggono il design del tuo sito. Cercano <strong>Dati Strutturati</strong>: Menu testuali, Orari su Maps, e soprattutto Recensioni. Un sito bellissimo senza recensioni gestite è un deserto per l'AI.
               </p>
            </div>

            {/* CARD 2: The Logic */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors relative">
               <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                 Nuova Realtà
               </div>
               <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-blue-500 mb-6">
                 <Bot size={28} />
               </div>
               <h3 className="text-xl font-bold mb-3 text-white">Come "ragiona" l'AI</h3>
               <p className="text-slate-400 leading-relaxed text-sm">
                 ChatGPT consiglia chi ha una forte <strong>Social Proof</strong>. Se rispondi alle recensioni, segnali all'algoritmo che sei "Attivo", "Affidabile" e "Aperto". Se non rispondi, vieni classificato come "Bassa Rilevanza".
               </p>
            </div>

            {/* CARD 3: The Solution */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors">
               <div className="bg-green-500/10 w-14 h-14 rounded-xl flex items-center justify-center text-green-500 mb-6">
                 <TrendingUp size={28} />
               </div>
               <h3 className="text-xl font-bold mb-3 text-white">Nutri l'Algoritmo</h3>
               <p className="text-slate-400 leading-relaxed text-sm">
                 Usando il nostro Optimizer e rispondendo costantemente, stai letteralmente <strong>dando da mangiare all'AI</strong>. Crei i dati che i Chatbot useranno domani per portare i clienti alla tua porta.
               </p>
            </div>

          </div>

          <div className="mt-12 text-center">
             <div className="inline-block bg-slate-800 rounded-full px-6 py-3 border border-slate-700">
                <span className="text-slate-400 text-sm">Il risultato?</span>
                <span className="text-white font-bold ml-2">Chi non si adatta oggi, scompare domani.</span>
             </div>
          </div>
        </div>
      </section>

      {/* --- NUMBERS / DATA SECTION --- */}
      <section className="py-20 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 mb-4">I numeri del disastro</h2>
             <p className="text-slate-600">Ecco cosa perdi ogni giorno che non gestisci la tua reputazione online.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 items-start">
            
            {/* 1. LOST REVENUE */}
            <div className="text-center group">
               <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <TrendingDown size={36} />
               </div>
               <div className="text-5xl font-extrabold text-slate-900 mb-2">-9%</div>
               <div className="text-red-600 font-bold uppercase tracking-widest text-xs mb-3">Fatturato Annuo</div>
               <p className="text-slate-500 text-sm leading-relaxed px-4">
                 Secondo Harvard Business School, <strong>per ogni stella in meno</strong> su Google/TripAdvisor, un ristorante perde tra il 5% e il 9% del fatturato.
               </p>
            </div>

            {/* 2. VISIBILITY GRAPH */}
            <div className="text-center">
               <div className="h-20 mb-6 flex items-end justify-center space-x-1">
                 {/* CSS SVG Chart */}
                 <svg viewBox="0 0 100 50" className="w-48 h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                    
                    {/* Bad Trend */}
                    <path d="M0,25 C30,25 60,40 100,45" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
                    <text x="105" y="45" fontSize="8" fill="#94a3b8" className="font-sans">Tu oggi</text>

                    {/* Good Trend */}
                    <path d="M0,25 C30,25 40,10 100,0" fill="none" stroke="#22c55e" strokeWidth="4" />
                    <circle cx="100" cy="0" r="3" fill="#22c55e" />
                    <text x="105" y="5" fontSize="8" fill="#16a34a" fontWeight="bold" className="font-sans">Con AI</text>
                 </svg>
               </div>
               <div className="text-5xl font-extrabold text-slate-900 mb-2">3x</div>
               <div className="text-green-600 font-bold uppercase tracking-widest text-xs mb-3">Visibilità Maps</div>
               <p className="text-slate-500 text-sm leading-relaxed px-4">
                 Google Maps favorisce chi risponde entro 24h. I profili attivi ottengono <strong>3 volte più click</strong> sulla scheda e indicazioni stradali.
               </p>
            </div>

            {/* 3. TIME WASTED */}
            <div className="text-center group">
               <div className="bg-orange-50 w-20 h-20 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Hourglass size={36} />
               </div>
               
               {/* Custom Bar Chart for Time */}
               <div className="w-full max-w-[200px] mx-auto mb-4 space-y-2">
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="w-16 text-right mr-2">Manuale</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-red-400 w-full"></div>
                    </div>
                    <span className="ml-2 font-bold text-red-500">3h</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="w-16 text-right mr-2">Con AI</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[5%]"></div>
                    </div>
                    <span className="ml-2 font-bold text-green-500">5m</span>
                  </div>
               </div>

               <div className="text-red-600 font-bold uppercase tracking-widest text-xs mb-3">Tempo Perso</div>
               <p className="text-slate-500 text-sm leading-relaxed px-4">
                 Scrivere risposte manuali richiede in media 3 ore a settimana. Con il nostro tool impieghi <strong>5 minuti</strong> mentre bevi il caffè.
               </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- PAIN POINTS (Pragmatic) --- */}
      <section className="py-20 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Perché dovresti usarlo?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Gestire un ristorante è già abbastanza difficile. Non lasciare che le recensioni ti portino via altro tempo o fegato.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Card 1: Google SEO */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Più visibilità gratis</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Google premia chi risponde. Se rispondi a tutti, il tuo ristorante compare più in alto nelle ricerche rispetto a chi non lo fa. È pubblicità gratuita.
            </p>
          </div>

          {/* Card 2: Conversion */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
              <Coins size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Recupera i clienti</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Una risposta educata a una critica brutta convince i nuovi clienti che sei un professionista serio. Trasforma un problema in una nuova prenotazione.
            </p>
          </div>

          {/* Card 3: Loyalty */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Proteggi il tuo Staff</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Non serve che risponda tu personalmente. Con questo strumento, anche un cameriere fidato può rispondere perfettamente senza rischiare di scrivere cose sbagliate.
            </p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Simple) --- */}
      <section className="py-20 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
           <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Più semplice di WhatsApp.</h2>
              <div className="space-y-6">
                 <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-white/10 p-2 rounded text-red-400"><Store size={20}/></div>
                    <div>
                      <h4 className="font-bold text-lg">Sa già chi sei</h4>
                      <p className="text-slate-400 text-sm">Il sistema conosce già il nome del tuo ristorante e il tuo stile. Non devi rispiegarlo ogni volta.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-white/10 p-2 rounded text-blue-400"><Zap size={20}/></div>
                    <div>
                      <h4 className="font-bold text-lg">Copia e Incolla</h4>
                      <p className="text-slate-400 text-sm">Hai una recensione su TripAdvisor? Copia il testo, incollalo qui, clicca un tasto. Finito.</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="mt-1 bg-white/10 p-2 rounded text-green-400"><TrendingUp size={20}/></div>
                    <div>
                      <h4 className="font-bold text-lg">Meglio di ChatGPT</h4>
                      <p className="text-slate-400 text-sm">ChatGPT è generico e devi saperci parlare. Questo strumento è fatto solo per ristoratori: non devi imparare nulla di nuovo.</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="md:w-1/2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
              <div className="space-y-4 text-sm">
                 <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-red-300 text-xs uppercase font-bold mb-1">Recensione Cliente (TripAdvisor)</p>
                    <p className="text-slate-300 italic">"Cibo buono ma abbiamo aspettato 40 minuti per i primi. Non torneremo."</p>
                 </div>
                 
                 <div className="flex justify-center">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">
                        L'Intelligenza Artificiale sta scrivendo...
                    </div>
                 </div>

                 <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                    <p className="text-green-400 text-xs uppercase font-bold mb-1">La tua Risposta Automatica</p>
                    <p className="text-white">"Grazie per i complimenti sulla cucina! Ci dispiace sinceramente per l'attesa, domenica la sala era molto affollata. Lavoriamo sodo per migliorare i tempi. Dateci una seconda possibilità per farvi vivere l'esperienza perfetta che meritate."</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- PRICING (Concrete comparisons) --- */}
      <section id="pricing" className="py-20 px-4 bg-slate-50">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Quanto costa?</h2>
            <p className="text-slate-600 mb-12">Meno di quanto spendi in caffè in una settimana.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
               {/* STARTER */}
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-red-200 transition-colors">
                  <h3 className="text-xl font-bold text-slate-700">Base</h3>
                  <div className="my-4">
                     <span className="text-4xl font-extrabold text-slate-900">€19</span>
                     <span className="text-slate-500">/mese</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 italic">Il costo di 2 pizze margherita.</p>
                  <ul className="text-left space-y-3 mb-8 text-slate-600 text-sm">
                     <li className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2"/> Fino a 50 risposte al mese</li>
                     <li className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2"/> Inserimento facile</li>
                     <li className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2"/> Funziona su telefono e PC</li>
                  </ul>
                  <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                     Richiedi Codice
                  </button>
               </div>

               {/* PRO */}
               <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-red-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wide rounded-bl-lg">
                     Consigliato
                  </div>
                  <h3 className="text-xl font-bold text-red-800">Pro</h3>
                  <div className="my-4">
                     <span className="text-4xl font-extrabold text-slate-900">€45</span>
                     <span className="text-slate-500">/mese</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-6 italic">Meno di un calice di vino al giorno.</p>
                  <ul className="text-left space-y-3 mb-8 text-slate-600 text-sm">
                     <li className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2"/> <strong>Risposte Illimitate</strong></li>
                     <li className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2"/> <strong>Copia/Incolla Magico</strong> (TripAdvisor/TheFork)</li>
                     <li className="flex items-center"><CheckCircle2 size={16} className="text-green-500 mr-2"/> Risponde anche in Inglese/Tedesco</li>
                  </ul>
                  <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg">
                     Prova Gratis
                  </button>
               </div>
            </div>
         </div>
      </section>

      <footer className="bg-slate-900 py-8 text-center text-slate-500 text-sm border-t border-slate-800">
         <p>&copy; {new Date().getFullYear()} ReviewManager - Fatto per i Ristoratori.</p>
      </footer>
    </div>
  );
};

// Helper components for missing Lucide icons in some sets
const UtensilsIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);

const SparklesIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 9h4"/><path d="M3 5h4"/></svg>
);