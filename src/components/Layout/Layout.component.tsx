// Layout.tsx
import React, { ReactNode, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

// Components
import Header from '@/components/Header/Header.component';
import Footer from '@/components/Footer/Footer.component';

interface ILayoutProps {
  children?: ReactNode;
  title: string;
}

const Layout: React.FC<ILayoutProps> = ({ children, title }) => {
  const router = useRouter();

  return (
    <>
      <Header title={title} />

      <main className="container mx-auto max-w-[1440px] mt-0 lg:mt-[88px] py-16">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;
