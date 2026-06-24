
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Navigation, ArrowRight } from 'lucide-react';
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
      <Link to={`/locations/${location.id}`} className="block h-64 overflow-hidden relative shrink-0">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white pr-4">{location.name}</h3>
      </Link>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0"><MapPin size={20} /></div>
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
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0"><Phone size={20} /></div>
              <div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Phone</p>
                <p className="text-gray-800 font-medium">{location.phone}</p>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0"><Mail size={20} /></div>
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

  const heroBg = hero?.image || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1920';

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumbs />
      
      {/* ─── Premium Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-secondary border-b-4 border-accent">
        {/* BG image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Locations Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0b1e36]/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1e36] via-[#0b1e36]/90 to-transparent opacity-95" />
        </div>

        {/* Content — in normal flow so section auto-expands to fit */}
        <div className="relative z-10 pt-[120px] pb-14">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              {/* Accent badges */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider border border-accent/30 backdrop-blur-sm">
                  📍 {LOCATIONS.length} Campuses
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Modern Facilities
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-sm">
                  Centrally Located
                </span>
              </div>
              <h1 className="font-heading font-bold text-white mb-4 drop-shadow-lg animate-fade-in" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: '55px' }}>
                {hero?.heading ? (
                  hero.heading.toLowerCase().includes('locations') ? (
                    <>
                      {hero.heading.substring(0, hero.heading.toLowerCase().indexOf('locations'))}
                      <span className="text-accent">Locations</span>
                    </>
                  ) : hero.heading.toLowerCase().includes('campuses') ? (
                    <>
                      {hero.heading.substring(0, hero.heading.toLowerCase().indexOf('campuses'))}
                      <span className="text-accent">Campuses</span>
                    </>
                  ) : (
                    hero.heading
                  )
                ) : (
                  <>Our Training <span className="text-accent">Locations</span></>
                )}
              </h1>
              <div className="w-24 h-1.5 bg-accent mb-5 rounded-full shadow-sm" />
              <p className="text-gray-200 font-medium max-w-2xl leading-relaxed text-base md:text-lg">
                {hero?.description || 'Modern training facilities located centrally for your convenience. Find the campus closest to you.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────── */}

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
              id="locations-search"
              name="locationSearch"
              autocomplete="off"
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
