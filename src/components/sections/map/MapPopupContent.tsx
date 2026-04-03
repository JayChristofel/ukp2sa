import React from "react";
import Image from "next/image";
import { useMap } from "react-leaflet";
import {
  MapPin,
  Building2,
  Phone,
  Clock,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_CONFIG } from "./MapConfig";
import { useI18n } from "@/app/[lang]/providers";

interface MapPopupContentProps {
  marker: any;
}

export const MapPopupContent: React.FC<MapPopupContentProps> = ({ marker }) => {
  const dict = useI18n();
  const dm = dict?.map || {};
  const items = dm.items || {};
  const common = dict?.common || {};
  const { type, title, data } = marker;

  const getPhotos = () => {
    const raw =
      data.photos ||
      data.missingPersonPhotos ||
      data.photo ||
      data.image ||
      data.media;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      if (raw.startsWith("[") || raw.startsWith("{")) {
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [raw];
        }
      }
      return [raw];
    }
    return [raw];
  };

  const photos = getPhotos();

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
      <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[7px]">
        {children}
      </span>
    </div>
  );

  const Header = ({ categoryLabel, subtitle }: any) => {
    const config = CATEGORY_CONFIG[marker.markerType] || CATEGORY_CONFIG.report;
    const Icon = config.icon;
    const color = config.color;
    const map = useMap();

    return (
      <div className="p-3 flex flex-col gap-2 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-[20] border-b border-slate-100 dark:border-slate-800 relative">
        <button
          onClick={() => map.closePopup()}
          className="absolute top-2 right-2 size-7 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-all active:scale-95 z-[30]"
        >
          <X size={14} strokeWidth={3} />
        </button>
        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
          {categoryLabel}
        </span>
        <div className="flex items-start gap-2.5">
          <div
            className="size-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg border-b-2 border-black/10"
            style={{ backgroundColor: color }}
          >
            <Icon className="size-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="font-black text-slate-900 dark:text-white text-[12px] leading-tight mb-0.5 uppercase tracking-tight">
              {title}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">
              {subtitle}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              <Clock size={8} />
              <span>
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })
                  : "2 Jan"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MediaSection = () => (
    <>
      <SectionLabel>{common.media || "MEDIA"}</SectionLabel>
      <div className="p-1.5">
        <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          {photos.length > 0 ? (
            photos
              .slice(0, 4)
              .map((p: any, i: number) => (
                <Image
                  key={i}
                  src={p.url || p}
                  alt="Preview"
                  width={200}
                  height={64}
                  className="w-full h-16 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              ))
          ) : (
            <div className="col-span-2 h-20 flex items-center justify-center text-slate-300 dark:text-slate-700">
              <ImageIcon size={18} />
            </div>
          )}
        </div>
      </div>
    </>
  );

  const LocationBlock = () => (
    <div className="p-2">
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-2.5 flex gap-2.5 items-start">
        <div className="size-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
          <MapPin size={10} className="text-rose-500" />
        </div>
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-snug">
          {data.address ||
            data.location ||
            common.no_location ||
            "Lokasi tidak tersedia"}
        </span>
      </div>
    </div>
  );

  const PopupWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="p-0 min-w-[200px] max-w-[240px] max-h-[380px] overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col font-display bg-white dark:bg-slate-900 shadow-2xl rounded-2xl">
      {children}
    </div>
  );

  if (type === "missing-person" || type === "tend-point" || type === "posko") {
    const categoryLabel =
      type === "missing-person"
        ? (items["missing-person"] || "ORANG HILANG").toUpperCase()
        : type === "posko"
        ? (items.posko || "POSKO UTAMA").toUpperCase()
        : (items["tend-point"] || "TITIK PENGUNGSIAN").toUpperCase();

    const subtitle =
      type === "missing-person"
        ? `${data.missingPersonAge || "46"} thn • ${
            data.missingPersonGender || "P"
          }`
        : `${data.refugeeTotal || 0} ${common.refugees || "Pengungsi"} • ${
            data.picName || "PIC"
          }`;

    return (
      <PopupWrapper>
        <Header categoryLabel={categoryLabel} subtitle={subtitle} />
        <MediaSection />
        <LocationBlock />
        <div className="px-4 py-1.5 flex items-center gap-2 mb-1">
          <Phone size={12} className="text-primary" />
          <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {data.reporterName || data.picName || common.contact || "Kontak"}
          </span>
        </div>
        <SectionLabel>{common.detail || "DETAIL"}</SectionLabel>
        <div className="p-2.5 grid grid-cols-2 gap-2">
          {type === "missing-person" ? (
            <>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                <span className="text-[7px] font-black text-slate-400 uppercase block mb-0.5 whitespace-nowrap tracking-widest">
                  GENDER
                </span>
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">
                  {data.missingPersonGender || "-"}
                </span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                <span className="text-[7px] font-black text-slate-400 uppercase block mb-0.5 whitespace-nowrap tracking-widest">
                  STATUS
                </span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">
                  {data.missingPersonStatus || "Found"}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                <span className="text-[7px] font-black text-slate-400 uppercase block mb-0.5 whitespace-nowrap tracking-widest">
                  LAKI-LAKI
                </span>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">
                  {data.refugeeMaleCount || data.maleRefugee || 0}
                </span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
                <span className="text-[7px] font-black text-slate-400 uppercase block mb-0.5 whitespace-nowrap tracking-widest">
                  PEREMPUAN
                </span>
                <span className="text-[10px] font-black text-slate-900 dark:text-white">
                  {data.refugeeFemaleCount || data.femaleRefugee || 0}
                </span>
              </div>
            </>
          )}
        </div>
      </PopupWrapper>
    );
  }

  if (
    ["Kesehatan", "Pendidikan", "Pemerintahan", "Keagamaan", "police"].includes(
      type,
    )
  ) {
    return (
      <PopupWrapper>
        <Header
          categoryLabel={(
            items[type as keyof typeof items] || type
          ).toUpperCase()}
          subtitle={`${
            data.classification || items[type as keyof typeof items] || type
          } • ${data.damageScale || "Info"}`}
        />
        <MediaSection />
        <LocationBlock />
        <SectionLabel>{common.detail || "DETAIL"}</SectionLabel>
        <div className="p-2.5 space-y-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl flex gap-2 items-center">
            <div className="size-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
              <Building2 size={14} className="text-primary" />
            </div>
            <div>
              <span className="text-[7px] font-black text-slate-400 uppercase block mb-0.5 tracking-widest">
                TIPE
              </span>
              <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase">
                {data.classification ||
                  items[type as keyof typeof items] ||
                  "Fasilitas"}
              </span>
            </div>
          </div>
          <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl">
            <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              Skala:{" "}
              <span
                className={cn(
                  "font-black",
                  data.damageScale === "Tidak ada kerusakan"
                    ? "text-emerald-500"
                    : "text-rose-500",
                )}
              >
                {data.damageScale || "NA"}
              </span>
            </p>
          </div>
        </div>
      </PopupWrapper>
    );
  }

  // Default / Infrastructure Reports
  return (
    <PopupWrapper>
      <Header
        categoryLabel={(
          items[marker.markerType as keyof typeof items] ||
          marker.markerType ||
          "DETAIL"
        ).toUpperCase()}
        subtitle={`${
          data.classification ||
          items[marker.markerType as keyof typeof items] ||
          common.report ||
          "Laporan"
        } •`}
      />
      <MediaSection />
      <LocationBlock />
      {data.description && (
        <>
          <SectionLabel>{common.detail || "DETAIL"}</SectionLabel>
          <div className="p-3">
            <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-2 border-primary/20 pl-3">
              {data.description}
            </p>
          </div>
        </>
      )}
    </PopupWrapper>
  );
};
