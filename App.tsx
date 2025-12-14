import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ManualEntry } from './components/ManualEntry';
import { ReviewCard } from './components/ReviewCard';
import { Review, ReviewSource } from './types';
import { MessageCircle, CheckCircle, RefreshCcw, DownloadCloud, Lock, ArrowRight } from 'lucide-react';

// Configuration for simple protection
const APP_PIN = "2424"; // Last 4 digits from the poster phone number

// Mock data to initialize the app
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    source: 'Google',
    author: 'Hans Müller',
    rating: 5,
    text: 'Cibo eccellente e atmosfera autentica! Lo stinco di maiale era perfetto. Torneremo sicuramente.',
    date: '2 giorni fa',
    status: 'pending'
  },
  {
    id: '2',
    source: 'TripAdvisor',
    author: 'Giulia Bianchi',
    rating: 3,
    text: 'Il posto è carino ma il servizio è stato un po\' lento. Forse perché era domenica ed era pieno.',
    date: '1 settimana fa',
    status: 'pending'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'pending' | 'replied' | 'all'>('pending');

  // Load reviews from local storage or use mock data on first load
  useEffect(() => {
    // Check session for auth
    const sessionAuth = sessionStorage.getItem('reiterstube_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }

    const savedReviews = localStorage.getItem('reiterstube_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(MOCK_REVIEWS);
    }
  }, []);

  // Save to local storage whenever reviews change
  useEffect(() => {
    localStorage.setItem('reiterstube_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === APP_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('reiterstube_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleAddReview = (text: string, source: ReviewSource, author: string, rating: number) => {
    const newReview: Review = {
      id: Date.now().toString(),
      source,
      author,
      rating,
      text,
      date: 'Oggi',
      status: 'pending'
    };
    setReviews([newReview, ...reviews]);
  };

  const handleUpdateReview = (id: string, updates: Partial<Review>) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  // Simulate Fetching new Reviews (F1) including TripAdvisor and TheFork
  const handleSimulateSync = () => {
    // Defines potential mock reviews from different sources
    const mockOptions: Partial<Review>[] = [
        {
            source: 'Google',
            author: 'Marco Verdi',
            rating: 5,
            text: 'Ottima birra e canederli fatti in casa buonissimi. Consigliato!',
        },
        {
            source: 'TripAdvisor',
            author: 'Tourist_UK_99',
            rating: 4,
            text: 'Great location near the sports zone. The garden is beautiful in winter too.',
        },
        {
            source: 'TheFork',
            author: 'Anna S.',
            rating: 5,
            text: 'Prenotato con sconto, ma avrei pagato prezzo pieno. Qualità altissima.',
        }
    ];

    // Pick a random one
    const randomReview = mockOptions[Math.floor(Math.random() * mockOptions.length)];

    const newMockReview: Review = {
        id: Date.now().toString(),
        source: randomReview.source as ReviewSource,
        author: randomReview.author!,
        rating: randomReview.rating!,
        text: randomReview.text!,
        date: 'Adesso',
        status: 'pending'
    };
    
    setReviews(prev => [newMockReview, ...prev]);
    alert(`Sincronizzazione simulata completata! Trovata 1 nuova recensione da ${newMockReview.source}.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-slate-700 p-6 text-center">
            <h1 className="text-white font-bold text-2xl tracking-wide">ReiterStube</h1>
            <p className="text-slate-300 text-sm mt-1">Area Riservata Staff</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 text-center">Inserisci PIN Accesso</label>
                <input 
                  type="password" 
                  maxLength={4}
                  className="w-full text-center text-2xl tracking-[0.5em] p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-800 bg-white"
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                />
              </div>
              {pinError && (
                <p className="text-red-500 text-xs text-center flex items-center justify-center">
                   <Lock size={12} className="mr-1" /> PIN non valido (Prova 2424)
                </p>
              )}
              <button 
                type="submit"
                className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-colors"
              >
                <span>Accedi</span>
                <ArrowRight size={18} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const repliedCount = reviews.filter(r => r.status === 'replied').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Dashboard Stats / Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex space-x-4 overflow-x-auto pb-2 md:pb-0">
             <button 
               onClick={() => setFilter('pending')}
               className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${filter === 'pending' ? 'bg-red-800 border-red-800 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
               <MessageCircle size={16} />
               <span>Da Rispondere ({pendingCount})</span>
             </button>
             <button 
               onClick={() => setFilter('replied')}
               className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${filter === 'replied' ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
               <CheckCircle size={16} />
               <span>Completati ({repliedCount})</span>
             </button>
          </div>

          <button 
            onClick={handleSimulateSync}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-red-800 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all font-medium text-sm shadow-sm"
          >
            <DownloadCloud size={16} />
            <span>Simula Sync (Multi-Source)</span>
          </button>
        </div>

        {/* Manual Entry Section */}
        {filter !== 'replied' && (
           <ManualEntry onAddReview={handleAddReview} />
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onUpdateReview={handleUpdateReview} 
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                 <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Nessuna recensione trovata</h3>
              <p className="text-slate-500">
                {filter === 'pending' ? "Ottimo lavoro! Hai risposto a tutto." : "Nessuna recensione in questa categoria."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
