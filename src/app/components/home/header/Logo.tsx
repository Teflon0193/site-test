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
          src="/logo.png"
          alt="Logo Grand Tambour"
          width={100}
          height={100}
          className="w-auto h-10 sm:h-12 md:h-14 lg:h-16 xl:h-12 transition-all duration-300 drop-shadow-lg flex-shrink-0"
        />
      </Link>
    </div>
  );
}
