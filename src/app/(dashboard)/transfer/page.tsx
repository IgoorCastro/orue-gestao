"use client";

import { Separator } from "@/src/ui/components/ui/separator";
import { useUser } from "@/src/ui/contexts/user-context";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import TransferAdminPage from "@/src/ui/components/shared/transfer/trasnfer-admin";
import TransferManagePage from "@/src/ui/components/shared/transfer/transfer-manager";
import UserHeader from "@/src/ui/components/shared/ui/header";

export default function TransferPage() {
  const user = useUser();

  !user && <DefaultLoading />

  return (
    <div className="flex flex-col gap-6 p-3 lg:p-8">
      <UserHeader title="Transfer Stock" description="Gerenciamento de transferencia de mercadorias e entre estoques." />
      
      <Separator className="opacity-50" />
      
      <main className="space-y-6">
        {/* Manager/Admin Shared View */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Fluxo de Transferência
              </h2>
            </div>
            
            <div className="rounded-lg border bg-card shadow-sm">
               {user?.role === "ADMIN" && <TransferAdminPage />}
               {user?.role === "MANAGER" && <TransferManagePage />}
            </div>
          </section>
      </main>
    </div>
  );
}