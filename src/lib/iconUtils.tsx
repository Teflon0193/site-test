import { FaTheaterMasks } from "react-icons/fa";
import { IoIosCafe } from "react-icons/io";
import { FaBuildingUser } from "react-icons/fa6";
import { FaCamera } from "react-icons/fa";
import type { Espace } from "@/data/espaces";

type IconComponent = React.ComponentType<{ className?: string }>;

const iconComponents: Record<Espace["iconName"], IconComponent> = {
  theater: FaTheaterMasks,
  cafe: IoIosCafe,
  building: FaBuildingUser,
  camera: FaCamera,
};

export function getEspaceIcon(iconName: Espace["iconName"]): IconComponent {
  return iconComponents[iconName] || FaTheaterMasks;
}
