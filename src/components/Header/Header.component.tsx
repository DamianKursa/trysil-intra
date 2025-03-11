import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMobileMenu = () => setMenuOpen((prev) => !prev)

  return (
    <header className='fixed w-full top-0 bg-white shadow-md z-50'>
      <nav className='container mx-auto flex items-center justify-between p-4'>
        {/* Logo */}
        <Link href='/'>
          <img src='/images/logo.webp' alt='Trysil RMM Logo' className='h-10' />
        </Link>

        {/* Desktop Navigation */}
        <ul className='hidden md:flex space-x-6 text-gray-700 font-medium'>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/about'>About Us</Link>
          </li>
          <li>
            <Link href='/products'>Products</Link>
          </li>
          <li>
            <Link href='/news'>News</Link>
          </li>
          <li>
            <Link href='/gallery'>Gallery</Link>
          </li>
          <li>
            <Link href='/contact'>Contact</Link>
          </li>
          <li>
            <Link href='/contact'>Login</Link>
          </li>
        </ul>

        {/* Contact Info & Icons */}
        <div className='hidden md:flex items-center space-x-6'>
          <p className='text-gray-700 font-medium'>
            <a href='tel:+4762449955'>📞 +47 62 44 99 55</a>
          </p>
          <p className='text-gray-700 font-medium'>
            <a href='mailto:post@trysilrmm.com'>✉️ post@trysilrmm.com</a>
          </p>
        </div>

        {/* Mobile Menu Toggle */}
        <button className='md:hidden' onClick={toggleMobileMenu}>
          <img
            src={menuOpen ? "/icons/close-button.svg" : "/icons/menu-icon.svg"}
            alt='Menu'
            className='h-6'
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className='md:hidden bg-white shadow-md absolute w-full left-0 top-16 p-4'>
          <ul className='space-y-4 text-gray-700'>
            <li>
              <Link href='/'>Home</Link>
            </li>
            <li>
              <Link href='/about'>About Us</Link>
            </li>
            <li>
              <Link href='/products'>Products</Link>
            </li>
            <li>
              <Link href='/news'>News</Link>
            </li>
            <li>
              <Link href='/gallery'>Gallery</Link>
            </li>
            <li>
              <Link href='/contact'>Contact</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
