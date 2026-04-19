"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRole: any;
  roleForm: any;
  setRoleForm: React.Dispatch<React.SetStateAction<any>>;
  permissionGroups: any[];
  allPermissionsFlat: any[];
  onSave: (e: React.FormEvent) => void;
  isPending: boolean;
  dict: any;
}

export const RoleFormModal = ({
  isOpen,
  onClose,
  editingRole,
  roleForm,
  setRoleForm,
  permissionGroups,
  allPermissionsFlat,
  onSave,
  isPending,
  dict,
}: RoleFormModalProps) => {
  const r_dict = dict?.roles || {};
  const common = dict?.common || {};
  const togglePermission = (pId: string) => {
    setRoleForm((prev: any) => ({
      ...prev,
      permissions: prev.permissions.includes(pId)
        ? prev.permissions.filter((id: string) => id !== pId)
        : [...prev.permissions, pId],
    }));
  };

  const handleSelectAll = () => {
    const allIds = allPermissionsFlat.map((p: any) => p.id);
    setRoleForm((prev: any) => ({ ...prev, permissions: allIds }));
    toast.info(r_dict.select_all_toast || "Semua izin terpilih");
  };

  const handleDeselectAll = () => {
    setRoleForm((prev: any) => ({ ...prev, permissions: [] }));
    toast.info(r_dict.deselect_all_toast || "Semua izin dilepas");
  };

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
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-navy rounded-[3rem] shadow-2xl overflow-hidden border dark:border-slate-800 flex flex-col"
          >
            <div className="p-10 border-b dark:border-slate-800 flex items-center justify-between flex-none">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-navy dark:text-white">
                    {editingRole ? r_dict.config_role || "Konfigurasi Role" : r_dict.create_role || "Buat Role Baru"}
                  </h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {r_dict.setup_hierarchy || "Setup Hierarki Hak Akses"}
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

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <form onSubmit={onSave} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      {r_dict.role_name_label || "Nama Role"}
                    </label>
                    <input
                      type="text"
                      value={roleForm.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRoleForm((prev: any) => ({
                          ...prev,
                          name: val,
                          id: editingRole
                            ? prev.id
                            : val
                                .toLowerCase()
                                .trim()
                                .replace(/\s+/g, "_")
                                .replace(/[^a-z0-9_]/g, ""),
                        }));
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                      placeholder={r_dict.role_name_placeholder || "Contoh: Admin Sektoral"}
                      required
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      {r_dict.role_id_label || "Role ID / Slug"}
                    </label>
                    <input
                      type="text"
                      value={roleForm.id}
                      onChange={(e) => setRoleForm({ ...roleForm, id: e.target.value })}
                      disabled={!!editingRole}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all disabled:opacity-50 font-mono dark:text-white"
                      placeholder={r_dict.role_id_placeholder || "otomatis_terisi..."}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                    {r_dict.role_desc_label || "Deskripsi Tanggung Jawab"}
                  </label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[100px] resize-none dark:text-white"
                    placeholder={r_dict.role_desc_placeholder || "Jelaskan peran ini dalam sistem..."}
                    required
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-sm font-black uppercase tracking-tighter text-navy dark:text-white">
                        {r_dict.permissions_list_label || "Daftar Izin (Permissions)"}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          {r_dict.select_all || "Pilih Semua"}
                        </button>
                        <button
                          type="button"
                          onClick={handleDeselectAll}
                          className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          {r_dict.deselect_all || "Hapus Semua"}
                        </button>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full">
                      {roleForm.permissions.length} {r_dict.enabled_count || "Diaktifkan"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {permissionGroups.map((group: any) => (
                      <div
                        key={group.name}
                        className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-6 border dark:border-slate-800"
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-2">
                          {group.name}
                        </p>
                        <div className="space-y-2">
                          {group.permissions.map((p: any) => (
                            <label
                              key={p.id}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                                roleForm.permissions.includes(p.id)
                                  ? "bg-white dark:bg-navy border-primary/20 shadow-sm"
                                  : "hover:bg-white dark:hover:bg-navy",
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={roleForm.permissions.includes(p.id)}
                                onChange={() => togglePermission(p.id)}
                                className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                              />
                              <div>
                                <p className="text-[10px] font-black leading-tight uppercase text-navy dark:text-white">
                                  {p.name || p.label}
                                </p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                  {p.id}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-6 bg-primary text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  {isPending ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Save size={24} className="group-hover:scale-125 transition-transform" />
                  )}
                  {isPending 
                    ? (common.saving || "Menyimpan...") 
                    : (editingRole ? r_dict.update_btn || "Simpan Perubahan Hak Akses" : r_dict.create_btn || "Daftarkan Role Baru")}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
