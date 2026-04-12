"use client";

import Image from "next/image";
import { 
  MapPin, Star, Shield, Building, Info, MessageSquare, 
  Heart, Share2, Check, ArrowLeft, Users, Wifi, Coffee
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ListingDetailClientProps {
  listing: any;
}

export default function ListingDetailClient({ listing }: ListingDetailClientProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Photo Gallery Top */}
      <div className="h-[60vh] relative grid grid-cols-4 gap-2 px-4 py-8 max-w-7xl mx-auto">
        <div className="col-span-2 row-span-2 relative rounded-[2rem] overflow-hidden group">
          <Image 
            src={listing.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"} 
            alt="Listing" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
        <div className="relative rounded-[2rem] overflow-hidden group">
          <Image src={listing.images[1]?.url || "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"} alt="Detail" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="relative rounded-[2rem] overflow-hidden group">
          <Image src={listing.images[2]?.url || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"} alt="Detail" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="relative rounded-[2rem] overflow-hidden group">
           <Image src={listing.images[3]?.url || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"} alt="Detail" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="relative rounded-[2rem] overflow-hidden group">
           <Image src={listing.images[4]?.url || "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800"} alt="Detail" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
           <div>
              <div className="flex items-center gap-2 mb-4">
                 <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{listing.type}</span>
                 <div className="flex items-center gap-1 text-sm font-bold ml-auto">
                    <Star className="w-4 h-4 fill-accent text-accent" /> {listing.rating || 4.9} ({listing.reviews?.length || 0} reviews)
                 </div>
              </div>
              <h1 className="text-5xl font-black text-primary mb-4 leading-tight">{listing.title}</h1>
              <div className="flex items-center gap-2 text-gray-400">
                 <MapPin className="w-5 h-5" /> 
                 <p className="font-light text-lg">{listing.neighborhood}, {listing.city}</p>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><Users className="w-5 h-5 text-gray-400" /></div>
                 <div className="text-sm font-bold">1 Tenant</div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><Wifi className="w-5 h-5 text-gray-400" /></div>
                 <div className="text-sm font-bold">Fiber Web</div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><Building className="w-5 h-5 text-gray-400" /></div>
                 <div className="text-sm font-bold">Elevator</div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-gray-400" /></div>
                 <div className="text-sm font-bold">Safe Zone</div>
              </div>
           </div>

           <div>
              <h3 className="text-2xl font-bold mb-6">Description</h3>
              <p className="text-gray-500 font-light leading-relaxed text-lg">{listing.description || "No description provided."}</p>
           </div>

           {listing.safetyFeatures?.length > 0 && (
             <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="text-accent" /> Trust & Safety Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {listing.safetyFeatures.map((sf: string) => (
                     <div key={sf} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50/50">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">{sf}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {listing.houseRules?.length > 0 && (
             <div>
                <h3 className="text-2xl font-bold mb-6">House Rules</h3>
                <div className="flex flex-wrap gap-3">
                   {listing.houseRules.map((rule: string) => (
                     <span key={rule} className="px-6 py-2 bg-primary/5 rounded-full text-sm font-bold text-primary">{rule}</span>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Sidebar Sticky */}
        <div className="relative">
           <div className="sticky top-28 space-y-8">
              {/* Booking Card */}
              <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-white/40">
                 <div className="flex justify-between items-end mb-8">
                    <div>
                       <div className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Monthly Rent</div>
                       <div className="text-4xl font-black text-primary">{listing.price} MAD</div>
                    </div>
                 </div>
                 <div className="space-y-4 mb-8">
                    <button className="w-full py-5 rounded-2xl clay-gradient text-white font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all">
                       Apply Now <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                    <button className="w-full py-5 rounded-2xl border-2 border-primary text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                       <MessageSquare className="w-5 h-5" /> Contact Host
                    </button>
                 </div>
                 <div className="text-center text-xs text-gray-400 font-light">
                    No payment required until the contract is signed.
                 </div>
              </div>

              {/* Host Snippet */}
              {listing.host && (
                <div className="p-8 rounded-[2.5rem] bg-gray-50/50 border border-gray-100">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-black text-xl">
                        {listing.host.name?.charAt(0)}
                      </div>
                      <div>
                         <div className="font-bold text-lg flex items-center gap-1">{listing.host.name} <Shield className="w-4 h-4 text-accent fill-accent" /></div>
                         <div className="text-sm text-gray-400">{listing.host.role}</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                         <div className="text-lg font-black">Verified</div>
                         <div className="text-[10px] text-gray-400 uppercase tracking-widest">Identity</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                         <div className="text-lg font-black">{listing.host.phone ? "Yes" : "No"}</div>
                         <div className="text-[10px] text-gray-400 uppercase tracking-widest">Phone</div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
