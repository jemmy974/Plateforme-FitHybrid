import React, { useState, useEffect } from 'react';

function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  const phrases = [
    'votre corps',
    'votre esprit',
    'votre force',
    'votre vie'
  ];

  const period = 2000;

  useEffect(() => {
    let timer = setTimeout(() => {
      handleTyping();
    }, 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum]);

  const handleTyping = () => {
    const currentPhrase = phrases[loopNum % phrases.length];
    const fullText = currentPhrase;

    if (isDeleting) {
      setDisplayText(fullText.substring(0, displayText.length - 1));
    } else {
      setDisplayText(fullText.substring(0, displayText.length + 1));
    }

    if (!isDeleting && displayText === fullText) {
      setTimeout(() => setIsDeleting(true), period);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
    }
  };

  return (
    <>
      <section className='w-full min-h-screen flex bg-gray-900'>
        <div className='flex justify-center items-center gap-5'>
          <div className="absolute -top-20 -left-20 w-100 h-100 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
          <div className=' text-white px-30'>
            <h1 className='uppercase font-bold my-4'>
              <span className="text-orange-500">TRANSFORMEZ</span>
              <br />
              <span className="inline-block min-h-[60px]">
                {displayText}
                <span className="animate-pulse text-orange-500">|</span>
              </span>
              <br />
              dès aujourd'hui
            </h1>
            <div className="w-40 h-1 bg-orange-500 mt-6 rounded-full"></div>
            <p className='my-8'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Nisi porro odit atque, dicta officiis ut animi omnis optio
              iure facilis expedita voluptate obcaecati quidem quia,
              tempore praesentium! Corrupti, eaque inventore!
            </p>
          </div>
          <div className='relative items-center min-w-2xl bottom-65'>
            {/* Photo 1 - Premier plan (zoom lent) */}
            <div className='absolute z-20 w-100 px-5 left-60 top-40 overflow-hidden rounded-3xl group'>
              <img
                className='w-full transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1'
                src="/img/salle1.jpg"
                alt="Salle de sport"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Photo 2 - Arrière-plan avec zoom lent */}
            <div className='absolute left-1 z-10 overflow-hidden rounded-3xl group'>
              <img
                className='w-100 transition-transform duration-1000 group-hover:scale-110'
                src="/img/Barrefixe Fond.jpg"
                alt="Barre fixe"
              />
            </div>

            {/* Effet de glow */}
            <div className="absolute z-0 w-72 h-72 bg-orange-500 blur-[120px] opacity-40 rounded-full right-20 top-20 animate-pulse"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;