import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { BiMenu } from "react-icons/bi";
import { Button } from "@/components/ui/button";

interface HeaderActionsProps {
  onMobileMenuToggle: () => void;
}

export function HeaderActions({ onMobileMenuToggle }: HeaderActionsProps) {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
      {/* Desktop Member Button */}
      <Button size="lg">
        <Link
          href="/espace-membre"
          className="hidden rounded-lg lg:flex items-center space-x-2 bg-gradient-to-r from-accent to-accent/90 text-black px-4 py-2 font-bold text-sm hover:from-accent/90 hover:to-accent hover:text-black transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <FaUser className="w-4 h-4" />
          <span className="hidden xl:inline">Espace Membres</span>
          <span className="xl:hidden">Membres</span>
        </Link>
      </Button>

      {/* Tablet Member Button */}
      <Link
        href="/espace-membre"
        className="hidden lg:flex xl:hidden items-center justify-center bg-gradient-to-r from-white to-muted/10 text-foreground p-2 font-bold hover:from-secondary/90 hover:to-secondary/80 hover:text-white transition-all duration-300 hover:scale-105 shadow-lg rounded-xl"
      >
        <FaUser className="w-4 h-4" />
      </Link>

      {/* Mobile/Tablet Menu Button */}
      <button
        className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
        onClick={onMobileMenuToggle}
        aria-label="Toggle mobile menu"
      >
        <BiMenu className="w-6 h-6" />
      </button>
    </div>
  );
}
