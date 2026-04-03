"use client";

import React, { useEffect, useState } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Lock,
  ChevronRight,
  Loader2,
  Key,
  ShieldCheck,
  Search,
  X,
  Save,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/app/[lang]/providers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function RolesPage() {
  const dict = useI18n();
  const queryClient = useQueryClient();
  const { logActivity } = useAuditLogger();

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [permissionForm, setPermissionForm] = useState({
    id: "",
    name: "",
    module: "",
    description: "",
  });

  const [roleForm, setRoleForm] = useState({
    id: "",
    name: "",
    description: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    logActivity(
      "ROLES_VIEW",
      "SYSTEM",
      "User accessed the roles and permissions configuration center.",
    );
  }, [logActivity]);

  // Fetch roles
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => apiService.getRoles(),
  });

  // Fetch permission groups
  const { data: permissionGroupsData, isLoading: permissionsLoading } =
    useQuery({
      queryKey: ["admin-permissions-grouped"],
      queryFn: () => apiService.getPermissionsGrouped(),
    });

  const roles = rolesData?.data || [];
  const permissionGroups = permissionGroupsData?.data || [];
  const allPermissionsFlat = permissionGroups.flatMap(
    (g: any) => g.permissions,
  );

  // Mutations
  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role berhasil dihapus");
    },
  });

  const savePermissionMutation = useMutation({
    mutationFn: (data: any) => apiService.savePermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-permissions-grouped"],
      });
      toast.success("Permission berhasil disimpan!");
      setIsPermissionModalOpen(false);
      resetPermissionForm();
    },
  });

  const saveRoleMutation = useMutation({
    mutationFn: (data: any) => apiService.saveRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role berhasil disimpan!");
      setIsRoleModalOpen(false);
      resetRoleForm();
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (id: string) => apiService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-permissions-grouped"],
      });
      toast.success("Permission dihapus");
    },
  });

  const handleDeleteRole = (id: string) => {
    if (window.confirm("Hapus role ini?")) {
      deleteRoleMutation.mutate(id);
    }
  };

  const resetPermissionForm = () => {
    setPermissionForm({ id: "", name: "", module: "", description: "" });
    setEditingPermission(null);
  };

  const resetRoleForm = () => {
    setRoleForm({ id: "", name: "", description: "", permissions: [] });
    setEditingRole(null);
  };

  const handleEditPermission = (p: any) => {
    setEditingPermission(p);
    setPermissionForm({
      id: p.id,
      name: p.name,
      module: p.module,
      description: p.description || "",
    });
    setIsPermissionModalOpen(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setRoleForm({
      id: role.id,
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || [],
    });
    setIsRoleModalOpen(true);
  };

  const handleSavePermission = (e: React.FormEvent) => {
    e.preventDefault();
    savePermissionMutation.mutate(permissionForm);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    saveRoleMutation.mutate(roleForm);
  };

  const togglePermission = (pId: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(pId)
        ? prev.permissions.filter((id) => id !== pId)
        : [...prev.permissions, pId],
    }));
  };

  const handleSelectAll = () => {
    const allIds = allPermissionsFlat.map((p: any) => p.id);
    setRoleForm((prev) => ({ ...prev, permissions: allIds }));
    toast.info("Semua izin terpilih");
  };

  const handleDeselectAll = () => {
    setRoleForm((prev) => ({ ...prev, permissions: [] }));
    toast.info("Semua izin dilepas");
  };

  if (!dict) return null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Title Section */}
      <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">
              Hak Akses & Izin
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1.5 opacity-80">
              Konfigurasi Hierarki & Master Izin Sistem UKP2SA
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="roles" className="w-full space-y-8">
        {/* Navigation & Tab List */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50">
          <TabsList className="bg-white dark:bg-navy p-1.5 rounded-[2rem] h-auto border dark:border-slate-800 shadow-xl flex-none">
            <TabsTrigger
              value="roles"
              className="px-8 py-3 rounded-[1.5rem] data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white text-[11px] font-black uppercase tracking-widest gap-2.5 transition-all"
            >
              <Shield size={14} /> Roles
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="px-8 py-3 rounded-[1.5rem] data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white text-[11px] font-black uppercase tracking-widest gap-2.5 transition-all"
            >
              <Key size={14} /> Permissions
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <TabsContent value="roles" className="m-0 w-full md:w-auto">
              <button
                onClick={() => {
                  resetRoleForm();
                  setIsRoleModalOpen(true);
                }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all w-full"
              >
                <Plus size={18} /> Tambah Role Baru
              </button>
            </TabsContent>
            <TabsContent value="permissions" className="m-0 w-full md:w-auto">
              <button
                onClick={() => {
                  resetPermissionForm();
                  setIsPermissionModalOpen(true);
                }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all w-full"
              >
                <Plus size={18} /> Add Permission
              </button>
            </TabsContent>
          </div>
        </div>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-0 outline-none">
          {rolesLoading ? (
            <div className="py-32 flex flex-col items-center gap-6">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Memuat Data...
              </p>
            </div>
          ) : roles.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800 p-24 text-center">
              <Lock
                size={48}
                className="mx-auto text-slate-300 mb-6 opacity-50"
              />
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-400">
                Belum Ada Role Terdefinisi
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {roles.map((role: any) => (
                <motion.div
                  key={role.id}
                  layoutId={role.id}
                  className="group relative bg-white dark:bg-navy rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col h-full"
                >
                  <div className="flex-1 space-y-8">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "p-4 rounded-2xl shadow-inner",
                          role.id === "superadmin"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-primary/5 text-primary",
                        )}
                      >
                        <ShieldCheck size={24} />
                      </div>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all shadow-sm"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        {role.id === "superadmin" && (
                          <span className="px-2 py-0.5 bg-amber-500 text-[8px] font-black text-white rounded-[4px] uppercase tracking-widest">
                            Master
                          </span>
                        )}
                        <h3 className="text-xl font-black uppercase tracking-tighter">
                          {role.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <Key size={10} className="text-primary/50" /> Izin Aktif
                        ({role.permissions?.length || 0})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(role.permissions || [])
                          .slice(0, 8)
                          .map((pId: string) => {
                            const p = allPermissionsFlat.find(
                              (item: any) => item.id === pId,
                            );
                            return (
                              <span
                                key={pId}
                                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-[8px] font-black rounded-lg uppercase tracking-tight text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/50"
                              >
                                {p?.name || pId}
                              </span>
                            );
                          })}
                        {role.permissions?.length > 8 && (
                          <span className="px-2.5 py-1.5 bg-primary/5 text-primary text-[8px] font-black rounded-lg uppercase border border-primary/10">
                            +{role.permissions.length - 8} Lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-3">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="flex-1 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-[1.25rem] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white dark:hover:bg-primary transition-all active:scale-95 shadow-sm"
                    >
                      Konfigurasi Izin <ChevronRight size={14} />
                    </button>
                    {role.id !== "superadmin" && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="size-[52px] flex-none bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-[1.25rem] flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-sm"
                        title="Hapus Role"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent
          value="permissions"
          className="mt-0 outline-none space-y-10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input
                type="text"
                placeholder="Cari izin master (ID atau nama)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-8 py-5 bg-white dark:bg-navy border border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-xl"
              />
            </div>
            <div className="px-5 py-5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Filter size={14} /> {permissionGroups.length} Modul
            </div>
          </div>

          {permissionsLoading ? (
            <div className="py-32 flex flex-col items-center gap-6">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Memuat Data...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {permissionGroups.map((group: any, idx: number) => {
                const filteredPermissions = group.permissions.filter(
                  (p: any) =>
                    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (p.name || p.label || "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                );
                if (searchQuery && filteredPermissions.length === 0)
                  return null;

                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-navy rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl h-fit"
                  >
                    <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/10 flex items-center justify-center">
                          <Lock size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-tighter">
                            {group.name}
                          </h3>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                            Grup Akses Modul
                          </p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100 dark:border-slate-700">
                        {filteredPermissions.length} Izin
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {filteredPermissions.map((p: any) => (
                        <div
                          key={p.id}
                          className="group/item flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all"
                        >
                          <div className="flex items-center gap-5">
                            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] font-black text-primary font-mono shadow-sm">
                              {p.id}
                            </div>
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-tight">
                                {p.name || p.label}
                              </p>
                              {p.description && (
                                <p className="text-[9px] font-bold text-slate-400 mt-0.5 line-clamp-1">
                                  {p.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-all">
                            <button
                              onClick={() => handleEditPermission(p)}
                              className="size-9 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Hapus master izin ini?"))
                                  deletePermissionMutation.mutate(p.id);
                              }}
                              className="size-9 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500 transition-all shadow-sm"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Permission Form Modal */}
      <AnimatePresence>
        {isPermissionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPermissionModalOpen(false)}
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
                      <h2 className="text-2xl font-black uppercase tracking-tighter">
                        {editingPermission
                          ? "Edit Master Izin"
                          : "Buat Izin Baru"}
                      </h2>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Definisikan Kemampuan Sistem
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsPermissionModalOpen(false)}
                    className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSavePermission} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                        Slug ID (e.g., reports:read)
                      </label>
                      <input
                        type="text"
                        value={permissionForm.id}
                        onChange={(e) =>
                          setPermissionForm({
                            ...permissionForm,
                            id: e.target.value,
                          })
                        }
                        disabled={!!editingPermission}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all disabled:opacity-50 font-mono"
                        placeholder="modul:aksi"
                        required
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                        Modul (Label Group)
                      </label>
                      <input
                        type="text"
                        value={permissionForm.module}
                        onChange={(e) =>
                          setPermissionForm({
                            ...permissionForm,
                            module: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                        placeholder="Contoh: Laporan Internal"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      Nama Izin (Display)
                    </label>
                    <input
                      type="text"
                      value={permissionForm.name}
                      onChange={(e) =>
                        setPermissionForm({
                          ...permissionForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                      placeholder="Contoh: Menyetujui Pengajuan Dana"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      Deskripsi & Tujuan
                    </label>
                    <textarea
                      value={permissionForm.description}
                      onChange={(e) =>
                        setPermissionForm({
                          ...permissionForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[120px] resize-none"
                      placeholder="Berikan penjelasan singkat fungsi izin ini untuk audit log..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savePermissionMutation.isPending}
                    className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 group"
                  >
                    {savePermissionMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save
                        size={18}
                        className="group-hover:scale-125 transition-transform"
                      />
                    )}
                    {editingPermission
                      ? "Update Master Izin"
                      : "Terbitkan Izin"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Role Form Modal */}
        {isRoleModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRoleModalOpen(false)}
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
                    <h2 className="text-2xl font-black uppercase tracking-tighter">
                      {editingRole ? "Konfigurasi Role" : "Buat Role Baru"}
                    </h2>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      Setup Hierarki Hak Akses
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="size-11 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <form onSubmit={handleSaveRole} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                        Nama Role
                      </label>
                      <input
                        type="text"
                        value={roleForm.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRoleForm((prev) => ({
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
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                        placeholder="Contoh: Admin Sektoral"
                        required
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                        Role ID / Slug
                      </label>
                      <input
                        type="text"
                        value={roleForm.id}
                        onChange={(e) =>
                          setRoleForm({ ...roleForm, id: e.target.value })
                        }
                        disabled={!!editingRole}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all disabled:opacity-50 font-mono"
                        placeholder="otomatis_terisi..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">
                      Deskripsi Tanggung Jawab
                    </label>
                    <textarea
                      value={roleForm.description}
                      onChange={(e) =>
                        setRoleForm({
                          ...roleForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-xs font-black focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all min-h-[100px] resize-none"
                      placeholder="Jelaskan peran ini dalam sistem..."
                      required
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3 className="text-sm font-black uppercase tracking-tighter">
                          Daftar Izin (Permissions)
                        </h3>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                          >
                            Pilih Semua
                          </button>
                          <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          >
                            Hapus Semua
                          </button>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full">
                        {roleForm.permissions.length} Diaktifkan
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
                                  <p className="text-[10px] font-black leading-tight uppercase">
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
                    disabled={saveRoleMutation.isPending}
                    className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-10"
                  >
                    {saveRoleMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {editingRole ? "Simpan Perubahan Role" : "Terbitkan Role"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
