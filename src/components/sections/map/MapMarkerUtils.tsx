import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { MapPin } from "lucide-react";
import { CATEGORY_CONFIG } from "./MapConfig";

const iconCache: Record<string, L.DivIcon> = {};

export const getMarkerIcon = (count?: number, markerType?: string) => {
  const typeKey = markerType || "report";
  const cacheKey = count && count > 1 ? `${typeKey}-${count}` : typeKey;

  if (iconCache[cacheKey]) return iconCache[cacheKey];

  const config = CATEGORY_CONFIG[typeKey] || {
    icon: MapPin,
    color: "#64748b",
  };
  const categoryColor = config.color;
  const IconComponent = config.icon;

  const size = 28;
  // Convert icon to SVG path or simpler string if possible, but at least cache the result
  const iconMarkup = renderToStaticMarkup(
    <IconComponent size={15} color="white" strokeWidth={2.5} />,
  );

  const icon = L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div class="relative flex items-center justify-center" style="width: 40px; height: 40px;">
        <div style="background-color: ${categoryColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">
          ${iconMarkup}
        </div>
        ${
          count && count > 1
            ? `
          <div style="position: absolute; top: 0px; right: 0px; background-color: #e11d48; color: white; border: 2px solid white; border-radius: 20px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; box-shadow: 0 2px 6px rgba(0,0,0,0.4); padding: 0 4px; z-index: 10; font-family: 'Outfit', sans-serif;">
            ${count > 999 ? "99+" : count}
          </div>
        `
            : ""
        }
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -16],
  });

  iconCache[cacheKey] = icon;
  return icon;
};
