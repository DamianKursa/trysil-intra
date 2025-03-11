import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company Info</h4>
            <p className="text-sm">HVYT by Marta Wontorczyk</p>
            <p className="text-sm">NIP: 6762570584</p>
            <p className="text-sm">REGON: 384282914</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq">FAQs</Link>
              </li>
              <li>
                <Link href="/returns">Returns Policy</Link>
              </li>
              <li>
                <Link href="/shipping">Shipping Info</Link>
              </li>
              <li>
                <Link href="/terms">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#">
                <img src="/icons/facebook.svg" alt="Facebook" className="h-6" />
              </Link>
              <Link href="#">
                <img
                  src="/icons/instagram.svg"
                  alt="Instagram"
                  className="h-6"
                />
              </Link>
              <Link href="#">
                <img src="/icons/twitter.svg" alt="Twitter" className="h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-sm mt-8 border-t border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} HVYT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
