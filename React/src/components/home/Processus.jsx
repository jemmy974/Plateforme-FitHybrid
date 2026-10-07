

import React from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaDownload, FaChartLine } from 'react-icons/fa';

function Processus() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const etapes = [
    {
      icon: FaDumbbell,
      title: "Définissez votre objectif",
      desc: "Choisissez entre prise de masse, perte de poids ou condition physique générale",
      color: "from-amber-500/20 to-transparent"
    },
    {
      icon: FaDownload,
      title: "Recevez votre programme",
      desc: "Un plan d'entraînement sur mesure adapté à votre niveau et vos disponibilités",
      color: "from-blue-500/20 to-transparent"
    },
    {
      icon: FaChartLine,
      title: "Suivez votre progression",
      desc: "Mesurez chaque victoire avec nos outils de suivi intégrés et analyses détaillées",
      color: "from-emerald-500/20 to-transparent"
    }
  ];

  return (
    <section className='mt-50 w-full overflow-hidden'>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className='flex flex-col justify-center items-center text-center px-4'
      >
        <motion.p variants={fadeInUp} className="uppercase text-amber-500 font-semibold tracking-wider">
          Processus
        </motion.p>
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white max-w-2xl tracking-wider italic">
          Trois étapes pour atteindre vos objectifs
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-gray-400 max-w-2xl mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga doloribus quae iure laudantium.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className='flex flex-col md:flex-row p-10 lg:p-20 gap-8'
      >
        {etapes.map((etape, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -10, borderColor: '#D4AF37' }}
            transition={{ duration: 0.3 }}
            className={`flex flex-col justify-center items-center bg-gradient-to-b ${etape.color} bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-amber-500 transition-all duration-300 flex-1`}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <etape.icon className='text-amber-500 text-3xl' />
            </motion.div>
            
            <h3 className='text-white font-bold text-xl text-center mt-2'>
              {etape.title}
            </h3>
            <p className='text-gray-400 text-center mt-3 max-w-xs'>
              {etape.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className='flex justify-center gap-4 flex-wrap'
      >
        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='joindre px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300'
        >
          Explorez
        </motion.button>
        
        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='essai px-8 py-3 border-2 border-amber-500/50 text-amber-400 font-bold rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300'
        >
          En savoir plus...
        </motion.button>
      </motion.div>
    </section>
  );
}

export default Processus;