import { useMemo } from "react";
import { SIDEBAR_GROUPS } from "./MapConfig";

export const useMapCategorization = (markers: any[]) => {
  const countsAndGroups = useMemo(() => {
    const counts: Record<string, number> = {};
    const groups: Record<string, any[]> = {};

    // Initialize groups based on config to ensure we have empty arrays for visible layer check
    SIDEBAR_GROUPS.forEach(g => {
      g.items.forEach(i => {
        if (!groups[i.id]) groups[i.id] = [];
      });
    });

    markers.forEach((m) => {
      const type = m.markerType || m.type;

      // Grouping for Map Layers
      if (!groups[type]) groups[type] = [];
      const hasCoords =
        typeof m.lat === "number" &&
        typeof m.lon === "number" &&
        !isNaN(m.lat) &&
        !isNaN(m.lon);
      if (hasCoords) groups[type].push(m);

      // Counting for Sidebar Badges
      counts[m.type] = (counts[m.type] || 0) + 1;
      if (m.markerType && m.markerType !== m.type) {
        counts[m.markerType] = (counts[m.markerType] || 0) + 1;
      }

      const cls = m.data?.classification;
      if (cls) counts[cls] = (counts[cls] || 0) + 1;

      const q = (m.data?.question || "").toLowerCase();
      if (q.includes("jalan"))
        counts["jalan-rusak"] = (counts["jalan-rusak"] || 0) + 1;
      else if (q.includes("jembatan"))
        counts["jembatan-rusak"] = (counts["jembatan-rusak"] || 0) + 1;
      else if (q.includes("helipad"))
        counts["helipad"] = (counts["helipad"] || 0) + 1;
      else if (q.includes("starlink"))
        counts["starlink"] = (counts["starlink"] || 0) + 1;
    });

    return { counts, markersByCategory: groups };
  }, [markers]);

  return countsAndGroups;
};
