import { BiMenu } from "react-icons/bi";

interface MobileMenuToggleProps {
  onToggle: () => void;
}

export function MobileMenuToggle({ onToggle }: MobileMenuToggleProps) {
  return (
    <button
      className="lg:hidden text-white p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
      onClick={onToggle}
      aria-label="Toggle mobile menu"
    >
      <BiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
}
