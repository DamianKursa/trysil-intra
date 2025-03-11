import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = ({ section }: { section: string }) => {
  const menuItems = [
    {
      label: 'Moje dane',
      href: '/moje-konto/moje-dane',
      icon: '/icons/user.svg', // Update the path as necessary
    },
    {
      label: 'Moje zamówienia',
      href: '/moje-konto/moje-zamowienia',
      icon: '/icons/cart.svg', // Update the path as necessary
    },
    {
      label: 'Kupione produkty',
      href: '/moje-konto/kupione-produkty',
      icon: '/icons/kupione.svg', // Update the path as necessary
    },
    {
      label: 'Dane do faktury',
      href: '/moje-konto/dane-do-faktury',
      icon: '/icons/do-faktury.svg', // Update the path as necessary
    },
    {
      label: 'Wyloguj',
      href: '/logowanie',
      icon: '/icons/logout-01.svg', // Update the path as necessary
    },
  ];

  return (
    <div className="bg-beige-dark p-6 rounded-lg w-full md:w-64">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`flex items-center p-3 rounded-lg ${
              section === item.href.split('/').pop()
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              className="mr-3"
            />
            <Link href={item.href} className="text-lg font-medium">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
