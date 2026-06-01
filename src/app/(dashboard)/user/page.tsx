"use client";

import { User } from "@/src/ui/types/user";
import { Plus } from "lucide-react";
import { useUserPageState } from "./hooks/use-user-page-state";
import { useUser } from "./hooks/use-user";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { CustomButton } from "@/src/ui/components/shared/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { UserForm } from "@/src/ui/components/shared/forms/user-form";
import { UserDetailsForm } from "@/src/ui/components/shared/forms/user-details-form";
import { USER_ROLE_LABELS } from "@/src/ui/constants/labels/user-role-labels";

export default function UsersPage() {
  const {
    users,
    loading,

    setRefreshSignal,

    handleConfirmdDeactivation,
    handleRestoreUser,
    isDisableUser,
  } = useUser();

  const {
    // campos
    openCrudModal,
    selectedUser,
    openItemModal,

    // setters
    setOpenCrudModal,
    setOpenItemModal,

    //utils
    openEditModal,
    openCreateModal,
    openItemDetails,
  } = useUserPageState();

  if (loading) return <DefaultLoading />;

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between items-center mb-5 py-4 px-5 rounded-2xl border">
        <h1 className="text-lg sm:text-2xl font-bold">Usuários</h1>
        <div className="flex w-auto">
          <CustomButton
            text="Novo usuário"
            icon={<Plus size={18} />}
            variant="default"
            className="text-xs"
            onClick={() => openCreateModal()}
          />
        </div>
      </div>

      <div className="w-full md:w-[98%] rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {/* header da tabela */}
              <TableHead className="pl-10 py-5 text-lg font-bold">Nome</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold">Cargo</TableHead>
              <TableHead className="px-10 py-5 text-lg text-center font-bold">Usuário</TableHead>
              <TableHead className="px-10 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => !user.nickname.startsWith("dev@sistema") && (
                <TableRow
                  key={user.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Nome: Clique para abrir detalhes */}
                  <TableCell
                    className="pl-10 py-4 text-md font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(user)}
                  >
                    {user.name}
                  </TableCell>

                  {/* Coluna Cargo */}
                  <TableCell
                    className="px-6 py-4 text-md text-muted-foreground uppercase text-xs tracking-wider"
                    onClick={() => openItemDetails(user)}
                  >
                    {USER_ROLE_LABELS[user.role]}
                  </TableCell>

                  {/* Coluna Nickname / Ações (Seguindo sua lógica de centralização se necessário) */}
                  <TableCell
                    className="px-10 py-4 text-md text-center text-foreground/70 italic"
                    onClick={() => openItemDetails(user)}
                  >
                    {user.nickname}
                  </TableCell>

                  {/* Coluna Ações: Seguindo fielmente sua base de cliques */}
                  <TableCell
                    className="py-4 h-full flex justify-center items-center"
                    onClick={(e) => {
                      openItemDetails(user);
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisableUser(user.deletedAt)}
                        onEdit={() => openEditModal(user)}
                        onDelete={() => handleConfirmdDeactivation(user.id)}
                        onRestore={() => handleRestoreUser(user.id)}
                        disabled={loading}
                        onSucces={() => setRefreshSignal(prev => !prev)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResponsiveModal
        title="Detalhes do Usuário"
        open={openItemModal}
        onOpenChange={setOpenItemModal}
        description="Visualização completa das informações do usuário."
        size="sm"
      >
        {selectedUser && <UserDetailsForm user={selectedUser} />}
      </ResponsiveModal>

      <CrudModal
        title="Nova usuário"
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <UserForm
          initialData={selectedUser}
          onSuccess={(newUser: User) => {
            setRefreshSignal(prev => !prev)
            setOpenCrudModal(false);
          }}
        />
      </CrudModal>
    </div>
  );
}