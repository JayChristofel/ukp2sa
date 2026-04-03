"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { motion, AnimatePresence } from "framer-motion";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Filter,
  X,
  Map as MapIcon,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { useI18n } from "@/app/[lang]/providers";
import { useMapData } from "@/hooks/useMapData";
import { CATEGORY_CONFIG, SIDEBAR_GROUPS } from "./map/MapConfig";
import { getMarkerIcon } from "./map/MapMarkerUtils";
import { MapPopupContent } from "./map/MapPopupContent";
import { cn } from "@/lib/utils";

// --- Internal Utilities ---

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
ResizeHandler.displayName = "ResizeHandler";

const ZoomListener = ({ setZoom }: { setZoom: (z: number) => void }) => {
  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom()),
  });
  return null;
};
ZoomListener.displayName = "ZoomListener";

const acehCenter: [number, number] = [4.6951, 96.7494];

// Pre-render common cluster icons to avoid renderToStaticMarkup overhead inside the cluster function
const CLUSTER_ICON_SVG = Object.entries(CATEGORY_CONFIG).reduce(
  (acc, [key, config]) => {
    acc[key] = renderToStaticMarkup(
      <config.icon size={20} color="white" strokeWidth={2.5} />,
    );
    return acc;
  },
  {} as Record<string, string>,
);

// --- Sub-component to stabilize Leaflet Context ---
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

