import Image from "next/image";

interface MissionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export default function MissionCard({
  title,
  description,
  imageSrc,
  imageAlt,
}: MissionCardProps) {
  return (
    <div className="text-center group p-6 border border-transparent hover:border-zinc-200 transition-colors duration-300">
      <div className="relative mb-6 inline-block">
        <div className="w-20 h-20 mx-auto relative flex items-center justify-center">
          {/* Square accent behind logo */}
          <div className="absolute inset-0 bg-black/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out origin-center" />
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={80}
            height={80}
            className="relative z-10 w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-3 text-black group-hover:underline decoration-4 underline-offset-4 decoration-accent transition-all px-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 leading-relaxed px-2 font-medium">
        {description}
      </p>
    </div>
  );
}
