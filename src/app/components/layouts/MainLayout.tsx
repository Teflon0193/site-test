import type React from "react";
import Header from "../home/header";
import Footer from "../home/footer";

interface MainLayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

/**
 * Layout wrapper Server Component qui combine Header et Footer
 * Utilisé par toutes les pages publiques qui ont besoin de ces deux composants
 */
export default function MainLayout({
  children,
  transparentHeader = true,
}: MainLayoutProps) {
  return (
    <div>
      <Header transparentHeader={transparentHeader} />
      {children}
      <Footer />
    </div>
  );
}
