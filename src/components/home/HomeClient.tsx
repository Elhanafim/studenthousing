"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, MapPin, Building, Shield, Star, Menu, X, ArrowRight, UserCheck, Heart, MessageSquare, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const cities = ["Casablanca", "Rabat", "Marrakech", "Tangier", "Agadir", "Fes"];

interface Listing {
  id: string;
  title: string;
  city: string;
  neighborhood?: string | null;
  price: number;
  rating?: number | null;
  images: { url: string }[];
  type: string;
  amenities?: string[];
}

export default function HomeClient({ listings }: { listings: any[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-lg">
                <Building className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">StudentHome.ma</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/search" className="text-sm font-medium hover:text-accent transition-colors">Browse housing</Link>
              <Link href="/dashboard/listings/create" className="text-sm font-medium hover:text-accent transition-colors">Post an offer</Link>
              <Link href="/auth/signup" className="text-sm font-medium hover:text-accent transition-colors">Sign up</Link>
              <Link href="/auth/signin" className="premium-gradient text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg hover:shadow-accent/20 transition-all">
                Sign In
              </Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071"
            alt="Premium Student Housing Morocco"
            fill
            className="object-cover brightness-[0.7] scale-105"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold mb-8"
          >
            <UserCheck className="w-4 h-4 text-accent" /> TRUSTED BY 10,000+ MOROCCAN STUDENTS
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter"
          >
            Safe. Modern. <span className="text-accent">Accessible.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            The premium platform dedicated to connecting students with verified housing across major Moroccan university hubs.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-2 rounded-2xl md:rounded-full max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row gap-2 border border-white/40"
          >
            <div className="flex-1 flex items-center px-6 gap-3 border-b md:border-b-0 md:border-r border-gray-100 py-3">
              <MapPin className="text-accent w-5 h-5" />
              <select className="bg-transparent border-none focus:outline-none w-full text-sm font-bold">
                <option value="">Select City</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div className="flex-1 flex items-center px-6 gap-3 py-3">
              <Building className="text-accent w-5 h-5" />
              <input 
                type="text" 
                placeholder="Near University (e.g. UM6P, UIK)" 
                className="bg-transparent border-none focus:outline-none w-full text-sm font-bold"
              />
            </div>
            <button className="clay-gradient text-white px-12 py-4 rounded-xl md:rounded-full font-black flex items-center justify-center gap-2 hover:shadow-xl transition-all">
              <Search className="w-5 h-5" />
              <span>SEARCH STAYS</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Residences */}
      <section className="py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">Handpicked Stays</h2>
              <p className="text-gray-500 font-light">Verified quality and safety in top student neighborhoods.</p>
            </div>
            <Link href="/search" className="text-accent font-bold flex items-center gap-2 group transition-all">
              EXPLORE ALL <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {listings.map((res) => (
              <Link key={res.id} href={`/listings/${res.id}`} className="bg-white rounded-[2.5rem] overflow-hidden group shadow-sm hover:shadow-2xl transition-all border border-gray-100">
                <div className="relative h-72 overflow-hidden">
                  <Image 
                    src={res.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"} 
                    alt={res.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 text-primary border border-white/40">
                    <Star className="w-3 h-3 text-accent fill-accent" /> {res.rating || 4.5}
                  </div>
                  <div className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-primary hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black mb-1 truncate max-w-[200px]">{res.title}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                        <MapPin className="w-3 h-3" /> {res.neighborhood || "Neighborhood"}, {res.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-accent font-black text-xl">{res.price} MAD</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Monthly</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-10">
                    {res.amenities?.slice(0, 3).map((f: string) => (
                      <span key={f} className="text-[10px] bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full uppercase tracking-widest font-black">{f}</span>
                    ))}
                    {!res.amenities?.length && <span className="text-[10px] bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full uppercase tracking-widest font-black">{res.type}</span>}
                  </div>
                  <div className="w-full py-5 rounded-2xl border-2 border-primary text-primary font-black group-hover:bg-primary group-hover:text-white transition-all text-center uppercase tracking-widest">
                    VIEW DETAILS
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="py-24 px-4">
         <div className="max-w-7xl mx-auto clay-gradient rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 text-center md:text-left">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-8">
                  <Shield className="text-white w-10 h-10" />
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">Your safety is our <br/> #1 priority.</h2>
               <p className="text-white/70 text-lg font-light max-w-sm mb-12">Verified hosts, secured communications, and curated listings for a worry-free student life in Morocco.</p>
               <Link href="/auth/signup" className="px-12 py-5 bg-white text-accent font-bold rounded-2xl hover:scale-105 transition-all inline-block shadow-xl">
                  JOIN THE COMMUNITY
               </Link>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4">
               {[
                 { title: "VERIFIED HOSTS", icon: <UserCheck /> },
                 { title: "SECURE CHAT", icon: <MessageSquare /> },
                 { title: "PARENT PORTAL", icon: <Users /> },
                 { title: "EASY BOOKING", icon: <Star /> }
               ].map(item => (
                 <div key={item.title} className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20 text-white flex flex-col items-center">
                    <div className="mb-4">{item.icon}</div>
                    <div className="text-xs font-black tracking-widest">{item.title}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-32">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-xl">
                <Building className="text-white w-7 h-7" />
              </div>
              <span className="text-2xl font-black tracking-tighter">StudentHome.ma</span>
            </div>
            <p className="text-gray-400 max-w-md mb-12 font-light text-lg leading-relaxed">
              Transforming the student housing experience in Morocco. We provide the highest standards of safety, trust, and luxury for the next generation of Moroccan leaders.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-10 text-sm tracking-widest uppercase text-accent">Navigation</h4>
            <ul className="space-y-6 text-gray-400 text-sm font-medium">
              <li><Link href="/search" className="hover:text-accent transition-colors">Browse stays</Link></li>
              <li><Link href="/dashboard/listings/create" className="hover:text-accent transition-colors">Post an offer</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">How it works</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Student perks</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-sm tracking-widest uppercase text-accent">Contact</h4>
            <ul className="space-y-6 text-gray-400 text-sm font-medium">
              <li>Residence 5, Cité de l'Air</li>
              <li>Casablanca, Morocco</li>
              <li>support@studenthome.ma</li>
              <li>+212 522 00 00 00</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-20 mt-20 border-t border-white/5 text-center text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">
          © 2026 StudentHome.ma • Designed for Excellence in Morocco
        </div>
      </footer>
    </main>
  );
}
