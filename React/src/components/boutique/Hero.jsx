import React from 'react'

function Hero() {
    return (
        <>
            <section className='w-full flex justify-center items-center mb-10 bg-gray-900'>
                <div className="h-screen grid grid-cols-2 gap-20 items-center">
                    <div className='w-xs mx-60'>
                        <h1 className='text-amber-500'>Surpasser-vous avec ProteinParadise</h1>
                            <p>Dépasser votre limite avec les supplements ProteinParadise</p>
                            <button className='essai w-50 mt-10'>Acheter</button>
                    </div>
                    <div className="items-end">
                        <img src="/img/Masssachet.png" alt="" />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero