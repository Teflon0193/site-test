import Image from "next/image";
import { IoIosMail } from "react-icons/io";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { Member } from "@/data/member";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="group overflow-hidden rounded-none border border-zinc-200 bg-white hover:border-black transition-colors duration-300 shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="aspect-square relative overflow-hidden bg-zinc-100">
        <Image
          src={member.photo || "/placeholder.svg"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center justify-center gap-2 text-white hover:text-accent transition-colors text-xs font-bold uppercase tracking-wider"
            aria-label={`Envoyer un email à ${member.name}`}
          >
            <IoIosMail className="w-4 h-4" />
            <span className="truncate">Contact</span>
          </a>
        </div>
      </div>

      <CardHeader className="text-center pb-4 pt-6 px-4 space-y-2">
        <CardTitle className="text-lg font-black leading-none text-black uppercase tracking-tight">
          {member.name}
        </CardTitle>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-t border-zinc-100 pt-2 inline-block">
          {member.position}
        </p>
      </CardHeader>

      <CardContent className="text-center pb-6 pt-0 px-4 hidden">
        {/* Email moved to hover overlay on image for cleaner look */}
      </CardContent>
    </Card>
  );
}
