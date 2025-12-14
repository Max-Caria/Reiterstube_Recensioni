import React, { useState, useRef } from 'react';
import { PhotoStyle, Tenant } from '../types';
import { enhanceRestaurantPhoto } from '../services/geminiService';
import { Image as ImageIcon, Upload, Sparkles, Download, ArrowRight, Sun, Moon, Zap, Coffee, Camera } from 'lucide-react';

interface PhotoStudioProps {
  tenant: Tenant;
  onConsumeCredit: () => boolean;
}

export const PhotoStudio: React.FC<PhotoStudioProps> = ({ tenant, onConsumeCredit }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>('natural');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        alert("L'immagine è troppo grande (Max 5MB).");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        setMimeType(file.type);
        setEnhancedImage(null); // Reset previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!selectedImage) return;
    
    if (!onConsumeCredit()) {
      alert("Crediti esauriti per questo mese.");
      return;
    }

    setIsProcessing(true);
    try {
      // Extract raw base64 without the data:image/xxx;base64, prefix
      const rawBase64 = selectedImage.split(',')[1];
      
      const resultBase64 = await enhanceRestaurantPhoto(rawBase64, mimeType, selectedStyle);
      setEnhancedImage(`data:image/png;base64,${resultBase64}`);
    } catch (e) {
      console.error(e);
      alert("Errore durante il miglioramento della foto. Riprova.");
    } finally {
      setIsProcessing(false);
    }
  };

  const styles: { id: PhotoStyle; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'natural', label: 'Naturale', icon: <Camera size={16}/>, desc: 'Bilanciamento perfetto, colori reali.' },
    { id: 'bright', label: 'Luminoso', icon: <Sun size={16}/>, desc: 'Ottimo per colazioni e ambienti chiari.' },
    { id: 'warm', label: 'Caldo', icon: <Coffee size={16}/>, desc: 'Atmosfera accogliente e casalinga.' },
    { id: 'dramatic', label: 'Gourmet', icon: <Moon size={16}/>, desc: 'Sfondo scuro, contrasto alto, elegante.' },
    { id: 'hdr', label: 'Dettagliato', icon: <Zap size={16}/>, desc: 'Massima nitidezza su ogni ingrediente.' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-12">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-purple-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 bg-white/5 w-64 h-64 rounded-full -ml-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
               <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-400/30">
                 <Sparkles className="text-purple-300" size={24} />
               </div>
               <h2 className="text-2xl font-bold">Photo Studio AI</h2>
            </div>
            <p className="text-purple-100 max-w-lg leading-relaxed text-sm">
              Trasforma le foto fatte col cellulare in scatti professionali. 
              Migliora la luce, i colori e rendi i piatti irresistibili per Google Maps.
            </p>
          </div>
          {/* Credit info */}
          <div className="bg-white/10 px-4 py-2 rounded-full text-xs font-semibold border border-white/20">
             Costo: 1 Credito / Foto
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls & Original */}
        <div className="md:col-span-5 space-y-6">
           
           {/* Upload Area */}
           <div 
             className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
               selectedImage ? 'border-purple-200 bg-purple-50' : 'border-slate-300 hover:border-purple-400 hover:bg-slate-50'
             }`}
             onClick={() => fileInputRef.current?.click()}
           >
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               accept="image/*" 
               className="hidden" 
             />
             
             {selectedImage ? (
                <div className="relative group">
                   <img src={selectedImage} alt="Original" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <span className="flex items-center text-sm font-bold"><Upload size={16} className="mr-2"/> Cambia Foto</span>
                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center text-slate-500">
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-purple-600">
                      <ImageIcon size={24} />
                   </div>
                   <p className="font-medium text-slate-700">Carica una foto del piatto</p>
                   <p className="text-xs text-slate-400 mt-1">JPEG o PNG, Max 5MB</p>
                </div>
             )}
           </div>

           {/* Style Selector */}
           {selectedImage && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
               <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Scegli lo Stile</h3>
               <div className="space-y-2">
                 {styles.map(style => (
                   <div 
                     key={style.id}
                     onClick={() => setSelectedStyle(style.id)}
                     className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${
                       selectedStyle === style.id 
                         ? 'bg-purple-50 border-purple-500 shadow-sm' 
                         : 'bg-white border-transparent hover:bg-slate-50'
                     }`}
                   >
                      <div className={`p-2 rounded-full mr-3 ${selectedStyle === style.id ? 'bg-purple-200 text-purple-800' : 'bg-slate-100 text-slate-500'}`}>
                         {style.icon}
                      </div>
                      <div className="flex-1">
                         <div className={`font-bold text-sm ${selectedStyle === style.id ? 'text-purple-900' : 'text-slate-700'}`}>{style.label}</div>
                         <div className="text-xs text-slate-400">{style.desc}</div>
                      </div>
                      {selectedStyle === style.id && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                   </div>
                 ))}
               </div>
               
               <button 
                 onClick={handleEnhance}
                 disabled={isProcessing}
                 className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
               >
                 {isProcessing ? (
                   <span className="flex items-center"><Sparkles className="animate-spin mr-2"/> Sviluppo in corso...</span>
                 ) : (
                   <span className="flex items-center">Migliora Foto <ArrowRight className="ml-2" /></span>
                 )}
               </button>
             </div>
           )}
        </div>

        {/* RIGHT COLUMN: Result */}
        <div className="md:col-span-7">
           <div className="bg-slate-900 rounded-2xl h-full min-h-[500px] p-1 flex items-center justify-center relative overflow-hidden">
              {!enhancedImage && !isProcessing && (
                <div className="text-center p-8">
                   <div className="inline-block p-4 rounded-full bg-slate-800 text-slate-600 mb-4">
                      <Sparkles size={48} />
                   </div>
                   <h3 className="text-slate-400 font-medium">L'anteprima apparirà qui</h3>
                   <p className="text-slate-600 text-sm mt-2">Carica una foto e clicca su Migliora</p>
                </div>
              )}

              {isProcessing && (
                <div className="text-center z-10">
                   <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                   <h3 className="text-white font-bold text-lg animate-pulse">L'IA sta sviluppando la foto...</h3>
                   <p className="text-purple-300 text-sm mt-2">Stiamo correggendo luci, colori e nitidezza.</p>
                </div>
              )}

              {enhancedImage && !isProcessing && (
                <div className="relative w-full h-full group">
                   <img src={enhancedImage} alt="Enhanced" className="w-full h-full object-contain rounded-xl bg-black" />
                   
                   {/* Overlay Actions */}
                   <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                      <a 
                        href={enhancedImage} 
                        download={`enhanced_${selectedStyle}.png`}
                        className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center hover:bg-slate-100 transition-colors"
                      >
                         <Download size={18} className="mr-2" />
                         Scarica HD
                      </a>
                   </div>
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};