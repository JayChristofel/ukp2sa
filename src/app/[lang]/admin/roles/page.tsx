"use client";

import React, { useEffect, useState } from "react";
import { 
  Shield, 
  Plus, 
  Loader2, 
  Lock, 
  Key, 
  Search, 
  Filter 
} from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Modular Components
import { RolesHeader } from "./_components/RolesHeader";
import { RoleCard } from "./_components/RoleCard";
import { PermissionGroup } from "./_components/PermissionGroup";
import { PermissionFormModal } from "./_components/PermissionFormModal";
import { RoleFormModal } from "./_components/RoleFormModal";

export default function RolesPage() {
  const dict = useI18n();
  const queryClient = useQueryClient();
  const { logActivity } = useAuditLogger();

  // Modals & Forms State
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<any>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [permissionForm, setPermissionForm] = useState({
    id: "", name: "", module: "", description: "",
  });

  const [roleForm, setRoleForm] = useState({
    id: "", name: "", description: "", permissions: [] as string[],
  });

  useEffect(() => {
    logActivity("ROLES_VIEW", "SYSTEM", "User accessed the roles and permissions configuration center.");
  }, [logActivity]);

  const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => apiService.getRoles(),
  });

  const { data: permissionGroupsData } = useQuery({
    queryKey: ["admin-permissions-grouped"],
    queryFn: () => apiService.getPermissionsGrouped(),
  });

  const roles = rolesData?.data || [];
  const permissionGroups = permissionGroupsData?.data || [];
  const allPermissionsFlat = permissionGroups.flatMap((g: any) => g.permissions);

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
      queryClient.invalidateQueries({ queryKey: ["admin-permissions-grouped"] });
      toast.success("Permission berhasil disimpan!");
      setIsPermissionModalOpen(false);
    },
  });

  const saveRoleMutation = useMutation({
    mutationFn: (data: any) => apiService.saveRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      toast.success("Role berhasil disimpan!");
      setIsRoleModalOpen(false);
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (id: string) => apiService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-permissions-grouped"] });
      toast.success("Permission dihapus");
    },
  });

  // Handlers
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
    setPermissionForm({ id: p.id, name: p.name, module: p.module, description: p.description || "" });
    setIsPermissionModalOpen(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setRoleForm({ id: role.id, name: role.name, description: role.description || "", permissions: role.permissions || [] });
    setIsRoleModalOpen(true);
  };

  if (!dict) return null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-4 sm:px-6 lg:px-8">
      <RolesHeader />

      <Tabs defaultValue="roles" className="w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 font-display">
          <TabsList className="bg-white dark:bg-navy p-1.5 rounded-[2rem] h-auto border dark:border-slate-800 shadow-xl flex-none overflow-x-auto">
            <TabsTrigger value="roles" className="px-8 py-3 rounded-[1.5rem] data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white text-[11px] font-black uppercase tracking-widest gap-2.5 transition-all whitespace-nowrap">
              <Shield size={14} /> {dict.roles?.title_tab || "Roles"}
            </TabsTrigger>
            <TabsTrigger value="permissions" className="px-8 py-3 rounded-[1.5rem] data-[state=active]:bg-primary dark:data-[state=active]:bg-primary data-[state=active]:text-white text-[11px] font-black uppercase tracking-widest gap-2.5 transition-all whitespace-nowrap">
              <Key size={14} /> {dict.roles?.permissions_tab || "Permissions"}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <TabsContent value="roles" className="m-0 w-full md:w-auto">
              <button 
                onClick={() => { resetRoleForm(); setIsRoleModalOpen(true); }} 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all w-full"
              >
                <Plus size={18} /> {dict.roles?.add_role || "Tambah Role Baru"}
              </button>
            </TabsContent>
            <TabsContent value="permissions" className="m-0 w-full md:w-auto">
              <button 
                onClick={() => { resetPermissionForm(); setIsPermissionModalOpen(true); }} 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all w-full"
              >
                <Plus size={18} /> {dict.roles?.add_permission || "Add Permission"}
              </button>
            </TabsContent>
          </div>
        </div>

        <TabsContent value="roles" className="mt-0 outline-none">
          {isLoadingRoles ? (
            <div className="py-32 flex flex-col items-center gap-6">
              <Loader2 className="size-10 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{dict.common?.loading || "Memuat Data..."}</p>
            </div>
          ) : roles.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800 p-24 text-center">
              <Lock size={48} className="mx-auto text-slate-300 mb-6 opacity-50" />
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-400">{dict.roles?.no_data || "Belum Ada Role Terdefinisi"}</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {roles.map((role: any) => (
                <RoleCard 
                  key={role.id} role={role} 
                  allPermissionsFlat={allPermissionsFlat} 
                  onEdit={handleEditRole} 
                  onDelete={(id) => { if (window.confirm(dict.common?.confirm_delete || "Hapus role ini?")) deleteRoleMutation.mutate(id); }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="mt-0 outline-none space-y-10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group flex-1 w-full font-display">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input 
                type="text" 
                placeholder={dict.roles?.search_permissions_placeholder || "Cari izin master (ID atau nama)..."} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-14 pr-8 py-5 bg-white dark:bg-navy border border-slate-100 dark:border-slate-800 rounded-[1.5rem] text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-xl dark:text-white"
              />
            </div>
            <div className="px-5 py-5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Filter size={14} /> {permissionGroups.length} {dict.roles?.module_count || "Modul"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {permissionGroups.map((group: any, idx: number) => (
              <PermissionGroup 
                key={idx} group={group} searchQuery={searchQuery} 
                onEdit={handleEditPermission} 
                onDelete={(id) => { if (window.confirm("Hapus master izin ini?")) deletePermissionMutation.mutate(id); }}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <PermissionFormModal 
        isOpen={isPermissionModalOpen} onClose={() => setIsPermissionModalOpen(false)}
        editingPermission={editingPermission} permissionForm={permissionForm} setPermissionForm={setPermissionForm}
        onSave={(e) => { e.preventDefault(); savePermissionMutation.mutate(permissionForm); }}
        isPending={savePermissionMutation.isPending}
        dict={dict}
      />

      <RoleFormModal 
        isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}
        editingRole={editingRole} roleForm={roleForm} setRoleForm={setRoleForm}
        permissionGroups={permissionGroups} allPermissionsFlat={allPermissionsFlat}
        onSave={(e) => { e.preventDefault(); saveRoleMutation.mutate(roleForm); }}
        isPending={saveRoleMutation.isPending}
        dict={dict}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--primary-rgb), 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
