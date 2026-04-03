import { createScriptClient } from '../lib/supabase-script';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seed Topics & Questions to Supabase
 * Run: npx tsx src/scripts/seed-questions.ts
 */

const topics = [
  { id: 10, name: { id: "Air Bersih", en: "Clean Water" } },
  { id: 11, name: { id: "Lingkungan", en: "Environment" } },
  { id: 5, name: { id: "Hunian", en: "Housing" } },
  { id: 12, name: { id: "Lingkungan Tidak Aman", en: "Unsafe Environment" } },
  { id: 13, name: { id: "Perlindungan Perempuan", en: "Women's Protection" } },
  { id: 14, name: { id: "Kebutuhan Perempuan", en: "Women's Needs" } },
  { id: 15, name: { id: "Pendataan Psikososial", en: "Psychosocial Data" } },
  { id: 16, name: { id: "Kebutuhan Lansia", en: "Elderly Needs" } },
  { id: 17, name: { id: "Kebutuhan Ibu Hamil & Menyusui", en: "Pregnant & Nursing Mothers Needs" } },
  { id: 18, name: { id: "Kebutuhan Masyarakat dengan Penyakit Kronis", en: "Chronic Illness Community Needs" } },
  { id: 19, name: { id: "Kebutuhan Masyarakat dengan Disabilitas Fisik/Sensorik", en: "Physical/Sensory Disability Community Needs" } },
  { id: 20, name: { id: "Kebutuhan Masyarakat dengan Disabilitas Mental/Psikologis", en: "Mental/Psychological Disability Community Needs" } },
  { id: 21, name: { id: "Manajemen Pengungsian", en: "Refugee Management" } },
  { id: 22, name: { id: "Laporan Anak Hilang", en: "Missing Child Report" } },
  { id: 23, name: { id: "Laporan Perlindungan Anak", en: "Child Protection Report" } },
  { id: 24, name: { id: "Dugaan Tindak Kriminal", en: "Alleged Criminal Acts" } },
  { id: 25, name: { id: "Potensi Konfik Sosial", en: "Potential Social Conflict" } },
  { id: 26, name: { id: "Banjir", en: "Flood" } },
  { id: 27, name: { id: "Longsor", en: "Landslide" } },
];

