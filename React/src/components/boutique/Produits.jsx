import React from 'react'

function Produits() {
  return (
    <>
        <section className='bg-white/5 h-full py-20'>
            <h2 className="text-center mb-10">Produits vedettes</h2>
            <div className="grid grid-cols-3 px-20">
                <div className="w-xs border border-amber-600">
                    <img src="/img/wheyBoite.png" alt="" />
                </div>
                <div className="w-xs border border-amber-600">
                    <img src="/img/wheyBoite.png" alt="" />
                </div>
                <div className="w-xs border border-amber-600">
                    <img src="/img/wheyBoite.png" alt="" />
                </div>
            </div>
            <div className='flex justify-center items-center my-30 gap-40'>
                <div className="w-xs">
                    <h2 className=" text-amber-500">Nous créons des produits pour vous adier à atteindre vos objectifs fitness</h2>
                    
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos labore suscipit minus voluptas magnam iure optio. Aliquam atque et nisi obcaecati! Aliquid quo quae, aspernatur nemo beatae fuga porro at.</p>
                    <button className='essai uppercase mt-20 w-50'>Voir Plus...</button>
                    
                </div>
                <div className='relative w-md'>
                    <div className='absolute border-2 border-amber-500 w-xs h-1/2 left-37 top-60'></div>
                    <img src="/img/OloPro.jpg" className='' alt="" />
                    <div className="absolute z-0 w-72 h-72 bg-orange-500 blur-[120px] opacity-40 rounded-full left-50 top-20"></div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Produits