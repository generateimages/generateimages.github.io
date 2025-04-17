import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Wand2, Sparkles, Loader2 } from 'lucide-react';
import $ from 'jquery';

const images = [
  '/sage facing tv.webp',
  '/jett facing tv.webp',
  '/reyna facing tv.webp',
  '/fade facing tv.webp',
  '/killjoy facing tv.webp'
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOffers, setShowOffers] = useState(false);
  const [offers, setOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    pauseOnHover: false,
    dotsClass: "slick-dots !bottom-[-3rem]",
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
      const images = document.querySelectorAll('.slick-slide img');
      images.forEach(img => {
        (img as HTMLElement).style.transform = 'scale(1.05) translateY(-2%)';
        (img as HTMLElement).style.filter = 'brightness(0.8)';
      });
    },
    afterChange: () => {
      const images = document.querySelectorAll('.slick-slide img');
      images.forEach(img => {
        (img as HTMLElement).style.transform = 'scale(1) translateY(0)';
        (img as HTMLElement).style.filter = 'brightness(1)';
      });
    }
  };

  useEffect(() => {
    // Load CPA offers
    $.getJSON(
      "https://d30xmmta1avvoi.cloudfront.net/public/offers/feed.php?user_id=538458&api_key=16388e91cdf3368db3bfd08d2dfe4ff0&s1=&s2=&callback=?",
      function(data) {
        setOffers(data.splice(0, 3)); // Only show 3 offers
      }
    );

    // Check for completed offers
    const checkLeads = () => {
      $.getJSON(
        "https://d30xmmta1avvoi.cloudfront.net/public/external/check2.php?testing=0&callback=?",
        function(leads) {
          if (leads.length > 0) {
            setShowOffers(false);
          }
        }
      );
    };

    setInterval(checkLeads, 15000);
  }, []);

  const handleGenerate = () => {
    if (!prompt) return;
    
    setGenerating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setShowOffers(true);
          return 100;
        }
        return prev + 1;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            AI Image Generator
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Transform your imagination into stunning visuals
          </p>
        </div>
        
        <div className="relative mb-20 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 bg-gray-800/50 p-4">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80 pointer-events-none z-10"></div>
          <div className="absolute bottom-4 left-4 z-20 bg-gray-900/60 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium">
            Example {currentSlide + 1} of {images.length}
          </div>
          <Slider {...sliderSettings}>
            {images.map((img, index) => (
              <div key={index} className="relative aspect-w-16 aspect-h-9 px-2 group">
                <img 
                  src={img} 
                  alt={`Example ${index + 1}`}
                  className="w-full h-[600px] object-cover rounded-lg shadow-xl transition-all duration-700 ease-in-out"
                  style={{ 
                    objectFit: 'cover',
                    transformOrigin: 'center center'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative flex gap-4">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 placeholder-gray-400"
                disabled={generating}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all duration-300 font-medium shadow-lg shadow-blue-500/20"
            >
              {generating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Wand2 size={20} />
              )}
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {generating && (
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                style={{ 
                  width: `${progress}%`,
                  transition: 'width 0.2s ease-in-out'
                }}
              />
            </div>
            <p className="text-center mt-4 text-gray-400">Creating your masterpiece... {progress}%</p>
          </div>
        )}

        {showOffers && (
          <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Unlock Your Creation
              </h2>
              <p className="text-gray-400">Complete one of these quick offers to reveal your generated image</p>
            </div>
            <div className="grid gap-4">
              {offers.map((offer: any, index: number) => (
                <a
                  key={index}
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50 group"
                >
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {offer.anchor}
                  </h3>
                  <p className="text-gray-400 text-sm">{offer.conversion}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;