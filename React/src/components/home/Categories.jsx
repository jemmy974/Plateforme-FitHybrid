import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { FaAngleRight, FaStar, FaClock, FaDumbbell, FaFire } from 'react-icons/fa';

function Categories() {
    // Animation au scroll
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const children = sectionRef.current?.querySelectorAll('.animate-on-scroll');
        children?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const categories = [
        {
            id: 1,
            title: 'Haut du corps',
            subtitle: 'Poitrine, Dos, Épaules & Bras',
            description: 'Développez votre force et votre musculature',
            image: '/img/haut1.jpg',
            icon: '💪',
            color: 'from-orange-500/20 to-amber-500/10',
            badge: '12 exercices',
            level: '4 niveaux',
            time: '45 min',
            rating: 4.8,
            reviews: 234
        },
        {
            id: 2,
            title: 'Bas du corps',
            subtitle: 'Cuisses, Fessiers, Mollets...',
            description: 'Construisez des jambes puissantes',
            image: '/img/SquatSM.jpg',
            icon: '🦵',
            color: 'from-blue-500/20 to-cyan-500/10',
            badge: '14 exercices',
            level: '4 niveaux',
            time: '50 min',
            rating: 4.9,
            reviews: 312
        }
    ];

    return (
        <section 
            ref={sectionRef}
            className="relative py-20 overflow-hidden"
        >
            {/* Background avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#0F0F15] to-[#0A0A0F]"></div>
            
            {/* Effet de glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4">
                
                {/* ===== HEADER ===== */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-4">
                        <FaFire className="text-orange-400" />
                        <span className="text-orange-400 text-sm font-medium uppercase tracking-wider">
                            Catégories
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-100 to-amber-200 bg-clip-text text-transparent">
                        Entraînements par groupe musculaire
                    </h2>
                    <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
                        Des séances ciblées pour chaque partie du corps, adaptées à votre niveau.
                    </p>
                </motion.div>

                {/* ===== GRILLE ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            className="group relative bg-gradient-to-br from-[#12121A] to-[#0F0F15] rounded-3xl border border-white/10 overflow-hidden hover:border-orange-500/50 hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10"
                        >
                            {/* Overlay gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            
                            {/* Étoiles flottantes */}
                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-10">
                                <FaStar className="text-yellow-400" />
                                <span className="text-white font-semibold text-sm">{cat.rating}</span>
                                <span className="text-gray-400 text-xs">({cat.reviews})</span>
                            </div>

                            <div className="relative flex flex-col md:flex-row h-full">
                                
                                {/* Texte */}
                                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between relative z-10">
                                    <div>
                                        <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                            {cat.icon}
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-orange-400 text-lg font-medium mt-1">
                                            {cat.subtitle}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            {cat.description}
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-4 mt-6">
                                        <span className="flex items-center gap-2 text-gray-400 text-sm">
                                            <FaDumbbell className="text-orange-400" />
                                            {cat.badge}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span className="flex items-center gap-2 text-gray-400 text-sm">
                                            <FaClock className="text-orange-400" />
                                            {cat.time}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-xs font-medium">
                                            {cat.level}
                                        </span>
                                    </div>

                                    {/* Bouton */}
                                    <motion.a 
                                        href="/exo"
                                        className="mt-6 inline-flex items-center gap-3 text-orange-400 font-medium group-hover:text-orange-300 transition-all duration-300"
                                        whileHover={{ x: 8 }}
                                    >
                                        <span className="relative">
                                            Commencer les séances
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
                                        </span>
                                        <FaAngleRight className="text-sm group-hover:translate-x-1 transition-transform" />
                                    </motion.a>
                                </div>

                                {/* Image */}
                                <div className="md:w-1/2 h-48 md:h-auto relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-transparent z-10 md:hidden"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {/* Badge en overlay sur l'image */}
                                    <div className="absolute bottom-4 left-4 z-10 md:hidden">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium border border-white/10">
                                            {cat.badge}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ===== BOUTON VOIR PLUS ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-14"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-full overflow-hidden shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow"
                    >
                        <span className="relative z-10">Découvrir tous les programmes</span>
                        <FaAngleRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                </motion.div>

            </div>
        </section>
    );
}

export default Categories;