import Image from "next/image";
import { Card } from "@/app/components/ui/card";

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
    <Card className="group text-center p-6 sm:p-8 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-muted/10 border-0">
      <div className="relative mb-6">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={100}
          height={100}
          className="h-16 w-16 sm:h-20 sm:w-20 mx-auto transition-transform duration-300 group-hover:scale-110"
          style={{ objectFit: "contain" }}
        />
      </div>
      <h3 className="font-bold text-lg sm:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        {description}
      </p>
    </Card>
  );
}

