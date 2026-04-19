"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Key, X, Save, Loader2 } from "lucide-react";

interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPermission: any;
  permissionForm: any;
  setPermissionForm: (form: any) => void;
  onSave: (e: React.FormEvent) => void;
  isPending: boolean;
  dict: any;
}

export const PermissionFormModal = ({
  isOpen,
  onClose,
  editingPermission,
  permissionForm,
  setPermissionForm,
  onSave,
  isPending,
  dict,
}: PermissionFormModalProps) => {
  const r_dict = dict?.roles || {};
  const common = dict?.common || {};
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-xl bg-white dark:bg-navy rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-800"
          >
            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Key size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-navy dark:text-white">
                      {editingPermission ? r_dict.edit_master_perm || "Edit Master Izin" : r_dict.create_perm || "Buat Izin Baru"}
                    </h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {r_dict.define_capabilities || "Definisikan Kemampuan Sistem"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={onSave} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      {r_dict.slug_id_label || "Slug ID (e.g., reports:read)"}
                    </label>
                    <input
                      type="text"
                      value={permissionForm.id}
                      onChange={(e) => setPermissionForm({ ...permissionForm, id: e.target.value })}
                      disabled={!!editingPermission}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all disabled:opacity-50 font-mono dark:text-white"
                      placeholder="modul:aksi"
                      required
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      {r_dict.module_label || "Modul (Label Group)"}
                    </label>
                    <input
                      type="text"
                      value={permissionForm.module}
                      onChange={(e) => setPermissionForm({ ...permissionForm, module: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                      placeholder={r_dict.module_placeholder || "Contoh: Laporan Internal"}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                    {r_dict.perm_name_label || "Nama Izin (Display)"}
                  </label>
                  <input
                    type="text"
                    value={permissionForm.name}
                    onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                    placeholder={r_dict.perm_name_placeholder || "Contoh: Menyetujui Pengajuan Dana"}
                    required
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                    {r_dict.perm_desc_label || "Deskripsi & Tujuan"}
                  </label>
                  <textarea
                    value={permissionForm.description}
                    onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[120px] resize-none dark:text-white"
                    placeholder={r_dict.perm_desc_placeholder || "Berikan penjelasan singkat fungsi izin ini untuk audit log..."}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 group"
                >
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} className="group-hover:scale-125 transition-transform" />
                  )}
                  {isPending 
                    ? (common.saving || "Menyimpan...") 
                    : (editingPermission ? r_dict.update_btn || "Update Master Izin" : r_dict.publish_perm || "Terbitkan Izin")}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
