
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => {
  return (
    <div className={`mobile-container ${className}`}>
      {children}
    </div>
  );
};

export default Layout;
