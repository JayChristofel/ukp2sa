import React, { useEffect, useState, useCallback } from "react";
import { TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { renderToStaticMarkup } from "react-dom/server";
import { CATEGORY_CONFIG } from "./MapConfig";
import { getMarkerIcon } from "./MapMarkerUtils";
import { MapPopupContent } from "./MapPopupContent";

// Pre-render common cluster icons
const CLUSTER_ICON_SVG = Object.entries(CATEGORY_CONFIG).reduce(
  (acc, [key, config]) => {
    acc[key] = renderToStaticMarkup(
      <config.icon size={20} color="white" strokeWidth={2.5} />,
    );
    return acc;
  },
  {} as Record<string, string>,
);

const ResizeHandler = ({ isFullscreen }: { isFullscreen: boolean }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map, isFullscreen]);
  return null;
};

const FlyToMarker = ({ marker }: { marker: any }) => {
  const map = useMap();
  useEffect(() => {
    if (marker && marker.lat && marker.lon) {
      map.flyTo([marker.lat, marker.lon], 16, {
        duration: 1.5,
        easeLinearity: 0.25,
      });

      const timer = setTimeout(() => {
        map.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            const pos = layer.getLatLng();
            if (pos.lat === marker.lat && pos.lng === marker.lon) {
              layer.openPopup();
            }
          }
        });
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [marker, map]);
  return null;
};

const CategoryMarkers = React.memo(({ markers }: { markers: any[] }) => {
  return (
    <>
      {markers.map((m) => {
        const iconObj = getMarkerIcon(undefined, m.markerType);
        return (
          <Marker
            key={m.id}
            position={[m.lat, m.lon]}
            icon={iconObj}
            {...({ markerType: m.markerType } as any)}
          >
            <Popup
              closeButton={false}
              className="custom-leaflet-popup"
              maxWidth={240}
              minWidth={200}
            >
              <MapPopupContent marker={m} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
});
CategoryMarkers.displayName = "CategoryMarkers";

interface MapLayersProps {
  markersByCategory: Record<string, any[]>;
  visibleLayers: Set<string>;
  isFullscreen: boolean;
  focusedMarker?: any;
}

export const MapLayers: React.FC<MapLayersProps> = ({
  markersByCategory,
  visibleLayers,
  isFullscreen,
  focusedMarker,
}) => {
  const map = useMap();
  const [mapReady, setMapReady] = useState(false);

  useMapEvents({
    layeradd: () => {
      if (!mapReady && map.getContainer()) setMapReady(true);
    },
    load: () => setMapReady(true),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (map.getContainer()) setMapReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);

  const createClusterIcon = useCallback((cluster: any) => {
    const count = cluster.getChildCount();
    const markers = cluster.getAllChildMarkers();
    const firstMarker = markers[0];
    const dominantType = firstMarker?.options?.markerType || "report";
    const config = CATEGORY_CONFIG[dominantType] || CATEGORY_CONFIG.report;

    const size = count < 10 ? 40 : count < 100 ? 48 : 56;
    const iconMarkup = CLUSTER_ICON_SVG[dominantType] || CLUSTER_ICON_SVG.report || "";

    return L.divIcon({
      html: `
        <div style="width:${size}px; height:${size}px; background-color:${config.color}; border:3.5px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(0,0,0,0.3); position:relative;">
          ${iconMarkup}
          <div style="position:absolute; top:-6px; right:-6px; background-color:#e11d48; color:white; border:2px solid white; border-radius:12px; min-width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:900; font-family:'Outfit',sans-serif; padding:0 4px; box-shadow:0 2px 6px rgba(0,0,0,0.3);">
            ${count > 999 ? "999+" : count}
          </div>
        </div>
      `,
      className: "custom-cluster-icon",
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }, []);

  // Note: We don't guard TileLayer with mapReady to ensure the base map renders immediately.
  // mapReady is only used for markers/clusters if preferred, but here we can simplify.
  if (!map) return null;

  const totalMarkerCount = Object.values(markersByCategory).flat().length;

  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; Esri'
        updateWhenIdle={true}
        keepBuffer={1}
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        opacity={0.7}
        updateWhenIdle={true}
        keepBuffer={1}
      />

      <MarkerClusterGroup
        key={`cluster-${isFullscreen}`}
        chunkedLoading={true}
        maxClusterRadius={80}
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={15}
        animate={totalMarkerCount < 1000}
        iconCreateFunction={createClusterIcon}
      >
        {Object.entries(markersByCategory).map(([category, list]) => {
          if (visibleLayers.has(category)) {
            return <CategoryMarkers key={category} markers={list} />;
          }
          return null;
        })}
      </MarkerClusterGroup>

      {focusedMarker && <FlyToMarker marker={focusedMarker} />}
      <ResizeHandler isFullscreen={isFullscreen} />
    </>
  );
};
