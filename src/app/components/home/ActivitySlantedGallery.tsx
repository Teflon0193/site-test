"use client";

import Image from "next/image";
import Link from "next/link";

const activities = [
  {
    image: "/images/media/exposition.png",
    title: "Expositions",
    link: "/agenda",
  },
  {
    image: "/images/media/concert.png",
    title: "Concerts",
    link: "/agenda",
  },

  {
    image: "/images/media/conference.png",
    title: "Conférences",
    link: "/agenda",
  },
  {
    image: "/images/media/atelier.png",
    title: "Festivals",
    link: "/agenda",
  },
  {
    image: "/images/media/cinema.png",
    title: "Cinéma",
    link: "/agenda",
  },
  {
    image: "/images/events/papa-wemba.jpg",
    title: "Patrimoine",
    link: "/agenda",
  },
];

export default function ActivitySlantedGallery() {
  return (
    <section className="relative h-[40vh] min-h-[350px] md:h-[50vh] overflow-hidden border-y-2 border-black bg-white group/gallery">
      {/* Background Slanted Segments */}
      <div className="absolute inset-0 flex w-[130%] -ml-[15%] z-10">
        {activities.map((activity, idx) => {
          // Define clip paths for different positions
          let clipPath = "";
          if (idx === 0) {
            clipPath = "polygon(0 0, 100% 0, 85% 100%, 0% 100%)";
          } else if (idx === activities.length - 1) {
            clipPath = "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)";
          } else {
            clipPath = "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)";
          }

          return (
            <Link
              key={idx}
              href={activity.link}
              className={`relative flex-1 h-full overflow-hidden border-x border-black/10 transition-all duration-700 hover:flex-[2] group/item ${
                idx !== 0 ? "-ml-[5%]" : ""
              }`}
              style={{ clipPath }}
            >
              <Image
                src={activity.image}
                alt={activity.title}
                fill
                className="object-cover grayscale group-hover/gallery:grayscale-0 group-hover/item:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-black/40 group-hover/item:bg-transparent transition-all duration-700" />

              {/* Text Overlay for each item - Visible on hover or small labels */}
              <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 z-20">
                <div className="bg-primary px-4 py-2 border-2 border-black">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">
                    {activity.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid Pattern Overlay (Subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </section>
  );
}
