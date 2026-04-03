import React from "react";
import { Marker, useMap } from "react-leaflet";
import { getMarkerIcon } from "./MapMarkerUtils";

interface InteractiveMarkerProps {
  position: [number, number];
  marker: any;
  children?: React.ReactNode;
  count?: number;
}

export const InteractiveMarker: React.FC<InteractiveMarkerProps> = ({
  position,
  marker,
  children,
  count,
}) => {
  const map = useMap();
  const iconObj = getMarkerIcon(count, marker.markerType);

  return (
    <Marker
      position={position}
      icon={iconObj}
      eventHandlers={{
        click: (e) => {
          if (count && count > 1) {
            map.setView(e.latlng, map.getZoom() + 2);
          }
        },
      }}
    >
      {children}
    </Marker>
  );
};
