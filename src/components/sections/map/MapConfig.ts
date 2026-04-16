import {
  User,
  Building2,
  Stethoscope,
  Shield,
  Tent,
  Warehouse,
  GraduationCap,
  Landmark,
  Wifi,
  Waves,
  Construction,
  Flag,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export const CATEGORY_CONFIG: Record<string, { icon: any; color: string }> = {
  "missing-person": { icon: User, color: "#f43f5e" }, // Rose 500
  "tend-point": { icon: Tent, color: "#f59e0b" }, // Amber 500
  posko: { icon: Warehouse, color: "#64748b" }, // Slate 500
  police: { icon: Shield, color: "#3b82f6" }, // Blue 500
  Kesehatan: { icon: Stethoscope, color: "#e11d48" }, // Rose 600
  Pendidikan: { icon: GraduationCap, color: "#2563eb" }, // Blue 600
  Pemerintahan: { icon: Building2, color: "#475569" }, // Slate 600
  Keagamaan: { icon: Landmark, color: "#d97706" }, // Amber 600
  "jalan-rusak": { icon: Construction, color: "#fb7185" }, // Rose 400
  "jembatan-rusak": { icon: Waves, color: "#fb7185" }, // Rose 400
  helipad: { icon: Flag, color: "#94a3b8" }, // Slate 400
  starlink: { icon: Wifi, color: "#60a5fa" }, // Blue 400
  village: { icon: Landmark, color: "#6366f1" }, // Indigo 500
  report: { icon: AlertTriangle, color: "#fb7185" }, // Rose 400
  ngo: { icon: ShieldCheck, color: "#0ea5e9" }, // Sky 500
  "r3p-damage": { icon: AlertTriangle, color: "#f43f5e" }, // Rose 500
};

export const SIDEBAR_GROUPS = [
  {
    id: "utama",
    labelKey: "utama",
    items: [
      { id: "missing-person", labelKey: "missing-person", icon: User, color: "#f43f5e" },
      { id: "tend-point", labelKey: "tend-point", icon: Tent, color: "#f59e0b" },
      { id: "posko", labelKey: "posko", icon: Warehouse, color: "#64748b" },
      { id: "police", labelKey: "police", icon: Shield, color: "#3b82f6" },
    ],
  },
  {
    id: "fasum",
    labelKey: "fasum",
    items: [
      { id: "Kesehatan", labelKey: "Kesehatan", icon: Stethoscope, color: "#e11d48" },
      { id: "Pendidikan", labelKey: "Pendidikan", icon: GraduationCap, color: "#2563eb" },
      { id: "Pemerintahan", labelKey: "Pemerintahan", icon: Building2, color: "#475569" },
      { id: "Keagamaan", labelKey: "Keagamaan", icon: Landmark, color: "#d97706" },
    ],
  },
  {
    id: "publik",
    labelKey: "publik",
    items: [
      { id: "jalan-rusak", labelKey: "jalan-rusak", icon: Construction, color: "#fb7185" },
      { id: "jembatan-rusak", labelKey: "jembatan-rusak", icon: Waves, color: "#fb7185" },
      { id: "helipad", labelKey: "helipad", icon: Flag, color: "#94a3b8" },
      { id: "starlink", labelKey: "starlink", icon: Wifi, color: "#60a5fa" },
      { id: "village", labelKey: "village", icon: Landmark, color: "#6366f1" },
      { id: "report", labelKey: "report", icon: AlertTriangle, color: "#fb7185" },
    ],
  },
];
