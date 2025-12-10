"use client";

import { Button } from "@/app/components/ui/button";
import { FaRoute } from "react-icons/fa";

export function GoogleMapsButton() {
  return (
    <Button
      variant="outline"
      className="cursor-pointer rounded-xl w-full bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/30 text-primary hover:text-black font-semibold py-3 transition-all duration-300"
      onClick={() => {
        window.open(
          "https://www.google.com/maps/place/Centre+Culturel+et+Artistique+pour+les+Pays+d'Afrique+Centrale/@-4.3338616,15.2992167,16.6z/data=!4m20!1m13!4m12!1m4!2m2!1d15.2797184!2d-4.3155456!4e1!1m6!1m2!1s0x1a6a314420665d11:0xaf07bf1a55c3afe1!2sBoulevard+Triomphal,+Kinshasa!2m2!1d15.304595!2d-4.3345427!3m5!1s0x1a6a3167c6c74b9b:0x1b1f7e8e99b778c7!8m2!3d-4.3355832!4d15.3042813!16s%2Fg%2F11sbrczsq_?entry=ttu&g_ep=EgoyMDI1MDkyOS4wIKXMDSoASAFQAw%3D%3D",
          "_blank"
        );
      }}
    >
      <FaRoute className="h-4 w-4 mr-2" />
      <span className="font-semibold">
        Voir l&apos;itinéraire sur Google Maps
      </span>
    </Button>
  );
}
