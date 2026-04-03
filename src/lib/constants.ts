import { Partner } from './types';


export const REGENCY_COORDINATES: Record<string, [number, number]> = {
  "Kota Banda Aceh": [5.5483, 95.3238],
  "Kabupaten Aceh Besar": [5.3833, 95.4667],
  "Kabupaten Pidie": [5.1833, 95.9167],
  "Kabupaten Pidie Jaya": [5.15, 96.2167],
  "Kabupaten Bireuen": [5.2, 96.7],
  "Kota Lhokseumawe": [5.1801, 97.1507],
  "Kabupaten Aceh Utara": [4.9167, 97.2],
  "Kabupaten Aceh Timur": [4.6333, 97.7667],
  "Kota Langsa": [4.4752, 97.965],
  "Kabupaten Aceh Tamiang": [4.25, 98.0833],
  "Kabupaten Bener Meriah": [4.7833, 96.8667],
  "Kabupaten Aceh Tengah": [4.625, 96.84],
  "Kabupaten Gayo Lues": [3.95, 97.35],
  "Kabupaten Aceh Tenggara": [3.3667, 97.8333],
  "Kabupaten Aceh Jaya": [4.7, 95.6],
  "Kabupaten Aceh Barat": [4.1449, 96.1265],
  "Kabupaten Nagan Raya": [4.1667, 96.4167],
  "Kabupaten Aceh Barat Daya": [3.8333, 96.8333],
  "Kabupaten Aceh Selatan": [3.25, 97.1833],
  "Kota Subulussalam": [2.6333, 97.9167],
  "Kabupaten Aceh Singkil": [2.4167, 97.9167],
  "Kabupaten Simeulue": [2.6167, 96.0833],
};

export const SECTOR_COLORS: Record<string, string> = {
  "Normalisasi Sungai": "#0ea5e9",
  "Jalan & Jembatan": "#8b5cf6",
  "Penyediaan Huntara": "#f59e0b",
  "Pembersihan Jalan Lingkungan": "#10b981",
};

export const PARTNERS_DATA: (Partner & { owner?: string })[] = [
  {
    id: 'p1',
    name: "Satuan Khusus Pembangunan Jembatan",
    owner: "Satuan Khusus Pembangunan Jembatan",
    category: 'Satgas',
    url: "/admin/partners/jembatan",
    imageSrc: "https://resilient-pixie-e74a8e.netlify.app/Logo%20MM.png",
  },
  {
    id: 'p2',
    name: "Satuan Tugas Khusus Garuda",
    owner: "Satuan Tugas Khusus Garuda",
    category: 'Satgas',
    url: "/admin/partners/garuda",
    imageSrc: "https://resilient-pixie-e74a8e.netlify.app/Logo%20MM.png",
  },
  {
    id: 'p3',
    name: "Satuan Tugas Rehabilitasi dan Rekonstruksi Pascabencana",
    owner: "Satuan Tugas Rehabilitasi dan Rekonstruksi Pascabencana",
    category: 'Satgas',
    url: "/admin/partners/kemendagri",
    imageSrc: "https://resilient-pixie-e74a8e.netlify.app/Logo%20MM.png",
  },
  {
    id: 'p4',
    name: "Satuan Tugas Pemulihan Pascabencana",
    owner: "Satuan Tugas Pemulihan Pascabencana",
    category: 'Satgas',
    url: "/admin/partners/dpr",
    imageSrc: "https://resilient-pixie-e74a8e.netlify.app/Logo%20MM.png",
  }
];