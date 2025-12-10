import { BiMenu } from "react-icons/bi";

interface MobileMenuToggleProps {
  onToggle: () => void;
}

/**
 * Mobile menu toggle button component
 * Single Responsibility: Only handles mobile menu toggle
 */
export function MobileMenuToggle({ onToggle }: MobileMenuToggleProps) {
  return (
    <button
      className="lg:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
      onClick={onToggle}
      aria-label="Toggle mobile menu"
    >
      <BiMenu className="w-6 h-6" />
    </button>
  );
}
