
import React from 'react';
import { motion } from 'framer-motion';
import { FaClipboardList, FaPlayCircle, FaChartLine, FaShoppingCart, FaAngleRight } from 'react-icons/fa';

function Outils() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const outils = [
    {
      id: 1,
      title: "Programme d'entraînement personnalisé",
      desc: "Des plans créés par des coachs professionnels pour vos objectifs spécifiques",
      icon: FaClipboardList,
      bg: "/img/Personnalisez.jpg"
    },
    {
      id: 2,
      title: "Bibliothèque d'exercices vidéos",
      desc: "Accédez à des centaines de démonstrations avec corrections de forme",
      icon: FaPlayCircle,
      bg: "/img/VideoPer.jpg"
    },
    {
      id: 3,
      title: "Suivi de la progression",
      desc: "Enregistrez vos séries, poids et mesures pour visualiser vos avancées",
      icon: FaChartLine,
      bg: "/img/Progression1.jpg"
    },
    {
      id: 4,
      title: "Boutique de produits fitness",
      desc: "Équipement et suppléments sélectionnés pour optimiser vos entraînements",
      icon: FaShoppingCart,
      bg: "/img/ProtBouti2.jpg"
    }
  ];

  return (
    <section className='min-w-full my-30 overflow-hidden'>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className='flex flex-col justify-center items-center text-center px-4'
      >
        <motion.p variants={fadeInUp} className="uppercase text-amber-500 font-semibold tracking-wider">
          Outils
        </motion.p>
        <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-white">
          Tout ce dont vous avez besoin
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
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 m-10 lg:m-20'
      >
        {outils.map((outil, index) => (
          <motion.div
            key={outil.id}
            variants={fadeInUp}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative bg-center bg-cover rounded-2xl p-6 h-80 overflow-hidden group"
            style={{ backgroundImage: `url('${outil.bg}')` }}
          >
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500"></div>
            
            <div className='relative z-10 flex flex-col h-full justify-between'>
              <div>
                <outil.icon className='text-amber-500 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300' />
                <h3 className='text-white font-bold text-lg leading-tight'>
                  {outil.title}
                </h3>
                <p className='text-gray-300 text-sm mt-2'>
                  {outil.desc}
                </p>
              </div>
              
              <motion.button
                whileHover={{ x: 10 }}
                className='essai flex items-center gap-3 text-amber-400 font-medium group-hover:text-amber-300 transition-colors duration-300'
              >
                Découvrir
                <FaAngleRight className='group-hover:translate-x-1 transition-transform duration-300' />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Outils;