import React from 'react'
import Hero from '../components/home/Hero.jsx'
import Apropos from '../components/home/Apropos.jsx'
import Processus from '../components/home/Processus.jsx'
import Outils from '../components/home/Outils.jsx'
import Categories from '../components/home/Categories.jsx'
import Objectifs from '../components/home/Objectifs.jsx'

function Home() {
  return (
    <>
        <Hero/>
        <Apropos/>
        <Processus/>
        <Outils/>
        <Categories/>
        <Objectifs/>

    </>
  )
}

export default Home