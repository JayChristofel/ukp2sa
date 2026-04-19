"use client";

import React, { useEffect, useState } from "react";
import { MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map as MapIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { useI18n } from "@/app/[lang]/providers";
import { useMapData } from "@/hooks/useMapData";
import { SIDEBAR_GROUPS } from "./map/MapConfig";
import { cn } from "@/lib/utils";

// Modular Components
import { MapLayers } from "./map/MapLayers";
import { MapSidebar } from "./map/MapSidebar";
import { MapOverlayControls } from "./map/MapOverlayControls";
import { useMapCategorization } from "./map/useMapCategorization";

const acehCenter: [number, number] = [4.6951, 96.7494];

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

  useEffect(() => {
    // Fix Leaflet marker icons fallback
    // @ts-expect-error Internal API
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Fetch data if needed
  const {
    markers: hookMarkers,
    isLoading,
    isError,
  } = useMapData(acehCenter, showMarkers && !externalMarkers);

  // Source of truth
  const rawMarkers = externalMarkers || hookMarkers;
  const markers = showMarkers ? rawMarkers : [];
  const deferredMarkers = React.useDeferredValue(markers);

  // Categorization & Counts logic extracted to hook
  const { counts, markersByCategory } = useMapCategorization(deferredMarkers);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const toggleLayer = (id: string) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isError) {
    return (
      <div className="h-[600px] w-full bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <MapIcon className="text-slate-300 dark:text-slate-700 size-12 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
          {d.error_load || "Engine Failed"}
        </p>
        <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {d.retry || "RELOAD"}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden transition-all duration-700",
        isFullscreen ? "h-screen w-screen bg-black rounded-0" : "h-[700px] rounded-[2.5rem]",
      )}
    >
      {/* Controls & Sidebar Overlay */}
      <div className="absolute right-4 bottom-6 z-[1001] flex items-end gap-3">
        <AnimatePresence>
          {isSidebarOpen && (
            <MapSidebar 
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
              visibleLayers={visibleLayers}
              onToggleLayer={toggleLayer}
              counts={counts}
              dict={dict}
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col items-end gap-2">
          <MapOverlayControls 
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>

      <MapContainer
        center={acehCenter}
        zoom={9}
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

      {isLoading && deferredMarkers.length === 0 && (
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm z-[5000] flex flex-col items-center justify-center">
          <div className="size-10 border-4 border-navy border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-black text-navy dark:text-white uppercase tracking-widest text-[10px]">Syncing Data...</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
