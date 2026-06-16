
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Navigation, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { LOCATIONS } from '../constants';
import { Button } from '../components/Button';
import { findNearbyPlaces } from '../services/geminiService';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getPageContent } from '../services/storageService';
import { SitePage, Location } from '../types';
import { Link } from 'react-router-dom';

const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="h-64 overflow-hidden relative shrink-0">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white pr-4">{location.name}</h3>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl text-primary shrink-0"><MapPin size={20} /></div>
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Address</p>
                <p className="text-gray-800 font-medium leading-relaxed">{location.address}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-yellow-600 text-sm font-bold mt-1 inline-flex items-center gap-1 transition-colors">
                    View on Google Maps <ArrowRight size={14}/>
                </a>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl text-primary shrink-0"><Phone size={20} /></div>
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Phone</p>
                <p className="text-gray-800 font-medium">{location.phone}</p>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl text-primary shrink-0"><Mail size={20} /></div>
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-gray-800 font-medium break-all">{location.email}</p>
              </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 mt-auto">
            <Link to={`/locations/${location.id}`}>
                <button 
                    className="w-full py-3.5 px-6 bg-gray-50 hover:bg-gray-100 text-secondary font-bold rounded-xl transition-all flex items-center justify-between group/btn"
                >
                    <span className="text-sm">View Campus Details</span>
                    <div className="bg-white p-1 rounded-full shadow-sm text-gray-400 group-hover/btn:text-primary transition-colors">
                        <ArrowRight size={16} />
                    </div>
                </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export const Locations: React.FC = () => {
  const [placeQuery, setPlaceQuery] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContent, setPageContent] = useState<SitePage | null>(null);

  useEffect(() => {
    // Load dynamic content
    const content = getPageContent('locations');
    if (content) setPageContent(content);
  }, []);

  const handleFindPlaces = async () => {
    if (!placeQuery) return;
    setIsLoading(true);
    const result = await findNearbyPlaces(placeQuery);
    setPlaces(result.maps.length > 0 ? result.maps : []);
    setIsLoading(false);
  };

  const hero = pageContent?.sections.find(s => s.id === 'hero')?.data;
  const aiSection = pageContent?.sections.find(s => s.id === 'ai_section')?.data;

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumbs />
      
      {/* Hero / Header Section */}
      <div className="bg-secondary text-white relative overflow-hidden py-20">
        
        {/* Background Image */}
        {hero?.image && (
            <div className="absolute inset-0 opacity-60">
                 <img src={hero.image} alt="Locations Background" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-secondary/40 mix-blend-multiply"></div>
            </div>
        )}

        <div className="container mx-auto px-4 md:px-8 relative z-10">
             <div className="max-w-3xl">
                  <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
                     {hero?.heading || "Our Campuses"}
                  </h1>
                  <p className="text-gray-300 text-lg">
                     {hero?.description || "Modern training facilities located centrally for your convenience."}
                  </p>
             </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {LOCATIONS.map(location => (
            <div key={location.id} id={location.id} className="scroll-mt-32">
                <LocationCard location={location} />
            </div>
          ))}
        </div>

        {/* AI Maps Integration Section */}
        <div className="mt-24 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
              <Navigation className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">{aiSection?.heading || "Explore the Area"}</h2>
            <p className="text-gray-600">
              {aiSection?.description || "Moving to study? Use our AI assistant to find amenities like libraries, cafes, or public transport near our campuses."}
            </p>
          </div>

          <div className="max-w-xl mx-auto flex gap-2 mb-8">
            <input 
              type="text" 
              value={placeQuery}
              onChange={(e) => setPlaceQuery(e.target.value)}
              placeholder="e.g., 'Cheap cafes near Lonsdale St campus'"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button onClick={handleFindPlaces} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Find'}
            </Button>
          </div>

          {places.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up">
              {places.map((place, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                   {/* Handle map result grounding structure */}
                   {place.maps?.title ? (
                     <>
                        <h4 className="font-bold text-secondary mb-1 flex items-start justify-between">
                            {place.maps.title}
                            {place.maps.rating && <span className="text-xs bg-accent/20 px-2 py-0.5 rounded text-secondary">{place.maps.rating} ★</span>}
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">{place.maps.address}</p>
                        {place.maps.uri && (
                            <a href={place.maps.uri} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                                View on Maps <ArrowRight size={12} />
                            </a>
                        )}
                     </>
                   ) : (
                     <div className="text-sm text-gray-500">Location found (See map for details)</div>
                   )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
