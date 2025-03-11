import Link from "next/link"

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white py-10'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Column 1: Company Info */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Trysil RMM</h4>
            <p className='text-sm'>Lysvegen 32</p>
            <p className='text-sm'>NO-2422 Nybergsund, Norway</p>
            <p className='text-sm'>
              Phone: <a href='tel:+4762449955'>+47 62 44 99 55</a>
            </p>
            <p className='text-sm'>
              Email: <a href='mailto:post@trysilrmm.com'>post@trysilrmm.com</a>
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2 text-sm'>
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

          {/* Column 3: Support */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Customer Support</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/faq'>FAQs</Link>
              </li>
              <li>
                <Link href='/returns'>Returns & Warranty</Link>
              </li>
              <li>
                <Link href='/shipping'>Shipping Information</Link>
              </li>
              <li>
                <Link href='/terms'>Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className='text-lg font-semibold mb-4'>Follow Us</h4>
            <div className='flex space-x-4'>
              <Link href='https://www.facebook.com/trysilrmm' target='_blank'>
                <img src='/icons/facebook.svg' alt='Facebook' className='h-6' />
              </Link>
              <Link href='https://www.instagram.com/trysilrmm' target='_blank'>
                <img
                  src='/icons/instagram.svg'
                  alt='Instagram'
                  className='h-6'
                />
              </Link>
              <Link
                href='https://www.linkedin.com/company/trysilrmm'
                target='_blank'
              >
                <img src='/icons/linkedin.svg' alt='LinkedIn' className='h-6' />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='text-center text-sm mt-8 border-t border-gray-700 pt-4'>
          &copy; {new Date().getFullYear()} Trysil RMM. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
