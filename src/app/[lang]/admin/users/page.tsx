"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useI18n } from "@/app/[lang]/providers";
import { toast } from "sonner";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

// Modular Components
import { UsersHeader } from "./_components/UsersHeader";
import { UsersFilter } from "./_components/UsersFilter";
import { UsersTable } from "./_components/UsersTable";
import { UsersPagination } from "./_components/UsersPagination";

export default function UsersPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const dict = useI18n();
  const queryClient = useQueryClient();
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "USERS_MANAGEMENT_VIEW",
      "SYSTEM",
      "User accessed the administrator and field operator management system.",
    );
  }, [logActivity]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["admin-users", currentPage, searchTerm, filterRole],
    queryFn: () => apiService.getUsers(currentPage, itemsPerPage, searchTerm, filterRole),
    placeholderData: (prev) => prev,
  });

  // Fetch roles
  const { data: rolesData } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: () => apiService.getRoles(),
    staleTime: 1000 * 60 * 10,
  });

  const users = usersData?.data || [];
  const roles = rolesData?.data || [];
  const totalPages = usersData?.totalPages || 1;
  const totalItems = usersData?.totalItems || 0;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(dict?.common?.delete_success || "Data berhasil dihapus");
    },
    onError: () => {
      toast.error(dict?.common?.delete_failed || "Gagal menghapus data");
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(dict?.common?.confirm_delete || "Hapus data ini?")) {
      deleteMutation.mutate(id);
      logActivity("USER_REMOVED", "SYSTEM", `User deleted account: ${id}`);
      addNotification({
        title: "User Dihapus",
        description: `Akun User ID: ${id} telah dihapus permanen dari sistem.`,
        type: "system",
        priority: "high",
      });
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterRole("");
    setCurrentPage(1);
  };

  if (!dict) return null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20 px-4 sm:px-6 lg:px-8">
      <UsersHeader dict={dict} lang={lang} />

      <div className="bento-card !p-0 overflow-hidden border-none shadow-2xl bg-white/40 dark:bg-navy/30 backdrop-blur-md rounded-[3rem]">
        <UsersFilter 
          dict={dict} 
          searchTerm={searchTerm} 
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          filterRole={filterRole} 
          onFilterRoleChange={(val) => { setFilterRole(val); setCurrentPage(1); }}
          roles={roles} 
        />

        <UsersTable 
          users={users} 
          roles={roles} 
          isLoading={usersLoading} 
          error={usersError} 
          dict={dict} 
          lang={lang} 
          searchTerm={searchTerm}
          onEdit={(id) => router.push(`/${lang}/admin/users/edit?id=${id}`)}
          onDelete={handleDelete}
          onReset={handleReset}
          isDeleting={deleteMutation.isPending}
        />

        {users.length > 0 && (
          <UsersPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            totalItems={totalItems} 
            itemsPerPage={itemsPerPage} 
            onPageChange={setCurrentPage} 
            dict={dict} 
            lang={lang} 
          />
        )}
      </div>
    </div>
  );
}
