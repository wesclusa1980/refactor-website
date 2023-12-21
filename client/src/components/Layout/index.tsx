import { ReactNode } from 'react';

// Styles
import './style.css';

// ----------------

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="container">
      <div className="page-wrapper">{children}</div>
    </div>
  );
}

export default Layout;
