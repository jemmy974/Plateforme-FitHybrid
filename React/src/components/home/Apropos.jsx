// import React from 'react'

// import { AiTwotoneFire} from 'react-icons/ai'
// import { FaMedal} from 'react-icons/fa'
// function Apropos() {
//   return (
//     <>
//     <section className='shadow-2xl relative my-30  bg-gray-900 shadow-amber-50'> 
//         <video src="/video/Accueil - Base du Fit.mp4" autoPlay loop muted playsInline className='absolute w-full h-130 object-cover object-top'></video>
//         <div className="absolute mt-20 inset-0 bg-black/60"></div>
//     <div className="relative flex justify-center p-30 items-center top-15 z-10">
//         <div className='px-10'>
//             <h2 className='uppercase'>Une plateforme construite pour les vrais athlète</h2>
//         </div>
//         <div className='grid grid-rows-2'>
//             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas cupiditate, animi voluptatibus enim laudantium labore saepe! Nemo blanditiis distinctio, aliquam inventore eius sint dolorem ullam voluptates eum praesentium hic officiis?</p>
//             <div className=' grid grid-cols-2 gap-6'>
//                 <div>
//                     <FaMedal className='text-white text-2xl'/>
//                     <h3>Coaching réel</h3>
//                     <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita suscipit ratione repellat itaque sed.</p>
//                 </div>
//                 <div>
//                     <AiTwotoneFire className='text-white text-2xl'/>
                    
//                     <h3>résultats mésurés</h3>
//                     <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita suscipit ratione repellat itaque sed.</p>
//                 </div>
//             </div>
//         </div>
//     </div>
//     </section>
//     </>
//   )
// }

// export default Apropos

import React from 'react';
import { motion } from 'framer-motion';
import { AiTwotoneFire } from 'react-icons/ai';
import { FaMedal } from 'react-icons/fa';

function Apropos() {
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

  return (
    <section className='shadow-2xl relative my-30 bg-gray-900 shadow-amber-50 overflow-hidden'>
      {/* Vidéo */}
      <motion.video
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        src="/video/Accueil - Base du Fit.mp4"
        autoPlay
        loop
        muted
        playsInline
        className='absolute w-full h-130 object-cover object-top'
      />
      
      {/* Overlay */}
      <div className="absolute mt-20 inset-0 bg-black/60"></div>
      
      {/* Contenu */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="relative flex flex-col lg:flex-row justify-center items-center p-10 lg:p-30 top-15 z-10 gap-10"
      >
        <motion.div variants={fadeInUp} className='px-10'>
          <h2 className='uppercase text-3xl lg:text-4xl font-bold text-white leading-tight'>
            Une plateforme construite <br />
            <span className='text-amber-500'>pour les vrais athlètes</span>
          </h2>
        </motion.div>
        
        <motion.div variants={fadeInUp} className='max-w-2xl'>
          <p className='text-gray-300 text-lg leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas cupiditate, 
            animi voluptatibus enim laudantium labore saepe! Nemo blanditiis distinctio.
          </p>
          
          <motion.div 
            variants={staggerContainer}
            className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'
          >
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.05, borderColor: '#D4AF37' }}
              className='p-4 rounded-xl border border-white/10 hover:border-amber-500/50 transition-all duration-300'
            >
              <FaMedal className='text-amber-500 text-3xl mb-3' />
              <h3 className='text-white font-bold text-lg'>Coaching réel</h3>
              <p className='text-gray-400 text-sm'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita suscipit ratione repellat itaque sed.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.05, borderColor: '#D4AF37' }}
              className='p-4 rounded-xl border border-white/10 hover:border-amber-500/50 transition-all duration-300'
            >
              <AiTwotoneFire className='text-amber-500 text-3xl mb-3' />
              <h3 className='text-white font-bold text-lg'>Résultats mesurés</h3>
              <p className='text-gray-400 text-sm'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita suscipit ratione repellat itaque sed.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Apropos;