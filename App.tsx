import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ManualEntry } from './components/ManualEntry';
import { ReviewCard } from './components/ReviewCard';
import { LandingPage } from './components/LandingPage';
import { GoogleOptimizer } from './components/GoogleOptimizer';
import { PhotoStudio } from './components/PhotoStudio';
import { BrandIdentity } from './components/BrandIdentity';
import { Review, ReviewSource, Tenant, BrandIdentity as IBrandIdentity } from './types';
import { MessageCircle, CheckCircle, DownloadCloud, MapPin, Camera, Fingerprint } from 'lucide-react';

// --- SAAS CONFIGURATION: PILOT EDITION ---
// ⚠️ CONFIGURAZIONE PILOTA: Sostituisci i nomi e i codici con quelli dei tuoi 10 clienti reali.
// L'accessCode è la "password" che dovranno inserire per entrare.
const TENANTS_DB: Tenant[] = [
  // --- CLIENTI PREMIUM (PRO) ---
  {
    id: 'pilot_01',
    name: 'Ristorante Da Mario', // Sostituisci
    accessCode: 'MARIO24',       // Sostituisci
    planLimit: 300,
    planName: 'Pro',
    location: 'Roma Centro',
    cuisineType: 'Cucina Romana Tradizionale'
  },
  {
    id: 'pilot_02',
    name: 'Sushi Zen Experience',
    accessCode: 'ZEN24',
    planLimit: 300,
    planName: 'Pro',
    location: 'Milano',
    cuisineType: 'Giapponese Fusion'
  },
  {
    id: 'pilot_03',
    name: 'Osteria del Porto',
    accessCode: 'PORTO24',
    planLimit: 300,
    planName: 'Pro',
    location: 'Genova',
    cuisineType: 'Pesce Fresco'
  },
  // --- CLIENTI STANDARD (BASIC) ---
  {
    id: 'pilot_04',
    name: 'Pizzeria Bella Napoli',
    accessCode: 'PIZZA24',
    planLimit: 100,
    planName: 'Basic',
    location: 'Napoli',
    cuisineType: 'Pizza Napoletana'
  },
  {
    id: 'pilot_05',
    name: 'Burger Station',
    accessCode: 'BURGER24',
    planLimit: 100,
    planName: 'Basic',
    location: 'Torino',
    cuisineType: 'Hamburger Gourmet'
  },
  {
    id: 'pilot_06',
    name: 'Trattoria I Nonni',
    accessCode: 'NONNI24',
    planLimit: 100,
    planName: 'Basic',
    location: 'Firenze',
    cuisineType: 'Cucina Toscana'
  },
  {
    id: 'pilot_07',
    name: 'Gelateria Blu',
    accessCode: 'GELO24',
    planLimit: 100,
    planName: 'Basic',
    location: 'Rimini',
    cuisineType: 'Gelato Artigianale'
  },
  {
    id: 'pilot_08',
    name: 'Bar Centrale',
    accessCode: 'BAR24',
    planLimit: 50,
    planName: 'Basic',
    location: 'Bologna',
    cuisineType: 'Caffetteria & Aperitivi'
  },
  {
    id: 'pilot_09',
    name: 'Bistrot 99',
    accessCode: 'BISTROT24',
    planLimit: 50,
    planName: 'Basic',
    location: 'Verona',
    cuisineType: 'Cucina Moderna'
  },
  {
    id: 'pilot_10',
    name: 'Agriturismo Verde',
    accessCode: 'VERDE24',
    planLimit: 150,
    planName: 'Pro',
    location: 'Chianti',
    cuisineType: 'Agriturismo'
  },
  // --- DEMO / INTERNO ---
  {
    id: 'demo_internal',
    name: 'ReiterStube (Demo)',
    accessCode: '2424',
    planLimit: 999,
    planName: 'Enterprise',
    location: 'Vipiteno',
    cuisineType: 'Cucina Tirolese'
  }
];

// Mock data generator for new tenants
const getMockReviewsForTenant = (tenantName: string): Review[] => {
  return [
    {
      id: '1',
      source: 'Google',
      author: 'Hans Müller',
      rating: 5,
      text: `Cibo eccellente e atmosfera autentica da ${tenantName}! Torneremo sicuramente.`,
      date: '2 giorni fa',
      status: 'pending'
    },
    {
      id: '2',
      source: 'TripAdvisor',
      author: 'Giulia Bianchi',
      rating: 3,
      text: 'Il posto è carino ma il servizio è stato un po\' lento. Forse perché era domenica.',
      date: '1 settimana fa',
      status: 'pending'
    }
  ];
};

