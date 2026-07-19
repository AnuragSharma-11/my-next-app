import React from 'react'
import About_Hero from './sections/About_Hero'
import About_Origin from './sections/About_Origin'
import About_Manifesto from './sections/About_Manifesto'
import About_Systems from './sections/About_Systems'
import About_Principles from './sections/About_Principles'
import Cta from '../components/Cta'
import Faq from '../components/Faq'
import Footer from '../components/Footer'

const about = () => {
  return (
    <>
      <About_Hero />
      <About_Origin />
      <About_Manifesto />
      <About_Systems />
      <About_Principles />
      <Cta />
      <Faq />
      <Footer />
    </>
  )
}

export default about
