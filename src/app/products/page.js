import React from 'react'

import Product_Hero from './sections/Product_Hero'
import Product_Grid from './sections/Product_Grid'
import Product_Philosophy from './sections/Product_Philosophy'

/* The closing three blocks are shared with About and Blog — identical
   Figma frames, identical copy — so they live in components/ and every
   page renders the same implementation. */
import Cta from '../components/Cta'
import Faq from '../components/Faq'
import Footer from '../components/Footer'

const page = () => {
  return (
    <>
      <Product_Hero />
      <Product_Grid />
      <Product_Philosophy />
      <Cta />
      <Faq />
      <Footer />
    </>
  )
}

export default page
