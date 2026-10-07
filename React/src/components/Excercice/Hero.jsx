import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight, FaStar, FaUsers, FaDumbbell } from 'react-icons/fa';

function Hero() {
    const videoRef = useRef(null);

    useEffect(() => {
        // Assurer que la vidéo se joue
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.log('Auto-play bloqué:', err));
        }
    }, []);

    return (
        <section className="relative w-full h-screen overflow-hidden">
            
            {/* ===== VIDEO BACKGROUND ===== */}
            <video
                ref={videoRef}
                src="/video/Accueil - Fitness-coach.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            />
            
            {/* ===== OVERLAY ===== */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40 z-10"></div>
            
            {/* ===== EFFET DE GLOW ===== */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl z-0"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl z-0"></div>

            {/* ===== CONTENU ===== */}
            <div className="relative z-20 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="max-w-2xl">
                        
                        {/* ===== BADGE ===== */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full mb-6"
                        >
                            <FaStar className="text-yellow-400" />
                            <span className="text-orange-400 text-sm font-medium">🔥 Programme certifié</span>
                        </motion.div>

                        {/* ===== TITRE ===== */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                        >
                            <span className="text-white">Build your</span>
                            <br />
                            <span className="bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 bg-clip-text text-transparent animate-pulse">
                                Strength
                            </span>
                        </motion.h1>

                        {/* ===== DESCRIPTION ===== */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-gray-300 text-lg md:text-xl mt-6 max-w-lg leading-relaxed"
                        >
                            Des programmes d'entraînement personnalisés pour atteindre vos objectifs, 
                            quel que soit votre niveau.
                        </motion.p>

                        {/* ===== STATS ===== */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex items-center gap-6 mt-6"
                        >
                            
                            <div className="flex items-center gap-2">
                                <FaDumbbell className="text-orange-400" />
                                <span className="text-white font-semibold">50+</span>
                                <span className="text-gray-400 text-sm">programmes</span>
                            </div>
                            <div className="w-1 h-4 bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                <span className="text-white font-semibold">4.9</span>
                                <span className="text-gray-400 text-sm">/5</span>
                            </div>
                        </motion.div>

                        {/* ===== BOUTONS ===== */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="flex flex-wrap items-center gap-4 mt-8"
                        >
                            <motion.a
                                href="/programmes"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-full overflow-hidden shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
                            >
                                <span className="relative z-10">Explorez les exercices</span>
                                <FaPlay className="relative z-10 text-sm group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </motion.a>

                            
                        </motion.div>

                        {/* ===== SCROLL INDICATOR ===== */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-gray-400 text-xs uppercase tracking-widest">Scroll</span>
                                <div className="w-0.5 h-8 bg-gradient-to-b from-orange-400 to-transparent animate-bounce"></div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* ===== BOUTON PLAY EN OVERLAY ===== */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-8 right-8 z-30 w-14 h-14 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full flex items-center justify-center text-white hover:bg-orange-500/40 transition-colors group"
            >
                <FaPlay className="text-orange-400 group-hover:text-white transition-colors ml-1" />
            </motion.button>

        </section>
    );
}

export default Hero;