const questions = [
  // --- AIR BERSIH (Topic 10) ---
  {
    id: 101,
    topicId: 10,
    parentId: null,
    question: {
      id: "Apakah di tempat Anda tersedia fasilitas Mandi Cuci Kakus / toilet?",
      en: "Is there a toilet or washing facility available at your location?"
    },
    questionType: "single_choice",
    options: [
      { key: "none", label: { id: "Tidak ada", en: "None" } },
      { key: "bad_condition", label: { id: "Ada, namun kondisi sangat buruk (tidak ada pintu, sering tersumbat, air jarang)", en: "Available, but in very poor condition (no door, often clogged, scarce water)" } },
      { key: "communal", label: { id: "Ada, namun komunal (dipakai bersama)", en: "Available, but communal (shared)" } },
      { key: "good", label: { id: "Ada, kondisinya baik", en: "Available, in good condition" } }
    ],
    required: true
  },
  {
    id: 102,
    topicId: 10,
    parentId: null,
    question: {
      id: "Bagaimana kondisi Mandi Cuci Kakus / toilet di tempat Anda saat ini?",
      en: "What is the current condition of the washing and toilet facilities at your location?"
    },
    questionType: "single_choice",
    options: [
      { key: "critical", label: { id: "Kritis, tidak ada tempat untuk buang air sama sekali sehingga harus menggunakan botol, plastik, dll", en: "Critical, no place for waste disposal at all, must use bottles, plastic, etc." } },
      { key: "emergency_latrine", label: { id: "Menggunakan lubang galian sementara (latrin darurat)", en: "Using a temporary dug hole (emergency latrine)" } },
      { key: "public_toilet", label: { id: "Terdapat toilet/kamar mandi umum yang bisa digunakan bersama (toilet umum, toilet meunasah, toilet sungai, dll)", en: "There are public toilets/bathrooms that can be shared (public toilet, village mosque toilet, river toilet, etc.)" } },
      { key: "private_toilet", label: { id: "Terdapat toilet/kamar mandi di rumah sendiri yang berfungsi baik", en: "There is a functioning private toilet/bathroom at home" } }
    ],
    required: true
  },
  {
    id: 103,
    topicId: 10,
    parentId: null,
    question: {
      id: "Bagaimana kondisi perlengkapan kebersihan (sabun, shampo, sikat gigi, odol, dll) Anda?",
      en: "What is the condition of your hygiene kit (soap, shampoo, toothbrush, toothpaste, etc.)?"
    },
    questionType: "single_choice",
    options: [
      { key: "very_difficult", label: { id: "Mendapatkan perlengkapan kebersihan sangat sulit, tidak ada barang", en: "Very difficult to get hygiene supplies, no items available" } },
      { key: "rare_expensive", label: { id: "Perlengkapan kebersihan masih bisa didapat, namun langka dan mahal", en: "Hygiene supplies can still be obtained, but are rare and expensive" } },
      { key: "available_with_difficulty", label: { id: "Perlengkapan kebersihan tersedia, namun memiliki kesulitan membeli karena satu atau lain hal", en: "Hygiene supplies are available, but there are difficulties in purchasing them" } },
      { key: "no_problem", label: { id: "Perlengkapan kebersihan lengkap, tidak ada masalah", en: "Complete hygiene kit, no issues" } }
    ],
    required: true
  },
  {
    id: 104,
    topicId: 10,
    parentId: null,
    question: {
      id: "Bagaimana kondisi ketersediaan air bersih saat ini?",
      en: "What is the current state of clean water availability?"
    },
    questionType: "single_choice",
    options: [
      { key: "critical_no_water", label: { id: "Kritis, tidak ada air bersih sama sekali", en: "Critical, no clean water at all" } },
      { key: "smelly_cloudy", label: { id: "Ada air, namun keruh & bau", en: "Water is available, but cloudy and smelly" } },
      { key: "long_queue", label: { id: "Ada air, namun harus antre lama atau berjalan jauh (air bersih sulit didapat)", en: "Water is available, but requires long queues or walking far (difficult to obtain)" } },
      { key: "sufficient", label: { id: "Sumber air bersih tersedia cukup", en: "Sufficient clean water source available" } }
    ],
    required: true
  },
  {
    id: 105,
    topicId: 10,
    parentId: null,
    question: {
      id: "Apa sumber air utama yang digunakan saat ini?",
      en: "What is the primary water source being used currently?"
    },
    questionType: "single_choice",
    options: [
      { key: "none", label: { id: "Tidak ada air sama sekali", en: "No water at all" } },
      { key: "contaminated_well", label: { id: "Air sumur yang tercemar banjir & lumpur", en: "Well water contaminated by floods and mud" } },
      { key: "water_truck", label: { id: "Dipasok kendaraan tangki air", en: "Supplied by water tanker trucks" } },
      { key: "rain", label: { id: "Air hujan", en: "Rainwater" } },
      { key: "river", label: { id: "Air sungai", en: "River water" } },
      { key: "clean_well", label: { id: "Air sumur (bersih)", en: "Clean well water" } },
      { key: "pdam", label: { id: "Air PAM / PDAM (air pipa)", en: "Piped water (PAM / PDAM)" } },
      { key: "gallon", label: { id: "Air galon", en: "Gallon water" } },
      { key: "others", label: { id: "Lainnya (mohon jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 106,
    topicId: 10,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 107,
    topicId: 10,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 108,
    topicId: 10,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang paling diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 109,
    topicId: 10,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- LINGKUNGAN (Topic 11) ---
  {
    id: 111,
    topicId: 11,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi kebersihan lingkungan di tempat Anda",
      en: "Please briefly describe the current cleanliness of the environment at your location"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 112,
    topicId: 11,
    parentId: null,
    question: {
      id: "Bagaimana kondisi sampah di sekitar lokasi pemukiman / pengungsian Anda?",
      en: "What is the condition of waste disposal around your settlement / refugee camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "piling_up", label: { id: "Sampah menumpuk, tidak pernah dibersihkan sama sekali", en: "Waste is piling up, never cleaned at all" } },
      { key: "burned", label: { id: "Sampah dibakar dan/atau dikubur", en: "Waste is burned and/or buried" } },
      { key: "not_routine", label: { id: "Sampah sesekali diambil oleh petugas sampah, namun tidak rutin", en: "Waste is occasionally collected by sanitation officers, but not routinely" } },
      { key: "routine", label: { id: "Sampah rutin dibersihkan oleh petugas sampah", en: "Waste is routinely cleaned by sanitation officers" } }
    ],
    required: true
  },
  {
    id: 113,
    topicId: 11,
    parentId: null,
    question: {
      id: "Bagaimana kondisi nyamuk, lalat, dan tikus di sekitar lokasi pemukiman / pengungsian Anda?",
      en: "How is the situation with mosquitoes, flies, and rats around your settlement / refugee camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "flies", label: { id: "Banyak lalat", en: "Many flies" } },
      { key: "mosquitoes", label: { id: "Banyak nyamuk", en: "Many mosquitoes" } },
      { key: "rats", label: { id: "Banyak tikus", en: "Many rats" } },
      { key: "other_insects", label: { id: "Banyak serangga-serangga lainnya", en: "Many other insects" } }
    ],
    required: true
  },
  {
    id: 114,
    topicId: 11,
    parentId: null,
    question: {
      id: "Apakah ada genangan air yang tidak mengalir di sekitar lokasi pemukiman / pengungsian Anda?",
      en: "Is there any stagnant water around your settlement / refugee camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "clear_larvae", label: { id: "Banyak, airnya jernih dan banyak jentik nyamuk", en: "A lot, clear water with many mosquito larvae" } },
      { key: "black_smelly", label: { id: "Banyak, airnya hitam / keruh dan berbau busuk", en: "A lot, black/murky and foul-smelling water" } },
      { key: "dirty_insects", label: { id: "Ada, airnya keruh dan penuh dengan serangga & kotoran", en: "Some, murky water full of insects and dirt" } },
      { key: "none", label: { id: "Tidak ada genangan air", en: "No stagnant water" } }
    ],
    required: true
  },
  {
    id: 115,
    topicId: 11,
    parentId: null,
    question: {
      id: "Apakah ada gejala penyakit merebak di lokasi pemukiman / pengungsian Anda?",
      en: "Are there any disease symptoms spreading in your settlement / refugee camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "diarrhea", label: { id: "Mencret / diare parah pada banyak orang", en: "Severe diarrhea in many people" } },
      { key: "fever_joint", label: { id: "Demam tinggi, bintik merah, nyeri sendi pada banyak orang", en: "High fever, red spots, joint pain in many people" } },
      { key: "skin_itch", label: { id: "Gatal-gatal di kulit (terutama sela jari)", en: "Skin itching (especially between fingers)" } },
      { key: "flu_cough", label: { id: "Batuk & pilek pada banyak orang", en: "Cough and cold in many people" } },
      { key: "none", label: { id: "Tidak ada gejala penyakit apa pun", en: "No disease symptoms at all" } }
    ],
    required: true
  },
  {
    id: 116,
    topicId: 11,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 117,
    topicId: 11,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 118,
    topicId: 11,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang paling diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 119,
    topicId: 11,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- HUNIAN (Topic 5) ---
  {
    id: 51,
    topicId: 5,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi hunian / tempat pengungsian / tempat tinggal Anda saat ini?",
      en: "Please briefly describe the condition of your current housing / refugee camp / residence?"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 52,
    topicId: 5,
    parentId: null,
    question: {
      id: "Dimana Anda tidur malam ini?",
      en: "Where are you sleeping tonight?"
    },
    questionType: "single_choice",
    options: [
      { key: "outdoor", label: { id: "Di luar ruangan (tanpa atap, tanpa dinding)", en: "Outdoors (no roof, no walls)" } },
      { key: "tent", label: { id: "Di tenda darurat / terpal seadanya", en: "In an emergency tent / basic tarp" } },
      { key: "public_facility", label: { id: "Di fasilitas umum (masjid, sekolah)", en: "In public facilities (mosque, school)" } },
      { key: "official_shelter", label: { id: "Di pengungsian resmi yang dikelola oleh Pemerintah/NGO", en: "In an official shelter managed by the Government/NGO" } },
      { key: "relative_home", label: { id: "Menumpang di rumah kerabat, tetangga, teman dekat", en: "Staying with relatives, neighbors, or close friends" } },
      { key: "home", label: { id: "Sudah kembali ke rumah sendiri", en: "Already returned to own home" } }
    ],
    required: true
  },
  {
    id: 53,
    topicId: 5,
    parentId: null,
    question: {
      id: "Apakah ada golongan masyarakat rentan yang tidak memiliki hunian di lokasi Anda?",
      en: "Are there any vulnerable groups who do not have housing at your location?"
    },
    questionType: "single_choice",
    options: [
      { key: "infant", label: { id: "Bayi (0 - 2 tahun)", en: "Infants (0 - 2 years old)" } },
      { key: "toddler", label: { id: "Balita (2 - 5 tahun)", en: "Toddlers (2 - 5 years old)" } },
      { key: "pregnant", label: { id: "Ibu hamil", en: "Pregnant women" } },
      { key: "elderly", label: { id: "Lansia", en: "Elderly" } },
      { key: "physical_disability", label: { id: "Disabilitas fisik / sensorik", en: "Physical / sensory disability" } },
      { key: "mental_disability", label: { id: "Disabilitas mental", en: "Mental disability" } },
      { key: "none", label: { id: "Tidak ada (semua dewasa sehat)", en: "None (all healthy adults)" } }
    ],
    required: true
  },
  {
    id: 54,
    topicId: 5,
    parentId: null,
    question: {
      id: "Apa bantuan hunian yang paling mendesak saat ini?",
      en: "What is the most urgent housing assistance needed right now?"
    },
    questionType: "single_choice",
    options: [
      { key: "shelter_kit", label: { id: "Perlengkapan shelter (tenda darurat, terpal)", en: "Shelter kits (emergency tents, tarps)" } },
      { key: "lighting", label: { id: "Penerangan (lampu portabel, lampu solar, senter)", en: "Lighting (portable lamps, solar lights, flashlights)" } },
      { key: "sleeping_kit", label: { id: "Perlengkapan tidur (selimut, tikar, kasur lipat, kelambu nyamuk)", en: "Sleeping kits (blankets, mats, folding mattresses, mosquito nets)" } },
      { key: "cooking_kit", label: { id: "Perlengkapan masak (kompor portabel, panci, piring)", en: "Cooking kits (portable stoves, pots, plates)" } },
      { key: "rehab_tools", label: { id: "Peralatan rehabilitasi & rekonstruksi rumah (sekop, cangkul, ember besar)", en: "House rehabilitation & reconstruction tools (shovels, hoes, large buckets)" } },
      { key: "none", label: { id: "Tidak ada, sudah cukup semua", en: "None, everything is sufficient" } }
    ],
    required: true
  },
  {
    id: 55,
    topicId: 5,
    parentId: null,
    question: {
      id: "Apakah Anda memiliki kebutuhan untuk tinggal di Huntara saat ini?",
      en: "Do you have a need to stay in Temporary Housing (Huntara) currently?"
    },
    questionType: "boolean",
    required: true
  },
  {
    id: 56,
    topicId: 5,
    parentId: null,
    question: {
      id: "Bagaimana kondisi rumah Anda saat ini?",
      en: "What is the current condition of your house?"
    },
    questionType: "single_choice",
    options: [
      { key: "destroyed", label: { id: "Hancur total, hanyut, rata dengan tanah", en: "Totally destroyed, washed away, leveled with the ground" } },
      { key: "mud_buried", label: { id: "Utuh namun tertutup lumpur & tanah tebal", en: "Intact but covered in mud & thick soil" } },
      { key: "partial_collapsed", label: { id: "Sebagian atap & dinding roboh (tidak aman ditinggali)", en: "Partial roof & wall collapse (unsafe to live in)" } },
      { key: "damaged_unsafe", label: { id: "Struktur utuh, namun atap bocor, jendela pecah, daun pintu hilang (aman ditinggali, namun tidak nyaman)", en: "Structure intact, but leaking roof, broken windows, missing doors (safe to live in, but uncomfortable)" } },
      { key: "dirty_muddy", label: { id: "Kotor karena kemasukan air dan / atau lumpur tebal", en: "Dirty due to water and / or thick mud ingress" } },
      { key: "clean", label: { id: "Bersih & tidak masalah", en: "Clean & no issues" } }
    ],
    required: true
  },
  {
    id: 57,
    topicId: 5,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 58,
    topicId: 5,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 59,
    topicId: 5,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang paling diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 60,
    topicId: 5,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- LINGKUNGAN TIDAK AMAN ---
  {
    id: 121,
    topicId: 12,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat mengapa lingkungan Anda tidak aman",
      en: "Please briefly explain why your environment is unsafe"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 122,
    topicId: 12,
    parentId: null,
    question: {
      id: "Apa menurut Anda faktor UTAMA yang membuat lingkungan terasa tidak aman?",
      en: "What do you think is the PRIMARY factor making the environment feel unsafe?"
    },
    questionType: "single_choice",
    options: [
      { key: "darkness", label: { id: "Kondisi gelap gulita (tidak ada penerangan, tidak ada lampu sama sekali)", en: "Pitch black conditions (no lighting, no lamps at all)" } },
      { key: "crime", label: { id: "Banyak ancaman tindak kriminal (pencurian, penodongan, dll)", en: "Many threats of criminal acts (theft, mugging, etc.)" } },
      { key: "harassment", label: { id: "Adanya gangguan/pelecehan di sekitar lokasi pemukiman/pengungsian", en: "Presence of harassment around the settlement/refugee camp" } },
      { key: "wildlife", label: { id: "Ancaman binatang buas & ular", en: "Threat of wild animals & snakes" } },
      { key: "disaster_risk", label: { id: "Lokasi di pinggir tebing/pinggir sungai (ancaman longsor/banjir susulan)", en: "Location on cliff/river bank (threat of secondary landslides/floods)" } }
    ],
    required: true
  },
  {
    id: 123,
    topicId: 12,
    parentId: null,
    question: {
      id: "Lingkungan terasa tidak aman bagi kelompok apa saja?",
      en: "For which groups does the environment feel unsafe?"
    },
    questionType: "single_choice",
    options: [
      { key: "child", label: { id: "Anak kecil", en: "Small children" } },
      { key: "woman", label: { id: "Perempuan dewasa dan gadis remaja", en: "Adult women and teenage girls" } },
      { key: "man", label: { id: "Pria dewasa dan pria remaja", en: "Adult men and teenage boys" } },
      { key: "parents", label: { id: "Orang tua", en: "Parents" } },
      { key: "elderly", label: { id: "Lansia", en: "Elderly" } },
      { key: "disabled", label: { id: "Disabilitas", en: "People with disabilities" } }
    ],
    required: true
  },
  {
    id: 124,
    topicId: 12,
    parentId: null,
    question: {
      id: "Dimana lokasinya berada, pengungsian, lingkungan Huntara/Huntap, atau di pemukiman warga?",
      en: "Where is the location: refugee camp, Temporary Housing (Huntara/Huntap), or residential area?"
    },
    questionType: "single_choice",
    options: [
      { key: "shelter", label: { id: "Lingkungan pengungsian", en: "Refugee camp environment" } },
      { key: "house", label: { id: "Lingkungan Huntara/Huntap", en: "Temporary Housing environment" } },
      { key: "village", label: { id: "Lingkungan di pemukiman warga", en: "Residential area environment" } },
      { key: "isolated", label: { id: "Daerah terisolir", en: "Isolated area" } },
      { key: "other", label: { id: "Lainnya", en: "Others" } }
    ],
    required: true
  },
  {
    id: 125,
    topicId: 12,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 126,
    topicId: 12,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 127,
    topicId: 12,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 128,
    topicId: 12,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- PERLINDUNGAN PEREMPUAN (Topic 13) ---
  {
    id: 131,
    topicId: 13,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi perlindungan terhadap perempuan di tempat Anda saat ini",
      en: "Please briefly describe the condition of protection for women at your location currently"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 132,
    topicId: 13,
    parentId: null,
    question: {
      id: "Apakah ada kasus Kekerasan terhadap perempuan (termasuk KDRT) di lokasi Anda tinggal saat ini?",
      en: "Are there any cases of Violence Against Women (including domestic violence) in your current area?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ada", en: "Yes" } },
      { key: "no", label: { id: "Tidak ada", en: "No" } }
    ],
    required: true
  },
  {
    id: 133,
    topicId: 13,
    parentId: null,
    question: {
      id: "Tolong jelaskan sedikit perihal kasus tersebut",
      en: "Please explain briefly about the case"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 134,
    topicId: 13,
    parentId: null,
    question: {
      id: "Apakah perempuan & anak gadis merasa aman berjalan sendirian di lokasi tempat tinggal Anda?",
      en: "Do women and girls feel safe walking alone in your residential area?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 135,
    topicId: 13,
    parentId: null,
    question: {
      id: "Bagaimana privasi tidur & ruangan istirahat bagi perempuan & anak gadis?",
      en: "How is the sleeping privacy and resting space for women and girls?"
    },
    questionType: "single_choice",
    options: [
      { key: "one_room_mixed", label: { id: "Hanya ada satu ruangan, tidur bercampur baur antara laki-laki dan perempuan, tidak ada privasi", en: "Only one room, everyone sleeps together (mixed gender), no privacy" } },
      { key: "communal_no_door", label: { id: "Ada beberapa ruangan, namun semua dikhususkan sebagai kamar tidur komunal, tidak ada pintu / kunci pintu", en: "Several rooms available, but all are designated as communal bedrooms with no doors / locks" } },
      { key: "changing_room_no_door", label: { id: "Ada beberapa ruangan yang bisa menjadi ruang ganti / privasi, namun tidak ada pintu / kunci pintu", en: "Some rooms available for changing/privacy, but no doors / locks" } },
      { key: "private_room_locked", label: { id: "Ada ruang tidur khusus perempuan serta ruangan privat lainnya yang bisa dikunci", en: "Designated female-only bedrooms and other private rooms that can be locked" } }
    ],
    required: true
  },
  {
    id: 136,
    topicId: 13,
    parentId: null,
    question: {
      id: "Bagaimana kondisi toilet / Mandi Cuci Kakus untuk perempuan?",
      en: "What is the condition of the toilet / washing facilities for women?"
    },
    questionType: "single_choice",
    options: [
      { key: "dark_no_lock", label: { id: "Toilet gelap (tidak ada penerangan), tidak ada pintu / pintu tidak bisa dikunci, toilet tidak aman", en: "Dark toilet (no lighting), no door / cannot be locked, unsafe" } },
      { key: "locked_mixed", label: { id: "Toilet bisa dikunci, namun toilet campur", en: "Toilet can be locked, but it is mixed-gender" } },
      { key: "separated_far_isolated", label: { id: "Toilet terpisah antara laki-laki dengan perempuan, namun jaraknya jauh & sepi", en: "Separate toilets for men and women, but located far away and in isolated areas" } },
      { key: "separated_safe", label: { id: "Toilet terpisah antara laki-laki dengan perempuan dan aman", en: "Separate toilets for men and women, and safe" } }
    ],
    required: true
  },
  {
    id: 137,
    topicId: 13,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 138,
    topicId: 13,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 139,
    topicId: 13,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 140,
    topicId: 13,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- KEBUTUHAN PEREMPUAN (Topic 14) ---
  {
    id: 141,
    topicId: 14,
    parentId: null,
    question: {
      id: "Apakah tersedia pembalut perempuan di lokasi Anda berada saat ini?",
      en: "Are sanitary pads available at your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "none", label: { id: "Tidak tersedia sama sekali", en: "Not available at all" } },
      { key: "contaminated", label: { id: "Tersedia, namun tercemar/kotor", en: "Available, but contaminated/dirty" } },
      { key: "low", label: { id: "Tersedia, namun tinggal sedikit", en: "Available, but running low" } },
      { key: "sufficient", label: { id: "Tersedia dan cukup", en: "Available and sufficient" } }
    ],
    required: true
  },
  {
    id: 142,
    topicId: 14,
    parentId: null,
    question: {
      id: "Apakah tersedia pakaian dalam ganti perempuan?",
      en: "Is there replacement underwear for women available?"
    },
    questionType: "single_choice",
    options: [
      { key: "none", label: { id: "Tidak tersedia sama sekali", en: "Not available at all" } },
      { key: "contaminated", label: { id: "Tersedia, namun tercemar/kotor", en: "Available, but contaminated/dirty" } },
      { key: "low", label: { id: "Tersedia, namun tinggal sedikit", en: "Available, but running low" } },
      { key: "clean", label: { id: "Tersedia dan bersih", en: "Available and clean" } }
    ],
    required: true
  },
  {
    id: 143,
    topicId: 14,
    parentId: null,
    question: {
      id: "Apakah tersedia pakaian ganti untuk dikenakan?",
      en: "Are there replacement clothes available to wear?"
    },
    questionType: "single_choice",
    options: [
      { key: "none", label: { id: "Tidak tersedia sama sekali", en: "Not available at all" } },
      { key: "contaminated", label: { id: "Tersedia, namun tercemar/kotor", en: "Available, but contaminated/dirty" } },
      { key: "low", label: { id: "Tersedia, namun tinggal sedikit", en: "Available, but running low" } },
      { key: "clean", label: { id: "Tersedia dan bersih", en: "Available and clean" } }
    ],
    required: true
  },
  {
    id: 144,
    topicId: 14,
    parentId: null,
    question: {
      id: "Bagaimana privasi tidur & ruangan istirahat bagi perempuan & anak gadis?",
      en: "How is the sleeping privacy and resting space for women and girls?"
    },
    questionType: "single_choice",
    options: [
      { key: "one_room_mixed", label: { id: "Hanya ada satu ruangan, tidur bercampur baur antara laki-laki dan perempuan, tidak ada privasi", en: "Only one room, everyone sleeps together (mixed gender), no privacy" } },
      { key: "communal_no_door", label: { id: "Ada beberapa ruangan, namun semua dikhususkan sebagai kamar tidur komunal, tidak ada pintu / kunci pintu", en: "Several rooms available, but all are designated as communal bedrooms with no doors / locks" } },
      { key: "changing_room_no_door", label: { id: "Ada beberapa ruangan yang bisa menjadi ruang ganti / privasi, namun tidak ada pintu / kunci pintu", en: "Some rooms available for changing/privacy, but no doors / locks" } },
      { key: "private_room_locked", label: { id: "Ada ruang tidur khusus perempuan serta ruangan privat lainnya yang bisa dikunci", en: "Designated female-only bedrooms and other private rooms that can be locked" } }
    ],
    required: true
  },
  {
    id: 145,
    topicId: 14,
    parentId: null,
    question: {
      id: "Bagaimana kondisi toilet / Mandi Cuci Kakus untuk perempuan?",
      en: "What is the condition of the toilet / washing facilities for women?"
    },
    questionType: "single_choice",
    options: [
      { key: "dark_no_lock", label: { id: "Toilet gelap (tidak ada penerangan), tidak ada pintu / pintu tidak bisa dikunci, toilet tidak aman", en: "Dark toilet (no lighting), no door / cannot be locked, unsafe" } },
      { key: "locked_mixed", label: { id: "Toilet bisa dikunci, namun toilet campur", en: "Toilet can be locked, but it is mixed-gender" } },
      { key: "separated_far_isolated", label: { id: "Toilet terpisah antara laki-laki dengan perempuan, namun jaraknya jauh & sepi", en: "Separate toilets for men and women, but located far away and in isolated areas" } },
      { key: "separated_safe", label: { id: "Toilet terpisah antara laki-laki dengan perempuan dan aman", en: "Separate toilets for men and women, and safe" } }
    ],
    required: true
  },
  {
    id: 146,
    topicId: 14,
    parentId: null,
    question: {
      id: "Apabila ada ibu hamil di lokasi Anda, mohon tuliskan kebutuhannya",
      en: "If there are pregnant women at your location, please write down their needs"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 147,
    topicId: 14,
    parentId: null,
    question: {
      id: "Apabila ada ibu menyusui di lokasi Anda, mohon tuliskan kebutuhannya",
      en: "If there are nursing mothers at your location, please write down their needs"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 148,
    topicId: 14,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 149,
    topicId: 14,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 150,
    topicId: 14,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 151,
    topicId: 14,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- PENDATAAN PSIKOSOSIAL (Topic 15) ---
  {
    id: 161,
    topicId: 15,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi psikologis Anda / warga saat ini",
      en: "Please briefly describe the current psychological condition of yourself / the residents"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 162,
    topicId: 15,
    parentId: null,
    question: {
      id: "Bagaimana kualitas tidur Anda / warga saat ini?",
      en: "What is the quality of sleep for you / the residents currently?"
    },
    questionType: "single_choice",
    options: [
      { key: "insomnia", label: { id: "Insomnia berat (hampir tidak bisa tidur sama sekali karena takut / waspada)", en: "Severe insomnia (almost cannot sleep at all due to fear / alertness)" } },
      { key: "nightmare", label: { id: "Sering mimpi buruk (bisa tidur, namun sangat sering terbangun karena mimpi buruk banjir / longsor / tsunami)", en: "Frequent nightmares (can sleep, but often wake up due to nightmares of floods / landslides / tsunami)" } },
      { key: "restless", label: { id: "Gangguan tidur (bisa tidur, namun jarang nyenyak karena tidak nyaman)", en: "Sleep disturbance (can sleep, but rarely soundly due to discomfort)" } },
      { key: "normal", label: { id: "Tidur normal", en: "Normal sleep" } }
    ],
    required: true
  },
  {
    id: 163,
    topicId: 15,
    parentId: null,
    question: {
      id: "Bagaimana kondisi Anda / warga sehari-hari pasca bencana?",
      en: "What is the daily condition of you / the residents after the disaster?"
    },
    questionType: "single_choice",
    options: [
      { key: "hysteria", label: { id: "Sering histeris atau menangis tiba-tiba saat mengingat bencana", en: "Often hysterical or crying suddenly when remembering the disaster" } },
      { key: "anxiety", label: { id: "Sering melamun serta menjadi cemas saat melihat / mendengar hujan", en: "Often daydreaming and becoming anxious when seeing / hearing rain" } },
      { key: "avoidance", label: { id: "Menolak membicarakan bencana sama sekali", en: "Refusing to talk about the disaster at all" } },
      { key: "sharing", label: { id: "Curhat dan sharing menjadi penting dalam rangka pemulihan", en: "Venting and sharing become important for recovery" } }
    ],
    required: true
  },
  {
    id: 164,
    topicId: 15,
    parentId: null,
    question: {
      id: "Apakah Anda / warga kehilangan energi?",
      en: "Do you / the residents feel a loss of energy?"
    },
    questionType: "single_choice",
    options: [
      { key: "withdrawn", label: { id: "Seringkali berdiam diri di rumah / pengungsian / tenda, sulit bersosialisasi, sulit beribadah, tatapan kosong", en: "Often staying silent at home / shelter / tent, difficult to socialize or worship, blank stare" } },
      { key: "lethargic", label: { id: "Ingin beraktivitas namun cepat lelah dan tidak bersemangat", en: "Wanting to be active but getting tired quickly and lacking enthusiasm" } },
      { key: "sadness", label: { id: "Seringkali menghabiskan energi dengan menangis dan kecewa", en: "Often spending energy crying and feeling disappointed" } },
      { key: "resilient", label: { id: "Tidak, sering berkumpul, memasak bersama, mengaji, dan mulai membangun kembali", en: "No, often gathering, cooking together, reciting scriptures, and starting to rebuild" } }
    ],
    required: true
  },
  {
    id: 165,
    topicId: 15,
    parentId: null,
    question: {
      id: "Apakah Anda / warga kerap kali berperilaku membahayakan nyawa (diri sendiri maupun orang lain)?",
      en: "Do you / the residents often behave in ways that endanger lives (self or others)?"
    },
    questionType: "single_choice",
    options: [
      { key: "suicidal", label: { id: "Ada keinginan mati, menyusul keluarga yang wafat, atau tidak nafsu makan / menolak makan sama sekali", en: "Having suicidal thoughts, wanting to join deceased family members, or refusing to eat" } },
      { key: "hallucination", label: { id: "Mulai meracau, melantur, dan mendengar bisikan", en: "Starting to rave, talk incoherently, and hear whispers" } },
      { key: "hostile", label: { id: "Mudah tersinggung, mudah marah, dan sering berdebat / bertengkar di luar kebiasaan", en: "Easily offended, easily angered, and often arguing/fighting beyond typical habits" } },
      { key: "safe", label: { id: "Tidak ada, situasi aman terkendali, warga akur", en: "None, situation is safe and controlled, residents are harmonious" } }
    ],
    required: true
  },
  {
    id: 166,
    topicId: 15,
    parentId: null,
    question: {
      id: "Apa yang menjadi kekhawatiran ekonomi Anda / warga?",
      en: "What are the economic concerns for you / the residents?"
    },
    questionType: "single_choice",
    options: [
      { key: "capital_loss", label: { id: "Modal usaha habis sama sekali, bingung mau mulai dari mana", en: "Business capital completely gone, confused about where to start" } },
      { key: "debt", label: { id: "Memiliki hutang dan cicilan yang berjalan terus, namun tidak mampu membayar karena bencana", en: "Having ongoing debts and installments but unable to pay due to the disaster" } },
      { key: "income_instability", label: { id: "Ketidakpastian pemasukan karena bencana (baik wirausaha, buruh, maupun karyawan)", en: "Income uncertainty due to the disaster (entrepreneurs, laborers, or employees)" } },
      { key: "inflation", label: { id: "Harga barang dan jasa naik gila-gilaan, jauh melebihi pemasukan", en: "Skyrocketing prices of goods and services, far exceeding income" } },
      { key: "repair_cost", label: { id: "Fokus pada biaya perbaikan rumah", en: "Focusing on house repair costs" } },
      { key: "none", label: { id: "Tidak ada", en: "None" } }
    ],
    required: true
  },
  {
    id: 167,
    topicId: 15,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 168,
    topicId: 15,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 169,
    topicId: 15,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 170,
    topicId: 15,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- KEBUTUHAN LANSIA (Topic 16) ---
  {
    id: 181,
    topicId: 16,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi lansia saat ini",
      en: "Please briefly describe the current condition of the elderly"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 182,
    topicId: 16,
    parentId: null,
    question: {
      id: "Jenis Kelamin Lansia",
      en: "Gender of the Elderly"
    },
    questionType: "single_choice",
    options: [
      { key: "male", label: { id: "Laki-laki", en: "Male" } },
      { key: "female", label: { id: "Perempuan", en: "Female" } }
    ],
    required: true
  },
  {
    id: 183,
    topicId: 16,
    parentId: null,
    question: {
      id: "Bagaimana kemampuan bergerak lansia saat ini?",
      en: "How is the mobility of the elderly currently?"
    },
    questionType: "single_choice",
    options: [
      { key: "bedrest", label: { id: "Bedrest (hanya bisa berbaring di kasur)", en: "Bedrest (can only lie in bed)" } },
      { key: "wheelchair_bound", label: { id: "Tidak bisa jalan (membutuhkan kursi roda)", en: "Cannot walk (requires a wheelchair)" } },
      { key: "aid_needed", label: { id: "Bisa berjalan, namun butuh alat bantu (tongkat, walker kaki empat, dll)", en: "Can walk, but needs assistive devices (cane, four-legged walker, etc.)" } },
      { key: "slow_walking", label: { id: "Bisa berjalan tanpa bantuan, namun harus pelan-pelan", en: "Can walk without assistance, but must go slowly" } },
      { key: "no_problem", label: { id: "Tidak ada masalah, kuat semua", en: "No problems, still strong" } }
    ],
    required: true
  },
  {
    id: 184,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apakah para lansia memiliki kesulitan makan makanan bantuan?",
      en: "Do the elderly have difficulty eating aid food?"
    },
    questionType: "single_choice",
    options: [
      { key: "cannot_eat", label: { id: "Tidak bisa makan sama sekali (ompong, sulit menelan)", en: "Cannot eat at all (toothless, difficulty swallowing)" } },
      { key: "health_restriction", label: { id: "Tidak bisa makan karena pantangan penyakit (darah tinggi, gula darah tinggi, kolestrol, masalah jantung, dll)", en: "Cannot eat due to health restrictions (hypertension, high blood sugar, cholesterol, heart issues, etc.)" } },
      { key: "difficulty_eating", label: { id: "Kesulitan makan (karena ompong, sakit, atau alasan lainnya)", en: "Difficulty eating (due to missing teeth, illness, or other reasons)" } },
      { key: "eat_anything", label: { id: "Bisa makan apa pun", en: "Can eat anything" } }
    ],
    required: true
  },
  {
    id: 185,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apakah para lansia masih bisa menahan buang air?",
      en: "Can the elderly still control their bowel/bladder movements?"
    },
    questionType: "single_choice",
    options: [
      { key: "incontinent", label: { id: "Tidak mampu ke WC sama sekali, terpaksa buang air di tempat", en: "Unable to go to the toilet at all, forced to soil themselves" } },
      { key: "assistance_needed", label: { id: "Perlu asistensi pada saat ingin buang air", en: "Requires assistance when needing to use the toilet" } },
      { key: "independent", label: { id: "Bisa ke WC secara mandiri", en: "Can go to the toilet independently" } }
    ],
    required: true
  },
  {
    id: 186,
    topicId: 16,
    parentId: null,
    question: {
      id: "Tolong sebutkan kebutuhan mobilitas (bantu gerak) lansia",
      en: "Please specify the mobility (movement aid) needs of the elderly"
    },
    questionType: "single_choice",
    options: [
      { key: "wheelchair", label: { id: "Kursi roda", en: "Wheelchair" } },
      { key: "walker", label: { id: "Walker (tongkat kaki empat)", en: "Walker (four-legged cane)" } },
      { key: "walking_stick", label: { id: "Tongkat bantu jalan", en: "Walking stick" } },
      { key: "none", label: { id: "Tidak butuh alat bantu mobilitas", en: "No mobility aids needed" } }
    ],
    required: true
  },
  {
    id: 187,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apakah lansia membutuhkan kacamata rabun?",
      en: "Do the elderly need reading glasses?"
    },
    questionType: "single_choice",
    options: [
      { key: "near_vision", label: { id: "Ya, untuk rabun dekat", en: "Yes, for near-sightedness" } },
      { key: "far_vision", label: { id: "Ya, untuk rabun jauh", en: "Yes, for far-sightedness" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 188,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apa kebutuhan obat-obatan rutin lansia yang wajib diminum tiap hari?",
      en: "What are the routine medications that the elderly must take every day?"
    },
    questionType: "single_choice",
    options: [
      { key: "hypertension", label: { id: "Hipertensi (darah tinggi)", en: "Hypertension (high blood pressure)" } },
      { key: "diabetes", label: { id: "Diabetes (gula)", en: "Diabetes (sugar)" } },
      { key: "heart", label: { id: "Obat jantung", en: "Heart medication" } },
      { key: "asthma", label: { id: "Obat asma / paru", en: "Asthma / lung medication" } },
      { key: "kidney", label: { id: "Obat ginjal", en: "Kidney medication" } },
      { key: "rheumatism", label: { id: "Obat reumatik", en: "Rheumatism medication" } },
      { key: "others", label: { id: "Lainnya", en: "Others" } },
      { key: "none", label: { id: "Tidak ada kebutuhan obat", en: "No medication needed" } },
      { key: "other_explained", label: { id: "Lainnya (jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 189,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apakah lansia memiliki akses yang mudah ke fasilitas kesehatan?",
      en: "Do the elderly have easy access to health facilities?"
    },
    questionType: "single_choice",
    options: [
      { key: "easy", label: { id: "Mudah", en: "Easy" } },
      { key: "hard", label: { id: "Sulit", en: "Difficult" } }
    ],
    required: true
  },
  {
    id: 190,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apabila sulit, mohon jelaskan kenapa",
      en: "If difficult, please explain why"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 191,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apakah lansia membutuhkan popok dewasa?",
      en: "Do the elderly need adult diapers?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 192,
    topicId: 16,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 193,
    topicId: 16,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 194,
    topicId: 16,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 195,
    topicId: 16,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- KEBUTUHAN IBU HAMIL & MENYUSUI (Topic 17) ---
  {
    id: 201,
    topicId: 17,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi ibu hamil / ibu menyusui saat ini",
      en: "Please briefly describe the current condition of pregnant / nursing mothers"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 202,
    topicId: 17,
    parentId: null,
    question: {
      id: "Apakah seluruh ibu hamil & ibu menyusui memiliki akses makanan yang cukup?",
      en: "Do all pregnant / nursing mothers have access to sufficient food?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 203,
    topicId: 17,
    parentId: null,
    question: {
      id: "Apa yang dibutuhkan oleh ibu hamil / ibu menyusui namun saat ini tidak tersedia?",
      en: "What do pregnant / nursing mothers need that is currently unavailable?"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 204,
    topicId: 17,
    parentId: null,
    question: {
      id: "Apakah Ibu hamil / Ibu menyusui memiliki akses yang mudah ke fasilitas kesehatan / bidan melahirkan?",
      en: "Do pregnant / nursing mothers have easy access to health facilities / midwives?"
    },
    questionType: "single_choice",
    options: [
      { key: "easy", label: { id: "Mudah", en: "Easy" } },
      { key: "hard", label: { id: "Sulit", en: "Difficult" } }
    ],
    required: true
  },
  {
    id: 205,
    topicId: 17,
    parentId: null,
    question: {
      id: "Apabila sulit, mohon jelaskan kenapa",
      en: "If difficult, please explain why"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 206,
    topicId: 17,
    parentId: null,
    question: {
      id: "Apakah tersedia ruangan khusus untuk ibu menyusui di tempat Anda (pengungsian, Huntara, hunian)?",
      en: "Is there a dedicated room for nursing mothers at your location (shelter, Temporary Housing, residence)?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 207,
    topicId: 17,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 208,
    topicId: 17,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 209,
    topicId: 17,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 210,
    topicId: 17,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- KEBUTUHAN MASYARAKAT DENGAN PENYAKIT KRONIS (Topic 18) ---
  {
    id: 221,
    topicId: 18,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi penyakit Anda / warga saat ini",
      en: "Please briefly describe the current chronic illness condition of yourself / the residents"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 222,
    topicId: 18,
    parentId: null,
    question: {
      id: "Mana dari obat-obatan di samping yang stoknya sudah habis namun dibutuhkan oleh warga?",
      en: "Which of these medications are out of stock but needed by the residents?"
    },
    questionType: "single_choice",
    options: [
      { key: "hypertension", label: { id: "Hipertensi (darah tinggi)", en: "Hypertension (high blood pressure)" } },
      { key: "diabetes", label: { id: "Diabetes (gula)", en: "Diabetes (sugar)" } },
      { key: "heart", label: { id: "Obat jantung", en: "Heart medication" } },
      { key: "asthma", label: { id: "Obat asma / paru", en: "Asthma / lung medication" } },
      { key: "kidney", label: { id: "Obat ginjal", en: "Kidney medication" } },
      { key: "rheumatism", label: { id: "Obat reumatik", en: "Rheumatism medication" } },
      { key: "none", label: { id: "Tidak ada kebutuhan obat kronis", en: "No chronic medication needed" } },
      { key: "other_explained", label: { id: "Lainnya (jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 223,
    topicId: 18,
    parentId: null,
    question: {
      id: "Apabila ada penyakit kronis lainnya yang tidak membutuhkan obat namun butuh perawatan intensif, tolong ceritakan di sini",
      en: "If there are other chronic illnesses that do not require medication but need intensive care, please describe here"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 224,
    topicId: 18,
    parentId: null,
    question: {
      id: "Apakah Anda / warga membutuhkan popok dewasa?",
      en: "Do you / the residents need adult diapers?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 225,
    topicId: 18,
    parentId: null,
    question: {
      id: "Tolong sebutkan kebutuhan mobilitas (bantu gerak) Anda / warga",
      en: "Please specify the mobility (movement aid) needs of yourself / the residents"
    },
    questionType: "single_choice",
    options: [
      { key: "wheelchair", label: { id: "Kursi roda", en: "Wheelchair" } },
      { key: "walker", label: { id: "Walker (tongkat kaki empat)", en: "Walker (four-legged cane)" } },
      { key: "walking_stick", label: { id: "Tongkat bantu jalan", en: "Walking stick" } },
      { key: "none", label: { id: "Tidak butuh alat bantu mobilitas", en: "No mobility aids needed" } }
    ],
    required: true
  },
  {
    id: 226,
    topicId: 18,
    parentId: null,
    question: {
      id: "Apakah Anda / warga memiliki akses yang mudah ke fasilitas kesehatan?",
      en: "Do you / the residents have easy access to health facilities?"
    },
    questionType: "single_choice",
    options: [
      { key: "easy", label: { id: "Mudah", en: "Easy" } },
      { key: "hard", label: { id: "Sulit", en: "Difficult" } }
    ],
    required: true
  },
  {
    id: 227,
    topicId: 18,
    parentId: null,
    question: {
      id: "Apabila sulit, mohon jelaskan kenapa",
      en: "If difficult, please explain why"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 228,
    topicId: 18,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 229,
    topicId: 18,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 230,
    topicId: 18,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 231,
    topicId: 18,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- KEBUTUHAN MASYARAKAT DENGAN DISABILITAS FISIK / SENSORIK (Topic 19) ---
  {
    id: 232,
    topicId: 19,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi penyandang disabilitas fisik / sensorik saat ini",
      en: "Please briefly describe the current condition of people with physical / sensory disabilities"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 233,
    topicId: 19,
    parentId: null,
    question: {
      id: "Mohon pilih kategori disabilitas fisik / sensorik yang dimiliki oleh penyandang disabilitas",
      en: "Please select the category of physical / sensory disability for the individual"
    },
    questionType: "single_choice",
    options: [
      { key: "blind", label: { id: "Tuna netra (tidak bisa melihat, buta)", en: "Visually impaired (blind)" } },
      { key: "deaf", label: { id: "Tuna rungu (tidak bisa mendengar, tuli)", en: "Hearing impaired (deaf)" } },
      { key: "speech_impaired", label: { id: "Tuna wicara (tidak bisa bicara, bisu)", en: "Speech impaired" } },
      { key: "physical_disability", label: { id: "Tuna daksa (memiliki keterbatasan gerak tubuh, buntung)", en: "Physically disabled / limited mobility" } },
      { key: "paralyzed", label: { id: "Lumpuh badan", en: "Paralyzed" } },
      { key: "others", label: { id: "Lainnya", en: "Others" } }
    ],
    required: true
  },
  {
    id: 234,
    topicId: 19,
    parentId: null,
    question: {
      id: "Apakah penyandang disabilitas fisik / sensorik membutuhkan popok dewasa?",
      en: "Do people with physical / sensory disabilities need adult diapers?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 235,
    topicId: 19,
    parentId: null,
    question: {
      id: "Apakah penyandang disabilitas fisik / sensorik memiliki akses yang mudah ke fasilitas kesehatan?",
      en: "Do people with physical / sensory disabilities have easy access to health facilities?"
    },
    questionType: "single_choice",
    options: [
      { key: "easy", label: { id: "Mudah", en: "Easy" } },
      { key: "hard", label: { id: "Sulit", en: "Difficult" } }
    ],
    required: true
  },
  {
    id: 236,
    topicId: 19,
    parentId: null,
    question: {
      id: "Apabila sulit, mohon jelaskan kenapa",
      en: "If difficult, please explain why"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 237,
    topicId: 19,
    parentId: null,
    question: {
      id: "Tolong sebutkan kebutuhan mobilitas (bantu gerak) penyandang disabilitas fisik / sensorik",
      en: "Please specify the mobility (movement aid) needs of people with physical / sensory disabilities"
    },
    questionType: "single_choice",
    options: [
      { key: "wheelchair", label: { id: "Kursi roda", en: "Wheelchair" } },
      { key: "walker", label: { id: "Walker (tongkat kaki empat)", en: "Walker (four-legged cane)" } },
      { key: "walking_stick", label: { id: "Tongkat bantu jalan", en: "Walking stick" } },
      { key: "none", label: { id: "Tidak butuh alat bantu mobilitas", en: "No mobility aids needed" } }
    ],
    required: true
  },
  {
    id: 238,
    topicId: 19,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 239,
    topicId: 19,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 240,
    topicId: 19,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 241,
    topicId: 19,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- KEBUTUHAN MASYARAKAT DENGAN DISABILITAS MENTAL / PSIKOLOGIS (Topic 20) ---
  {
    id: 251,
    topicId: 20,
    parentId: null,
    question: {
      id: "Apakah penyandang disabilitas mental / psikis dalam keadaan dipasung / dikurung?",
      en: "Is the person with mental / psychological disabilities currently shackled / confined?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya", en: "Yes" } },
      { key: "no", label: { id: "Tidak", en: "No" } }
    ],
    required: true
  },
  {
    id: 252,
    topicId: 20,
    parentId: null,
    question: {
      id: "Mohon ceritakan secara singkat bagaimana kondisi penyandang disabilitas mental / psikis saat ini",
      en: "Please briefly describe the current condition of the person with mental / psychological disabilities"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 253,
    topicId: 20,
    parentId: null,
    question: {
      id: "Tolong sebutkan jenis disabilitas mental / psikis yang dialami",
      en: "Please specify the type of mental / psychological disability experienced"
    },
    questionType: "single_choice",
    options: [
      { key: "schizophrenia", label: { id: "Schizophrenia", en: "Schizophrenia" } },
      { key: "autism", label: { id: "Autisme (Autism Spectrum Disorder)", en: "Autism (Autism Spectrum Disorder)" } },
      { key: "alzheimer", label: { id: "Alzheimer", en: "Alzheimer's" } },
      { key: "intellectual", label: { id: "Disabilitas intelektual (Down's Syndrome)", en: "Intellectual disability (Down Syndrome)" } },
      { key: "others", label: { id: "Lainnya", en: "Others" } }
    ],
    required: true
  },
  {
    id: 254,
    topicId: 20,
    parentId: null,
    question: {
      id: "Apabila ada obat khusus yang perlu diminum, tolong jelaskan dengan lebih detail",
      en: "If there is specific medication that needs to be taken, please explain in more detail"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 255,
    topicId: 20,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 256,
    topicId: 20,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 257,
    topicId: 20,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 258,
    topicId: 20,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },


  // --- MANAJEMEN PENGUNGSIAN (Topic 21) ---
  {
    id: 261,
    topicId: 21,
    parentId: null,
    question: {
      id: "Tolong jelaskan situasi & kondisi kamp pengungsian saat ini",
      en: "Please explain the current situation & condition of the displacement camp"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 262,
    topicId: 21,
    parentId: null,
    question: {
      id: "Oleh pihak mana kamp pengungsian saat ini dikelola?",
      en: "Who currently manages the displacement camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "community_independent", label: { id: "Kamp pengungsian dikelola warga secara mandiri, tidak ada penanggungjawab", en: "Camp is managed independently by residents, no designated person in charge" } },
      { key: "community_responsible", label: { id: "Kamp pengungsian dikelola warga, namun ada yang menjadi penanggungjawab", en: "Camp is managed by residents, but there is a designated person in charge" } },
      { key: "community_guided", label: { id: "Kamp pengungsian dikelola warga, namun dengan arahan dari Pemda / Pemkab / Institusi pemerintah / NGO & CSO", en: "Camp is managed by residents with guidance from Local Government / institutions / NGOs & CSOs" } },
      { key: "ngo_managed", label: { id: "Kamp pengungsian dikelola NGO / CSO / LSM", en: "Camp is managed by NGOs / CSOs" } },
      { key: "government_managed", label: { id: "Kamp pengungsian dikelola Pemerintah (Pusat / Pemda / Pemkab)", en: "Camp is managed by the Government (Central / Local)" } }
    ],
    required: true
  },
  {
    id: 263,
    topicId: 21,
    parentId: null,
    question: {
      id: "Tolong masukkan nomor kontak (telepon / WhatsApp) kamp pengungsian yang bisa dihubungi",
      en: "Please enter the contact number (phone / WhatsApp) for the displacement camp"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 264,
    topicId: 21,
    parentId: null,
    question: {
      id: "Apakah pengungsi berasal dari Gampong yang sama?",
      en: "Do the displaced people come from the same village?"
    },
    questionType: "single_choice",
    options: [
      { key: "same_village", label: { id: "Ya (berasal dari Gampong / Desa / Kelurahan yang sama)", en: "Yes (from the same village / sub-district)" } },
      { key: "different_villages", label: { id: "Tidak (berasal dari Gampong / Desa / Kelurahan yang berbeda-beda)", en: "No (from different villages / sub-districts)" } },
      { key: "unknown", label: { id: "Tidak tahu", en: "Unknown" } }
    ],
    required: true
  },
  {
    id: 265,
    topicId: 21,
    parentId: null,
    question: {
      id: "Apakah di kamp pengungsian ada Komite yang mewakili suara warga?",
      en: "Is there a committee representing the residents' voices in the camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "no_committee", label: { id: "Tidak ada Komite, tidak ada instruksi", en: "No committee, no instructions" } },
      { key: "follows_manager", label: { id: "Tidak ada Komite, hanya mengikuti instruksi pengelola kamp", en: "No committee, just follows camp manager's instructions" } },
      { key: "appointed_committee", label: { id: "Ada Komite, namun ditunjuk oleh pengelola kamp", en: "Committee exists but is appointed by the camp manager" } },
      { key: "consensus_committee", label: { id: "Ada Komite yang melalui proses musyawarah mufakat warga kamp pengungsian", en: "Committee exists through a consensus process among camp residents" } }
    ],
    required: true
  },
  {
    id: 266,
    topicId: 21,
    parentId: null,
    question: {
      id: "Apakah perempuan dilibat secara aktif dalam manajemen kamp?",
      en: "Are women actively involved in the camp management?"
    },
    questionType: "single_choice",
    options: [
      { key: "no_women", label: { id: "Tidak ada Komite, tidak ada perempuan yang dilibatkan", en: "No committee, no women involved" } },
      { key: "not_involved", label: { id: "Ada Komite, namun perempuan tidak dilibatkan", en: "Committee exists but women are not involved" } },
      { key: "formal_only", label: { id: "Ada Komite, perempuan dilibatkan namun sebatas formalitas saja", en: "Committee exists, women are involved but only as a formality" } },
      { key: "fully_involved", label: { id: "Ada Komite dan perempuan dilibatkan secara penuh", en: "Committee exists and women are fully involved" } }
    ],
    required: true
  },
  {
    id: 267,
    topicId: 21,
    parentId: null,
    question: {
      id: "Bagaimana cara pendataan penghuni kamp pengungsian saat ini?",
      en: "How is the data of the camp residents currently collected?"
    },
    questionType: "single_choice",
    options: [
      { key: "rough_estimate", label: { id: "Perkiraan saja mengingat dinamika kamp yang sangat cepat (banyak yang tiba-tiba pulang, membubarkan diri, dll)", en: "Rough estimate due to rapid camp dynamics" } },
      { key: "family_head_only", label: { id: "Mendata nama Kepala Keluarga dan KK saja", en: "Collecting names of Heads of Families and Family Cards only" } },
      { key: "detailed_data", label: { id: "Mendata lengkap (terpilah) seperti nama, usia, gender, kebutuhan khusus, dll", en: "Collecting detailed, disaggregated data (name, age, gender, special needs, etc.)" } },
      { key: "regular_update", label: { id: "Mendata lengkap (terpilah) dan terus di-update setiap minggu", en: "Collecting detailed data and updating it weekly" } }
    ],
    required: true
  },
  {
    id: 268,
    topicId: 21,
    parentId: null,
    question: {
      id: "Bagaimana penataan tenda atau bangunan fasilitas di lokasi kamp pengungsian?",
      en: "How are the tents or facility buildings organized at the displacement camp location?"
    },
    questionType: "single_choice",
    options: [
      { key: "crowded_dark", label: { id: "Padat, berhimpitan tanpa jarak, luar ruangan gelap total pada malam hari", en: "Crowded, tents touching without distance, outdoors are pitch black at night" } },
      { key: "spaced_dark", label: { id: "Ada jarak antar tenda, bangunan fasilitas, namun area toilet dan jalan utama gelap pada malam hari", en: "There is distance between tents/buildings, but toilets and main roads are dark at night" } },
      { key: "spaced_lit", label: { id: "Ada jarak antar tenda, bangunan fasilitas, area toilet dan jalan utama terang", en: "There is distance between tents/buildings; toilets and main roads are well-lit" } },
      { key: "well_organized", label: { id: "Tenda dan bangunan rapi berjejer, ada jarak cukup, pengungsi memiliki ruang yang cukup, ada jalur evakuasi dan penerangan yang mumpuni", en: "Tents and buildings are neatly lined up with sufficient space, residents have enough room, evacuation routes exist, and lighting is adequate" } }
    ],
    required: true
  },
  {
    id: 269,
    topicId: 21,
    parentId: null,
    question: {
      id: "Apa rencana kamp pengungsian ini ke depannya?",
      en: "What is the future plan for this displacement camp?"
    },
    questionType: "single_choice",
    options: [
      { key: "no_plan", label: { id: "Tidak ada diskusi kapan kamp pengungsian tutup, warga pun mulai membangun bangunan semi-permanen dan berencana tinggal untuk jangka waktu panjang", en: "No discussion on closure; residents are building semi-permanent structures and planning for long-term stay" } },
      { key: "deadline_given", label: { id: "Pengelola kamp pengungsian memberikan deadline (di tahun 2026) bagi warga untuk pergi / pulang karena kamp akan ditutup", en: "Camp manager has given a deadline (in 2026) for residents to leave as the camp will be closed" } },
      { key: "consolidation", label: { id: "Kamp kecil akan ditutup dan pengungsi dipindah ke satu kamp induk yang fasilitasnya lebih lengkap", en: "Small camps will be closed and residents moved to a larger main camp with better facilities" } },
      { key: "awaiting_housing", label: { id: "Kamp pengungsian akan bertahan sampai Hunian Sementara selesai dibangun, setelah itu pengungsi akan ditempatkan ke Huntara", en: "Camp will remain until Temporary Housing is completed, then residents will be moved there" } }
    ],
    required: true
  },
  {
    id: 270,
    topicId: 21,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 271,
    topicId: 21,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 272,
    topicId: 21,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 273,
    topicId: 21,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- LAPORAN ANAK HILANG (Topic 22) ---
  {
    id: 281,
    topicId: 22,
    parentId: null,
    question: {
      id: "Tolong jelaskan kondisi anak terpisah / hilang saat ini",
      en: "Please explain the condition of the separated / missing child"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 282,
    topicId: 22,
    parentId: null,
    question: {
      id: "Berapa perkiraan usia anak",
      en: "Approximate age of the child"
    },
    questionType: "single_choice",
    options: [
      { key: "baby", label: { id: "Bayi (0 - 2 tahun)", en: "Infant (0 - 2 years)" } },
      { key: "toddler", label: { id: "Balita (3 - 5 tahun)", en: "Toddler (3 - 5 years)" } },
      { key: "child", label: { id: "Anak-anak (6 - 12 tahun)", en: "Child (6 - 12 years)" } },
      { key: "teenager", label: { id: "Remaja (13 - 17 tahun)", en: "Teenager (13 - 17 years)" } }
    ],
    required: true
  },
  {
    id: 283,
    topicId: 22,
    parentId: null,
    question: {
      id: "Jenis kelamin anak",
      en: "Gender of the child"
    },
    questionType: "single_choice",
    options: [
      { key: "male", label: { id: "Laki-laki", en: "Male" } },
      { key: "female", label: { id: "Perempuan", en: "Female" } }
    ],
    required: true
  },
  {
    id: 284,
    topicId: 22,
    parentId: null,
    question: {
      id: "Apa status anak saat ini (apabila bisa diketahui)",
      en: "What is the child's current status (if known)"
    },
    questionType: "single_choice",
    options: [
      { key: "orphan", label: { id: "Anak sebatang kara, tidak ada orang tua / wali / pengawas", en: "Unaccompanied child, no parents / guardians / supervisors" } },
      { key: "separated_refugee", label: { id: "Anak terpisah dari orang tua / wali, saat ini diasuh oleh penghuni kamp lainnya yang tidak memiliki hubungan darah", en: "Separated child, currently cared for by other camp residents with no blood relation" } },
      { key: "separated_relatives", label: { id: "Anak terpisah dari orang tua / wali, saat ini diasuh oleh kerabat", en: "Separated child, currently cared for by relatives" } },
      { key: "has_parents", label: { id: "Anak masih memiliki orang tua kandung / wali resmi", en: "Child still has biological parents / official guardians" } }
    ],
    required: true
  },
  {
    id: 285,
    topicId: 22,
    parentId: null,
    question: {
      id: "Bagi kategori (1) dan (2), kapan anak terakhir melihat orang tua / wali?",
      en: "For categories (1) and (2), when did the child last see their parents / guardians?"
    },
    questionType: "single_choice",
    options: [
      { key: "during_disaster", label: { id: "Saat kejadian bencana (terpisah saat kejadian bencana / evakuasi, dll)", en: "During the disaster (separated during event / evacuation, etc.)" } },
      { key: "pre_disaster_migrated", label: { id: "Sebelum kejadian bencana (orang tua / wali merantau atau bekerja ke luar pulau)", en: "Before the disaster (parents / guardians working abroad or on other islands)" } },
      { key: "pre_disaster_left", label: { id: "Sebelum kejadian bencana (ditinggalkan orang tua / wali)", en: "Before the disaster (abandoned by parents / guardians)" } },
      { key: "unknown", label: { id: "Tidak tahu / tidak ingat", en: "Unknown / cannot remember" } }
    ],
    required: true
  },
  {
    id: 286,
    topicId: 22,
    parentId: null,
    question: {
      id: "Apakah anak memiliki identitas yang bisa dilacak?",
      en: "Does the child have any traceable identity?"
    },
    questionType: "single_choice",
    options: [
      { key: "no_id", label: { id: "Anak tidak memiliki identitas yang bisa dilacak", en: "Child has no traceable identity" } },
      { key: "knows_address", label: { id: "Anak hafal nama lengkap orang tua dan alamat rumah", en: "Child remembers parents' full names and home address" } },
      { key: "knows_contact", label: { id: "Anak hafal / membawa nomor kontak keluarga / kerabat yang bisa dihubungi", en: "Child remembers / carries a contact number for family / relatives" } },
      { key: "has_kia", label: { id: "Anak memiliki Kartu Identitas Anak (KIA) yang bisa didentifikasi", en: "Child has a Child Identity Card (KIA) that can be identified" } }
    ],
    required: true
  },
  {
    id: 287,
    topicId: 22,
    parentId: null,
    question: {
      id: "Apa hubungan pelapor dengan anak?",
      en: "What is the relation of the reporter to the child?"
    },
    questionType: "single_choice",
    options: [
      { key: "community", label: { id: "Masyarakat umum", en: "General public" } },
      { key: "volunteer", label: { id: "Guru / relawan / aparatur pemerintah", en: "Teacher / volunteer / government apparatus" } },
      { key: "relatives", label: { id: "Kerabat", en: "Relative" } },
      { key: "parents", label: { id: "Orang tua kandung", en: "Biological parent" } }
    ],
    required: true
  },
  {
    id: 288,
    topicId: 22,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 289,
    topicId: 22,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 290,
    topicId: 22,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 291,
    topicId: 22,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- LAPORAN PERLINDUNGAN ANAK (Topic 23) ---
  {
    id: 301,
    topicId: 23,
    parentId: null,
    question: {
      id: "Tolong jelaskan kasus kekerasan terhadap anak yang Anda saksikan / dengar",
      en: "Please explain the case of violence against a child that you witnessed / heard about"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 302,
    topicId: 23,
    parentId: null,
    question: {
      id: "Tolong kategorikan bentuk kekerasan yang dialami anak",
      en: "Please categorize the form of violence the child experienced"
    },
    questionType: "single_choice",
    options: [
      { key: "physical", label: { id: "Fisik (anak dipukul, ditendang, digampar, disundut rokok sehingga luka-luka, memar, borok)", en: "Physical (child beaten, kicked, slapped, burned with cigarettes causing injuries, bruises, ulcers)" } },
      { key: "sexual", label: { id: "Seksual (anak mengalami pelecehan, rabaan, perkosaan, dan dipaksa melihat atau berperan dalam video porno)", en: "Sexual (child experienced harassment, groping, rape, or forced to watch/act in pornography)" } },
      { key: "psychological", label: { id: "Psikis / Verbal (anak dimaki-maki kasar secara terus menerus, diancam, dikurung)", en: "Psychological / Verbal (child constantly cursed at, threatened, locked up)" } },
      { key: "neglect", label: { id: "Penelantaran / Eksploitasi (anak tidak diberi makan, ditelantarkan, dibiarkan sakit, atau dipaksa bekerja berat atau mengemis)", en: "Neglect / Exploitation (child not fed, abandoned, left ill, or forced to work hard/beg)" } },
      { key: "others", label: { id: "Lainnya (jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 303,
    topicId: 23,
    parentId: null,
    question: {
      id: "Siapa yang melakukan kekerasan tersebut",
      en: "Who committed the violence"
    },
    questionType: "single_choice",
    options: [
      { key: "family", label: { id: "Orang tua / keluarga (ayah, ibu, paman, atau kerabat dekat anak)", en: "Parents / family (father, mother, uncle, or close relative)" } },
      { key: "acquaintance", label: { id: "Kenalan dekat (teman, tetangga, guru)", en: "Close acquaintance (friend, neighbor, teacher)" } },
      { key: "stranger", label: { id: "Orang asing / orang tidak dikenal", en: "Stranger / unknown person" } },
      { key: "officer", label: { id: "Petugas / relawan / aparat (oknum yang seharusnya justru menjaga anak)", en: "Officer / volunteer / official (someone who should be protecting the child)" } },
      { key: "others", label: { id: "Lainnya (jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 304,
    topicId: 23,
    parentId: null,
    question: {
      id: "Dimana lokasi kekerasan terhadap anak tersebut terjadi?",
      en: "Where did the violence against the child occur?"
    },
    questionType: "single_choice",
    options: [
      { key: "private", label: { id: "Area privat (di dalam rumah sendiri, pekarangan rumah)", en: "Private area (inside own home, house yard)" } },
      { key: "public", label: { id: "Area publik (di jalanan, di lapangan terbuka, di tepat bermain)", en: "Public area (on the street, open field, playground)" } },
      { key: "remote", label: { id: "Area terpencil (di jalan sepi, bangunan yang ditinggalkan)", en: "Remote area (quiet street, abandoned building)" } },
      { key: "crowded", label: { id: "Area padat (di tengah-tengah keramaian, penuh orang, banyak saksi)", en: "Crowded area (amidst a crowd, full of people, many witnesses)" } },
      { key: "others", label: { id: "Lainnya (jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 305,
    topicId: 23,
    parentId: null,
    question: {
      id: "Bagaimana kondisi anak saat ini?",
      en: "What is the child's current condition?"
    },
    questionType: "single_choice",
    options: [
      { key: "emergency", label: { id: "Gawat darurat (anak mengalami pendarahan, pingsan, kejang-kejang, patah tulang)", en: "Emergency (child bleeding, unconscious, convulsing, fractured bones)" } },
      { key: "trauma", label: { id: "Trauma berat (menangis histeris, ketakutan hebat, diam membisu, syok)", en: "Severe trauma (hysterical crying, extreme fear, silent, shock)" } },
      { key: "light_injury", label: { id: "Luka ringan (memar, lecet, masih bisa berbicara atau menangis)", en: "Minor injuries (bruises, abrasions, still able to speak or cry)" } },
      { key: "no_visible_injury", label: { id: "Tidak terlihat luka fisik (anak terlihat sedih, murung, depresi)", en: "No visible physical injury (child looks sad, moody, depressed)" } },
      { key: "normal", label: { id: "Anak terlihat biasa-biasa saja (ceria, enerjik)", en: "Child looks normal (cheerful, energetic)" } }
    ],
    required: true
  },
  {
    id: 306,
    topicId: 23,
    parentId: null,
    question: {
      id: "Apa hubungan pelapor dengan anak?",
      en: "What is the relation of the reporter to the child?"
    },
    questionType: "single_choice",
    options: [
      { key: "witness", label: { id: "Saksi mata (melihat kejadian langsung)", en: "Eyewitness (saw the event directly)" } },
      { key: "family_victim", label: { id: "Keluarga korban (keluarga korban yang ingin melindungi anak)", en: "Family of the victim (protecting the child)" } },
      { key: "heard_story", label: { id: "Mendengar cerita langsung dari anak (anak bercerita langsung)", en: "Heard directly from the child (child spoke about it)" } },
      { key: "victim_self", label: { id: "Korban sendiri (saya adalah anak yang mengalami kekerasan tersebut)", en: "Victim myself (I am the child who experienced the violence)" } }
    ],
    required: true
  },
  {
    id: 307,
    topicId: 23,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 308,
    topicId: 23,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 309,
    topicId: 23,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang paling diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 310,
    topicId: 23,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- DUGAAN TINDAK KRIMINAL (Topic 24) ---
  {
    id: 321,
    topicId: 24,
    parentId: null,
    question: {
      id: "Mohon ceritakan apa dugaan tindak kriminal yang Anda lihat atau alami",
      en: "Please describe the suspected criminal act you witnessed or or experienced"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 322,
    topicId: 24,
    parentId: null,
    question: {
      id: "Jenis tindak kriminal apa yang terjadi menurut dugaan Anda?",
      en: "What type of criminal act occurred in your suspicion?"
    },
    questionType: "single_choice",
    options: [
      { key: "theft", label: { id: "Pencurian, penjambretan", en: "Theft, mugging" } },
      { key: "physical_violence", label: { id: "Kekerasan fisik, penganiayaan, pemukulan, pengeroyokan", en: "Physical violence, assault, beating, mobbing" } },
      { key: "sexual_violence", label: { id: "Kekerasan seksual, kekerasan asusila, pelecehan, pemerkosaan", en: "Sexual violence, harassment, rape" } },
      { key: "domestic_violence", label: { id: "Kekerasan dalam rumah tangga (KDRT)", en: "Domestic violence (KDRT)" } },
      { key: "extortion", label: { id: "Pemerasan, pungutan liar", en: "Extortion, illegal levies" } },
      { key: "illegal_goods", label: { id: "Penjualan barang-barang ilegal, pasar gelap (rokok ilegal)", en: "Sale of illegal goods, black market" } },
      { key: "fraud", label: { id: "Penipuan", en: "Fraud" } },
      { key: "animal_abuse", label: { id: "Penganiayaan hewan", en: "Animal abuse" } },
      { key: "others", label: { id: "Lainnya (jelaskan)", en: "Others (please explain)" } }
    ],
    required: true
  },
  {
    id: 323,
    topicId: 24,
    parentId: null,
    question: {
      id: "Siapa dan apa yang menjadi korban dalam kejadian ini?",
      en: "Who or what is the victim in this incident?"
    },
    questionType: "single_choice",
    options: [
      { key: "self", label: { id: "Diri saya sendiri", en: "Myself" } },
      { key: "women_children", label: { id: "Perempuan dan / atau anak-anak", en: "Women and / or children" } },
      { key: "elderly_disabled", label: { id: "Lansia dan / atau orang dengan disabilitas", en: "Elderly and / or people with disabilities" } },
      { key: "public", label: { id: "Masyarakat umum", en: "General public" } },
      { key: "public_facility", label: { id: "Fasilitas umum / aset negara", en: "Public facilities / state assets" } },
      { key: "private_facility", label: { id: "Fasilitas pribadi / harta benda masyarakat", en: "Private facilities / community property" } }
    ],
    required: true
  },
  {
    id: 324,
    topicId: 24,
    parentId: null,
    question: {
      id: "Kapan kejadian ini terjadi?",
      en: "When did this incident occur?"
    },
    questionType: "single_choice",
    options: [
      { key: "ongoing", label: { id: "Sedang berlangsung saat ini", en: "Ongoing right now" } },
      { key: "under_24h", label: { id: "Kurang dari 24 jam", en: "Less than 24 hours ago" } },
      { key: "over_24h", label: { id: "Sudah lewat dari 24 jam", en: "More than 24 hours ago" } },
      { key: "over_month", label: { id: "Sudah dari sebulan yang lalu", en: "More than a month ago" } }
    ],
    required: true
  },
  {
    id: 325,
    topicId: 24,
    parentId: null,
    question: {
      id: "Apakah Anda mengenali atau melihat pelaku?",
      en: "Do you recognize or did you see the perpetrator?"
    },
    questionType: "single_choice",
    options: [
      { key: "stranger", label: { id: "Pelaku merupakan orang asing / orang tidak dikenal", en: "Perpetrator is a stranger / unknown person" } },
      { key: "neighbor", label: { id: "Pelaku merupakan sesama warga", en: "Perpetrator is a fellow resident" } },
      { key: "officer", label: { id: "Pelaku merupakan oknum petugas / pegawai negara", en: "Perpetrator is an official / state employee" } }
    ],
    required: true
  },
  {
    id: 326,
    topicId: 24,
    parentId: null,
    question: {
      id: "Apakah ada bukti yang tersedia saat ini?",
      en: "Is there any evidence available now?"
    },
    questionType: "single_choice",
    options: [
      { key: "witness", label: { id: "Ada saksi mata, ada orang lain yang melihat kejadian", en: "Eyewitness exists; someone else saw the incident" } },
      { key: "physical_evidence", label: { id: "Ada barang bukti yang telah diamankan oleh warga / petugas", en: "Physical evidence has been secured by residents / officials" } },
      { key: "media_evidence", label: { id: "Ada foto dan / atau video kejadian", en: "Photo and/or video evidence exists" } },
      { key: "injury_evidence", label: { id: "Ada bekas luka dan / atau kerusakan yang diakibatkan", en: "Visible marks/injuries or damage caused" } }
    ],
    required: true
  },
  {
    id: 327,
    topicId: 24,
    parentId: null,
    question: {
      id: "Apakah Anda butuh perlindungan saat ini?",
      en: "Do you need protection right now?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Ya, butuh", en: "Yes, I do" } },
      { key: "no", label: { id: "Tidak butuh", en: "No, I don't" } }
    ],
    required: true
  },
  {
    id: 328,
    topicId: 24,
    parentId: null,
    question: {
      id: "Apakah Anda sudah melapor ke pihak berwajib (kepolisian)?",
      en: "Have you reported this to the authorities (police)?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Sudah", en: "Yes" } },
      { key: "no", label: { id: "Belum", en: "No" } }
    ],
    required: true
  },
  {
    id: 329,
    topicId: 24,
    parentId: null,
    question: {
      id: "Apakah Anda sudah melapor ke Pak Geuchik / Aparatur Desa / Gampong?",
      en: "Have you reported this to the Village Head / Village Officials?"
    },
    questionType: "single_choice",
    options: [
      { key: "yes", label: { id: "Sudah", en: "Yes" } },
      { key: "no", label: { id: "Belum", en: "No" } }
    ],
    required: true
  },
  {
    id: 330,
    topicId: 24,
    parentId: null,
    question: {
      id: "Dimana lokasinya berada, pengungsian, lingkungan Huntara / Huntap, atau di pemukiman warga?",
      en: "Where is the location: displacement camp, temporary housing area, or residential area?"
    },
    questionType: "single_choice",
    options: [
      { key: "refugee_camp", label: { id: "Lingkungan pengungsian", en: "Displacement camp area" } },
      { key: "huntara_huntap", label: { id: "Lingkungan Huntara / Huntap", en: "Temporary/Permanent Housing area" } },
      { key: "residential", label: { id: "Pemukiman warga", en: "Residential area" } },
      { key: "isolated_area", label: { id: "Daerah terisolir", en: "Isolated area" } },
      { key: "others", label: { id: "Lainnya", en: "Others" } }
    ],
    required: true
  },
  {
    id: 331,
    topicId: 24,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 332,
    topicId: 24,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 333,
    topicId: 24,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 334,
    topicId: 24,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- POTENSI KONFLIK SOSIAL (Topic 25) ---
  {
    id: 341,
    topicId: 25,
    parentId: null,
    question: {
      id: "Mohon ceritakan apa potensi konflik sosial yang Anda lihat atau alami",
      en: "Please describe the potential social conflict you witnessed or experienced"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 343,
    topicId: 25,
    parentId: null,
    question: {
      id: "Siapa pihak yang terlibat konflik sosial?",
      en: "Who are the parties involved in the social conflict?"
    },
    questionType: "single_choice",
    options: [
      { key: "between_citizens", label: { id: "Antar warga", en: "Between residents" } },
      { key: "local_refugee", label: { id: "Antar warga lokal dengan pengungsi", en: "Between local residents and displaced people" } },
      { key: "internal_refugee", label: { id: "Internal pengungsi", en: "Among displaced people themselves" } },
      { key: "citizen_government", label: { id: "Antar warga dengan pegawai pemerintah", en: "Between residents and government employees" } },
      { key: "citizen_officer", label: { id: "Antar warga dengan aparat", en: "Between residents and officials" } }
    ],
    required: true
  },
  {
    id: 344,
    topicId: 25,
    parentId: null,
    question: {
      id: "Sejauh mana situasi sudah memanas?",
      en: "How tense is the situation currently?"
    },
    questionType: "single_choice",
    options: [
      { key: "gossip", label: { id: "Gosip, rumor, dan desas-desus", en: "Gossip, rumors, and hearsay" } },
      { key: "protest", label: { id: "Protes terbuka dan adu mulut warga", en: "Open protest and verbal altercations among residents" } },
      { key: "demonstration", label: { id: "Demonstrasi dan / atau unjuk rasa", en: "Demonstrations and / or rallies" } },
      { key: "limited_physical_action", label: { id: "Aksi fisik terbatas seperti pemblokiran jalan, penyegelan, dorong-dorongan", en: "Limited physical actions such as road blocking, sealing, pushing" } },
      { key: "mass_clash", label: { id: "Bentrokan massal, sedang terjadi pengepungan, pengeroyokan, penggunaan senjata tajam dan senjata api", en: "Mass clashes, including sieges, mobbing, and use of weapons" } }
    ],
    required: true
  },
  {
    id: 345,
    topicId: 25,
    parentId: null,
    question: {
      id: "Menurut Anda, intervensi / mitigasi apa yang dibutuhkan untuk mencegah konflik",
      en: "In your opinion, what intervention / mitigation is needed to prevent conflict?"
    },
    questionType: "long_text",
    required: true
  },
  {
    id: 346,
    topicId: 25,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 347,
    topicId: 25,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 348,
    topicId: 25,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 351,
    topicId: 25,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- BANJIR (Topic 26) ---
  {
    id: 361,
    topicId: 26,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 362,
    topicId: 26,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 363,
    topicId: 26,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 364,
    topicId: 26,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },

  // --- LONGSOR (Topic 27) ---
  {
    id: 381,
    topicId: 27,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, apakah ada informasi lain yang ingin Anda tambahkan?",
      en: "Regarding your report, is there any other information you would like to add?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 382,
    topicId: 27,
    parentId: null,
    question: {
      id: "Terkait laporan Anda, tolong sebutkan setidaknya tiga jenis barang (materil) yang paling mendesak saat ini?",
      en: "Regarding your report, please specify at least three types of items (materials) that are most urgent right now?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 383,
    topicId: 27,
    parentId: null,
    question: {
      id: "Apa jenis layanan atau petugas yang diharapkan segera datang ke lokasi Anda?",
      en: "What type of service or personnel do you most hope will arrive at your location immediately?"
    },
    questionType: "long_text",
    required: false
  },
  {
    id: 384,
    topicId: 27,
    parentId: null,
    question: {
      id: "Bagaimana kondisi akses menuju lokasi Anda tinggal saat ini?",
      en: "How is the access to your current location?"
    },
    questionType: "single_choice",
    options: [
      { key: "isolated_air", label: { id: "Terisolir total, tidak bisa diakses sama sekali kecuali melalui jalur udara", en: "Total isolation, no access at all except by air" } },
      { key: "water_access", label: { id: "Hanya bisa diakses melalui jalur air (boat, kapal kecil)", en: "Accessible only by water (boat, small ship)" } },
      { key: "foot_access", label: { id: "Hanya bisa dilalui oleh pejalan kaki", en: "Accessible only by foot" } },
      { key: "motorcycle_access", label: { id: "Hanya bisa dilalui oleh motor, kendaraan roda 2", en: "Accessible only by motorcycles, 2-wheeled vehicles" } },
      { key: "extreme_4wd", label: { id: "Hanya bisa dilalui oleh mobil khusus daerah ekstrem, 4WD", en: "Accessible only by specialized extreme terrain vehicles, 4WD" } },
      { key: "car_access", label: { id: "Bisa dilalui oleh mobil & kendaraan roda 4 lainnya", en: "Accessible by cars and other 4-wheeled vehicles" } },
      { key: "truck_access", label: { id: "Bisa dilalui oleh truk besar", en: "Accessible by large trucks" } }
    ],
    required: true
  },













];

async function seed() {
  console.log("🌀 Connecting to Supabase...");
  const supabase = await createScriptClient();
  console.log("✅ Connected.");

  // Clear existing (Optional - depend on requirements)
  console.log("🗑️ Clearing old data...");
  await supabase.from('questions').delete().neq('id', 0);
  await supabase.from('topics').delete().neq('id', 0);

  // Insert Topics
  console.log("🌱 Seeding Topics...");
  const formattedTopics = topics.map(t => ({
    id: t.id,
    name_id: t.name.id,
    name_en: t.name.en,
    count: 0
  }));
  const { error: topicError } = await supabase.from('topics').insert(formattedTopics);
  if (topicError) console.error("❌ Topic Error:", topicError.message);

  // Insert Questions
  console.log("🌱 Seeding Questions...");
  const formattedQuestions = questions.map(q => ({
    id: q.id,
    topic_id: q.topicId,
    parent_id: q.parentId,
    question_id: q.question.id,
    question_en: q.question.en,
    question_type: q.questionType,
    options: q.options || [],
    required: q.required || false
  }));

  // Supabase has a limit on bulk insert size, but our questions are ~400, should be fine.
  const { error: questionError } = await supabase.from('questions').insert(formattedQuestions);
  if (questionError) console.error("❌ Question Error:", questionError.message);

  console.log("✨ Seeding Complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("💥 Fatal Error:", err);
  process.exit(1);
});
