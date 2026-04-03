import mongoose from 'mongoose';

/**
 * Model Partner/Instansi
 * Digunakan untuk manajemen mitra kerja (Satgas, K/L, NGO)
 */
const PartnerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // slug id (e.g. p1, p2, kementerian-a)
  name: { type: String, required: true },
  owner: { type: String },
  category: { 
    type: String, 
    enum: ['Satgas', 'K/L', 'Pemda', 'NGO', 'Mitra'], 
    default: 'Satgas' 
  },
  url: { type: String },
  imageSrc: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  description: { type: String }
}, { timestamps: true });

export interface IPartner extends mongoose.Document {
  id: string;
  name: string;
  owner?: string;
  category: string;
  url?: string;
  imageSrc?: string;
  status: string;
  description?: string;
}

// Prevent model recompilation in Next.js development
export const PartnerModel = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);