const MapLayers = ({
  markersByCategory,
  visibleLayers,
  isFullscreen,
  focusedMarker,
}: {
  markersByCategory: Record<string, any[]>;
  visibleLayers: Set<string>;
  isFullscreen: boolean;
  focusedMarker?: any;
}) => {
  const map = useMap();
  const [mapReady, setMapReady] = useState(false);

  useMapEvents({
    layeradd: () => {
      if (!mapReady && map.getContainer()) {
        setMapReady(true);
      }
    },
    load: () => {
      setMapReady(true);
    },
  });

  // Force mapReady to true after a short delay as a fallback (Leaflet React timing issues)
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
    const iconMarkup =
      CLUSTER_ICON_SVG[dominantType] || CLUSTER_ICON_SVG.report;

    return L.divIcon({
      html: `
        <div style="width:${size}px; height:${size}px; background-color:${
        config.color
      }; border:3.5px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(0,0,0,0.3); position:relative;">
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

  if (!map || !mapReady) return null;

  const totalMarkerCount = Object.values(markersByCategory).flat().length;

  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        updateWhenIdle={true}
        keepBuffer={1}
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        opacity={0.8}
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
FlyToMarker.displayName = "FlyToMarker";

const MapComponent = ({
  focusedMarker,
  externalMarkers,
  showMarkers = true,
}: {
  focusedMarker?: any;
  externalMarkers?: any[];
  showMarkers?: boolean;
}) => {
  const dict = useI18n();
  const d = dict?.map || {};
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(SIDEBAR_GROUPS.flatMap((g: any) => g.items.map((i: any) => i.id))),
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMounted(true);
    }
  }, []);

  // Sync data only if internal markers are needed and no external markers provided
  const {
    markers: hookMarkers,
    isLoading,
    isError,
  } = useMapData(acehCenter, showMarkers && !externalMarkers);

  // Choose source of truth: prop or hook
  const rawMarkers = externalMarkers || hookMarkers;
  const markers = showMarkers ? rawMarkers : [];

  const deferredMarkers = React.useDeferredValue(markers);

  // Fix Leaflet marker icons
  useEffect(() => {
    // @ts-expect-error Internal API
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleLayer = (id: string) => {
    const next = new Set(visibleLayers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleLayers(next);
  };

  // Optimize item counts and categorization into a single pass
  const { counts, markersByCategory } = useMemo(() => {
    const resCounts: Record<string, number> = {};
    const resGroups: Record<string, any[]> = {};

    deferredMarkers.forEach((m) => {
      const type = m.markerType || m.type;

      // Categorization for Map
      if (!resGroups[type]) resGroups[type] = [];
      const hasCoords =
        typeof m.lat === "number" &&
        typeof m.lon === "number" &&
        !isNaN(m.lat) &&
        !isNaN(m.lon);
      if (hasCoords) resGroups[type].push(m);

      // Counts for Sidebar
      resCounts[m.type] = (resCounts[m.type] || 0) + 1;
      if (m.markerType && m.markerType !== m.type) {
        resCounts[m.markerType] = (resCounts[m.markerType] || 0) + 1;
      }

      const cls = m.data?.classification;
      if (cls) resCounts[cls] = (resCounts[cls] || 0) + 1;

      const q = (m.data?.question || "").toLowerCase();
      if (q.includes("jalan"))
        resCounts["jalan-rusak"] = (resCounts["jalan-rusak"] || 0) + 1;
      else if (q.includes("jembatan"))
        resCounts["jembatan-rusak"] = (resCounts["jembatan-rusak"] || 0) + 1;
      else if (q.includes("helipad"))
        resCounts["helipad"] = (resCounts["helipad"] || 0) + 1;
      else if (q.includes("starlink"))
        resCounts["starlink"] = (resCounts["starlink"] || 0) + 1;
    });

    return { counts: resCounts, markersByCategory: resGroups };
  }, [deferredMarkers]);

  if (isError) {
    return (
      <div className="h-[600px] w-full bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center rounded-3xl m-4 border-2 border-dashed border-slate-300 dark:border-slate-800">
        <MapIcon className="text-slate-300 dark:text-slate-700 size-12 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
          {d.error_load || "Peta gagal dimuat"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[10px] font-black text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform"
        >
          {d.retry || "COBA LAGI"}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden transition-all duration-500 group",
        isFullscreen
          ? "h-screen w-screen bg-black rounded-0"
          : "h-[700px] rounded-[2.5rem]",
      )}
    >
      <div className="absolute right-4 bottom-20 z-[1000] flex flex-col items-end gap-2">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col max-h-[380px]"
            >
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shadow-md">
                    <Filter className="text-white dark:text-slate-900 size-3" />
                  </div>
                  <h2 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    {d.filter || "Filter"}
                  </h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
                {SIDEBAR_GROUPS.map((group) => (
                  <div key={group.id} className="space-y-1.5">
                    <h3 className="px-2 text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {d.groups?.[group.id as keyof typeof d.groups] ||
                        group.labelKey}
                    </h3>
                    <div className="grid grid-cols-1 gap-0.5">
                      {group.items.map((item) => {
                        const active = visibleLayers.has(item.id);
                        const count = counts[item.id] || 0;
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleLayer(item.id)}
                            className={cn(
                              "w-full flex items-center justify-between p-1.5 rounded-lg transition-all",
                              active
                                ? "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm"
                                : "opacity-40 grayscale hover:opacity-100 dark:hover:opacity-100 hover:grayscale-0",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="size-5 rounded flex items-center justify-center text-white"
                                style={{ backgroundColor: item.color }}
                              >
                                <item.icon size={10} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 transition-colors">
                                {d.items?.[item.id as keyof typeof d.items] ||
                                  item.labelKey}
                              </span>
                            </div>
                            <span className="text-[8px] font-black text-slate-400">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggleFullscreen}
          className="p-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-2xl shadow-2xl transition-all border-2 border-slate-200 hover:scale-105 active:scale-95"
          title={isFullscreen ? "Minimize" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={cn(
            "p-3 bg-slate-900 text-white rounded-2xl shadow-2xl transition-all border-2 border-white hover:scale-105 active:scale-95",
            isSidebarOpen && "bg-rose-500",
          )}
        >
          {isSidebarOpen ? <X size={18} /> : <Filter size={18} />}
        </button>
      </div>

      {isMounted ? (
        <MapContainer
          key={`map-${isFullscreen}`}
          center={acehCenter}
          zoom={6}
          zoomControl={true}
          scrollWheelZoom={true}
          className="w-full h-full z-0 font-sans"
          preferCanvas={true}
          attributionControl={false}
        >
          <MapLayers
            markersByCategory={markersByCategory}
            visibleLayers={visibleLayers}
            isFullscreen={isFullscreen}
            focusedMarker={focusedMarker}
          />
        </MapContainer>
      ) : (
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 animate-pulse flex items-center justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Initializing Engine...
          </p>
        </div>
      )}

      {isLoading && deferredMarkers.length === 0 && (
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-md z-[5000] flex flex-col items-center justify-center">
          <div className="size-12 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
          <p className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
            {d.loading || "Memuat Peta..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