const App: React.FC = () => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loginError, setLoginError] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'pending' | 'replied' | 'all'>('pending');
  const [currentTab, setCurrentTab] = useState<'reviews' | 'optimizer' | 'photo' | 'identity'>('reviews');
  
  // Usage Tracking State
  const [creditsUsed, setCreditsUsed] = useState(0);

  // Load session
  useEffect(() => {
    const sessionTenantId = sessionStorage.getItem('review_manager_tenant_id');
    if (sessionTenantId) {
      const tenant = TENANTS_DB.find(t => t.id === sessionTenantId);
      if (tenant) {
        loadTenantData(tenant);
      }
    }
  }, []);

  const loadTenantData = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setLoginError(false);
    
    // Load Reviews specific to this tenant
    const storageKey = `reviews_${tenant.id}`;
    const savedReviews = localStorage.getItem(storageKey);
    
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(getMockReviewsForTenant(tenant.name));
    }

    // Load Identity
    const identityKey = `identity_${tenant.id}`;
    const savedIdentity = localStorage.getItem(identityKey);
    if (savedIdentity && tenant) {
      tenant.identity = JSON.parse(savedIdentity);
    }

    // Load Usage Stats
    const usageKey = `usage_${tenant.id}_${new Date().getMonth()}`; // Resets every month roughly
    const savedUsage = localStorage.getItem(usageKey);
    setCreditsUsed(savedUsage ? parseInt(savedUsage) : 0);
  };

  // Save to local storage whenever reviews change
  useEffect(() => {
    if (currentTenant) {
      localStorage.setItem(`reviews_${currentTenant.id}`, JSON.stringify(reviews));
    }
  }, [reviews, currentTenant]);

  const handleLogin = (code: string) => {
    const tenant = TENANTS_DB.find(t => t.accessCode === code.trim());
    
    if (tenant) {
      sessionStorage.setItem('review_manager_tenant_id', tenant.id);
      loadTenantData(tenant);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('review_manager_tenant_id');
    setCurrentTenant(null);
    setReviews([]);
    setCreditsUsed(0);
    setCurrentTab('reviews');
  };

  const handleConsumeCredit = (): boolean => {
    if (!currentTenant) return false;
    if (creditsUsed >= currentTenant.planLimit) return false;

    const newUsage = creditsUsed + 1;
    setCreditsUsed(newUsage);
    
    // Persist usage
    const usageKey = `usage_${currentTenant.id}_${new Date().getMonth()}`;
    localStorage.setItem(usageKey, newUsage.toString());
    
    return true;
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

  const handleSaveIdentity = (identity: IBrandIdentity) => {
    if (!currentTenant) return;
    const updatedTenant = { ...currentTenant, identity };
    setCurrentTenant(updatedTenant);
    localStorage.setItem(`identity_${currentTenant.id}`, JSON.stringify(identity));
  };

  const handleSimulateSync = () => {
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
    alert(`Sync completata! Nuova recensione trovata per ${currentTenant?.name}.`);
  };

  if (!currentTenant) {
    return <LandingPage onLogin={handleLogin} loginError={loginError} />;
  }

  const filteredReviews = reviews.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const repliedCount = reviews.filter(r => r.status === 'replied').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header 
        restaurantName={currentTenant.name} 
        planName={currentTenant.planName}
        creditsUsed={creditsUsed}
        creditsLimit={currentTenant.planLimit}
        onLogout={handleLogout}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
           <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex overflow-x-auto max-w-full">
              <button
                onClick={() => setCurrentTab('reviews')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  currentTab === 'reviews' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <MessageCircle size={18} className="mr-2" />
                <span className="hidden sm:inline">Recensioni</span>
                <span className="sm:hidden">Chat</span>
              </button>
              <button
                onClick={() => setCurrentTab('optimizer')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  currentTab === 'optimizer' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <MapPin size={18} className="mr-2" />
                <span className="hidden sm:inline">SEO Maps</span>
                <span className="sm:hidden">SEO</span>
              </button>
              <button
                onClick={() => setCurrentTab('photo')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  currentTab === 'photo' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Camera size={18} className="mr-2" />
                <span className="hidden sm:inline">Studio Foto</span>
                <span className="sm:hidden">Foto</span>
              </button>
              <button
                onClick={() => setCurrentTab('identity')}
                className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center whitespace-nowrap ${
                  currentTab === 'identity' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Fingerprint size={18} className="mr-2" />
                <span className="hidden sm:inline">Identità Brand</span>
                <span className="sm:hidden">Identità</span>
              </button>
           </div>
        </div>

        {/* --- VIEW: REVIEWS --- */}
        {currentTab === 'reviews' && (
          <div className="animate-fadeIn">
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
                <span>Simula Sync</span>
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
                    restaurantName={currentTenant.name}
                    brandIdentity={currentTenant.identity}
                    onUpdateReview={handleUpdateReview}
                    onConsumeCredit={handleConsumeCredit}
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
          </div>
        )}

        {/* --- VIEW: OPTIMIZER --- */}
        {currentTab === 'optimizer' && (
          <GoogleOptimizer 
            tenant={currentTenant}
            onConsumeCredit={handleConsumeCredit}
          />
        )}

        {/* --- VIEW: PHOTO STUDIO --- */}
        {currentTab === 'photo' && (
          <PhotoStudio
            tenant={currentTenant}
            onConsumeCredit={handleConsumeCredit}
          />
        )}

        {/* --- VIEW: BRAND IDENTITY --- */}
        {currentTab === 'identity' && (
          <BrandIdentity 
            identity={currentTenant.identity}
            onSave={handleSaveIdentity}
          />
        )}

      </main>
    </div>
  );
};

export default App;