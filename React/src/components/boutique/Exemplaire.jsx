import React, { useState } from 'react'
import {
    ShoppingBag,
    Star,
    MapPin,
    CheckCircle,
    Bolt,
    Flame,
    Sparkles,
    TrendingUp,
    Dumbbell,
    Shield,
    Filter,
    X, Eye
} from 'lucide-react';

const Exemplaire = () => {
    const [activeFilter, setActiveFilter] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            <div className="min-h-screen bg-[#0A0A0F]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Équipement & Nutrition <br className="hidden sm:block"/>Premium
            </h1>
            <p className="text-[#9B9BB0] text-sm mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
              Coaching inclus · Livraison express Madagascar
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'equipment', label: 'Machines' },
              { id: 'accessories', label: 'Accessoires' },
              { id: 'nutrition', label: 'Nutrition' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id   
                 ? 'bg-orange-500 text-black'
                  : 'bg-[#12121A] text-gray-400 border border-orange-500/20 hover:text-white hover:border-orange-500/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Hot Deals</h2>
                                <p className="text-gray-400 text-sm mt-1">Limited-time promotions and discounted products you don't want to miss.</p>
                            </div>
                            <button className="text-[#D4AF37] text-sm hover:underline">View all →</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ">
                            {/* Carte 1 */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition hover:border-[#D4AF37]/40 hover:-translate-y-2 transition-all duration-300">
                                <div className="h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                        <span className="text-4xl">👟</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">Air Jordan 12 Retro</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Nickyyy</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="ml-0.5">4.5</span>
                                                    <span className="text-gray-500 ml-0.5">(4)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                <span>Analamanga</span>
                                            </div>
                                        </div>
                                        <span className="text-[#D4AF37] font-bold">250.000 Ar</span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="w-5 h-5 rounded-full bg-green-600 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-yellow-500 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-orange-500 border border-white/20"></div>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            {/* Carte 2 - Washington Black Book */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                        <span className="text-4xl">📚</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">Washington Black Book</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Nickyyy</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="ml-0.5">4.5</span>
                                                    <span className="text-gray-500 ml-0.5">(4)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                <span>Analamanga</span>
                                            </div>
                                        </div>
                                        <span className="text-[#D4AF37] font-bold">140.000 Ar</span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="w-5 h-5 rounded-full bg-green-600 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-yellow-500 border border-white/20"></div>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            {/* Carte 3 - Protection de chaleur */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                        <span className="text-4xl">🔥</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">Protection de chaleur</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Jess</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="ml-0.5">5.0</span>
                                                    <span className="text-gray-500 ml-0.5">(3)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                <span>Analamanga</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[#D4AF37] font-bold">40.000 Ar</span>
                                            <div className="text-xs text-gray-500">6 in stock</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="w-5 h-5 rounded-full bg-green-600 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-yellow-500 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-orange-500 border border-white/20"></div>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            {/* Carte 4 - Variants */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-48 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                        <span className="text-4xl">🎨</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-white">2 Variants</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Seller</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span className="ml-0.5">4.8</span>
                                                    <span className="text-gray-500 ml-0.5">(12)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                <span>Analamanga</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[#D4AF37] font-bold">From 40.000 Ar</span>
                                            <div className="text-xs text-gray-500">6 in stock</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="w-5 h-5 rounded-full bg-green-600 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-yellow-500 border border-white/20"></div>
                                        <div className="w-5 h-5 rounded-full bg-orange-500 border border-white/20"></div>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== NEW ARRIVALS ==================== */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-white">New Arrivals</h2>
                                <p className="text-gray-400 text-sm mt-1">Fresh listings just added by sellers across Madagascar.</p>
                            </div>
                            <button className="text-[#D4AF37] text-sm hover:underline">View all →</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                    <div className="h-40 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                            <span className="text-3xl">👟</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-white text-sm">Kobe 6 Grinch</h3>
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                    <span>@Nickyyy</span>
                                                    <div className="flex items-center">
                                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                        <span>4.5</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>Analamanga</span>
                                                </div>
                                            </div>
                                            <span className="text-[#D4AF37] font-bold text-sm">250.000 Ar</span>
                                        </div>
                                        <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-1.5 text-[#D4AF37] text-xs font-medium hover:bg-orange-500 hover:text-black transition">
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ==================== MOST POPULAR ==================== */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Most Popular</h2>
                                <p className="text-gray-400 text-sm mt-1">Items attracting the most attention from buyers right now.</p>
                            </div>
                            <button className="text-[#D4AF37] text-sm hover:underline">View all →</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Versace Bags */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <span className="text-5xl">👜</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-white">Versace Bags</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Nickyyy</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#D4AF37] font-bold">450.000 Ar</span>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            {/* Chargeur Magnétique */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <span className="text-5xl">⚡</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-white">Chargeur Magnétique</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Nickyyy</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#D4AF37] font-bold">50.000 Ar</span>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            {/* JBL PartyBox 110 */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <span className="text-5xl">🔊</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-white">JBL PartyBox 110</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Nickyyy</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#D4AF37] font-bold">2.000.000 Ar</span>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>

                            {/* Samsung Z */}
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex items-center justify-center">
                                    <span className="text-5xl">📱</span>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-white">Samsung Z</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <span>@Nickyyy</span>
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                    <span>4.5</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[#D4AF37] font-bold">1.400.000 Ar</span>
                                    </div>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== RECOMMENDED FOR YOU ==================== */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
                                <p className="text-gray-400 text-sm mt-1">Handpicked picks based on what people love browsing.</p>
                            </div>
                            <button className="text-[#D4AF37] text-sm hover:underline">View all →</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex flex-col items-center justify-center gap-2">
                                    <span className="text-5xl">👟</span>
                                    <span className="text-[#D4AF37] font-bold text-lg">SHOES</span>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-gray-400 text-sm">Collection running & training</p>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Shop now
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex flex-col items-center justify-center gap-2">
                                    <span className="text-5xl">🪑</span>
                                    <span className="text-[#D4AF37] font-bold text-lg">FURNITURE</span>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-gray-400 text-sm">Home gym essentials</p>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Shop now
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex flex-col items-center justify-center gap-2">
                                    <span className="text-5xl">💪</span>
                                    <span className="text-[#D4AF37] font-bold text-lg">ACCESSORIES</span>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-gray-400 text-sm">Bands, gloves & more</p>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Shop now
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#12121A] rounded-xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/40 transition">
                                <div className="h-44 bg-gradient-to-br from-[#1A1A24] to-[#0F0F15] flex flex-col items-center justify-center gap-2">
                                    <span className="text-5xl">🥤</span>
                                    <span className="text-[#D4AF37] font-bold text-lg">NUTRITION</span>
                                </div>
                                <div className="p-4 text-center">
                                    <p className="text-gray-400 text-sm">Whey, creatine & vitamins</p>
                                    <button className="w-full mt-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg py-2 text-[#D4AF37] text-sm font-medium  hover:bg-orange-500 hover:text-black transition">
                                        Shop now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Exemplaire