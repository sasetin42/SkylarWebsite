
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, ArrowLeft, Wifi, Car, Coffee, Layout, Calendar } from 'lucide-react';
import { LOCATIONS } from '../constants';
import { Button } from '../components/Button';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = LOCATIONS.find(l => l.id === id);

  if (!location) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Location not found</h2>
                <Link to="/locations">
                    <Button>Back to Locations</Button>
                </Link>
            </div>
        </div>
    );
  }

  // Facilities config
  const facilities = [
    { icon: Layout, label: "Modern Classrooms" },
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Coffee, label: "Student Lounge" },
    { icon: Car, label: "On-site Parking" },
  ];

  return (
    <div className="bg-white min-h-screen pb-20 animate-fade-in">
      <Breadcrumbs />
      
      {/* Hero */}
      <div className="relative h-[400px] lg:h-[500px]">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 md:px-8 pb-12 text-white">
           <Link to="/locations" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 transition-colors w-fit">
              <ArrowLeft size={20} /> Back to All Locations
           </Link>
           <span className="bg-accent text-secondary font-bold px-3 py-1 rounded text-xs uppercase tracking-widest w-fit mb-4 border border-yellow-500 shadow-lg">{location.state} Campus</span>
           <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 drop-shadow-lg">{location.name}</h1>
           <div className="flex flex-col md:flex-row gap-6 text-gray-200 text-sm md:text-base">
              <div className="flex items-center gap-2"><MapPin className="text-accent" size={18}/> {location.address}</div>
              <div className="flex items-center gap-2"><Phone className="text-accent" size={18}/> {location.phone}</div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
         <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
               <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-2xl font-bold text-secondary mb-4 font-heading">About the Campus</h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                     Welcome to our {location.name} facility. Designed to provide a realistic and immersive training environment, this campus features state-of-the-art equipment and learning spaces. Whether you are undertaking GWO modules or High Risk Work licensing, our facility ensures you are job-ready.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                     Our trainers at this location bring decades of local industry experience, ensuring that the skills you learn are directly applicable to sites across {location.state} and beyond.
                  </p>
               </section>

               <section>
                  <h2 className="text-2xl font-bold text-secondary mb-6 font-heading">Campus Facilities</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {facilities.map((f, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:shadow-md hover:bg-white">
                           <div className="p-3 bg-white rounded-xl text-primary shadow-sm border border-gray-100"><f.icon size={24}/></div>
                           <span className="font-bold text-gray-700 text-lg">{f.label}</span>
                        </div>
                     ))}
                  </div>
               </section>

               <section>
                  <h2 className="text-2xl font-bold text-secondary mb-6 font-heading">Upcoming Sessions at {location.state}</h2>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div>
                        <h4 className="font-bold text-primary text-xl mb-2">Ready to start training?</h4>
                        <p className="text-blue-800 font-medium">We run courses weekly at this location. Check our course calendar for specific dates.</p>
                     </div>
                     <Link to="/courses">
                        <Button className="shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">View Schedule</Button>
                     </Link>
                  </div>
               </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
               <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                  <h3 className="font-bold text-lg mb-4 text-secondary flex items-center gap-2"><MapPin size={20} className="text-primary" /> Campus Location</h3>
                  <div className="aspect-square w-full bg-gray-200 rounded-2xl overflow-hidden mb-4 relative border border-gray-200">
                     <iframe 
                       title={`${location.name} Map`}
                       width="100%" 
                       height="100%" 
                       style={{border:0}} 
                       loading="lazy" 
                       allowFullScreen 
                       src={`https://maps.google.com/maps?q=${encodeURIComponent(location.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                       className="absolute inset-0"
                     ></iframe>
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 hover:bg-primary hover:text-white text-secondary font-bold rounded-xl transition-all shadow-sm"
                  >
                     <MapPin size={18} /> Open in Google Maps
                  </a>
               </div>

               <div className="bg-secondary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                  <div className="relative z-10">
                      <h3 className="font-bold text-xl mb-6 text-white border-b border-white/10 pb-4">Contact Details</h3>
                      <ul className="space-y-5">
                         <li className="flex items-start gap-4">
                            <Phone className="text-accent mt-1" size={20} />
                            <div>
                                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Phone</span>
                                <span className="font-bold text-lg">{location.phone}</span>
                            </div>
                         </li>
                         <li className="flex items-start gap-4">
                            <Mail className="text-accent mt-1" size={20} />
                            <div>
                                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Email</span>
                                <span className="font-medium break-all text-white/90">{location.email}</span>
                            </div>
                         </li>
                         <li className="flex items-start gap-4">
                            <Clock className="text-accent mt-1" size={20} />
                            <div>
                                <span className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Hours</span>
                                <span className="font-medium text-white/90">Mon-Fri, 8:00am - 5:00pm</span>
                            </div>
                         </li>
                      </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
