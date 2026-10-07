import React from 'react'
import { Link } from 'react-router-dom'

function Objectifs() {
    return (
        <>
            <section className='my-30'>
                <div className='flex flex-col justify-center items-center'>
                    <p className="uppercase">Objectifs</p>
                    <h2>Choisissez votre Transformation</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className="my-10 px-30 grid grid-cols-3">
                    <div className="relative bg-[url('/img/Prise.jpg')] bg-center bg-cover  w-xs rounded-4xl brightness-75">
                        <div className="absolute inset-0 bg-black/50  rounded-4xl"></div>
                        <div className="relative flex flex-col justify-end gap-5 items-center p-6">
                            <h3>Prise de muscle et force</h3>
                            <p>Construisez la masse que vous cherchez</p>
                             <Link to="/exo"><button className='essai outline-double'>Commencez</button></Link>
                             {/* <Link to="/exo" className='essai outline-double'>Commencez</Link> */}
                        </div>
                    </div>
                    <div className="relative bg-[url('/img/perteP.png')] bg-center bg-cover  w-xs rounded-4xl">
                        <div className="absolute inset-0 bg-black/50  rounded-4xl"></div>
                        <div className="relative flex flex-col justify-end gap-5 items-center p-6">
                            <h3>Perte de poids durable</h3>
                            <p>Brûlez les calories avec des méthodes éprouvrées</p>
                            <Link to="/exo"><button className='essai outline-double'>Commencez</button></Link>
                            {/* <Link to="/exo" className='essai outline-double'>Commencez</Link> */}
                        </div>
                    </div>
                    <div className="relative bg-[url('/img/coachFille.jpg')] bg-center bg-cover w-xs rounded-4xl">
                        <div className="absolute inset-0 bg-black/55  rounded-4xl"></div>
                        <div className="relative flex flex-col justify-end gap-5 items-center p-6">
                            <h3>Condition physique génerale</h3>
                            <p>Ameliorez votre endurance et votre mobilité</p>
                             <Link to="/exo"><button className='essai outline-double'>Commencez</button></Link>
                             {/* <Link to="/exo" className='essai outline-double'>Commencez</Link> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Objectifs