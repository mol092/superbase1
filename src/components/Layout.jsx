import React from 'react'
import Header from './Header'
import Footer from './Footer'
import CartSidebar from './CartSidebar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}

export default Layout