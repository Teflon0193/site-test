import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <div className="flex items-center flex-shrink-0">
      <Link
        href="/"
        className="flex items-center transition-all duration-300 scale-105"
      >
        <Image
          src="/logo-grand-tambour.png"
          alt="Logo Grand Tambour"
          width={100}
          height={100}
          className="w-auto h-14 sm:h-20 md:h-20 lg:h-20 xl:h-20 transition-all duration-300 drop-shadow-lg flex-shrink-0"
        />
      </Link>
    </div>
  );
}
