"use client";

import { useUser } from "@/src/ui/contexts/user-context";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import AdminStockMovimentsPage from "@/src/ui/components/shared/stock-moviment/admin-stock-moviment";
import ManagerStockMovimentsPage from "@/src/ui/components/shared/stock-moviment/manager-stock-moviment";

export default function InboundStockPage() {
    const user = useUser();

    !user && <DefaultLoading />

    return (
        <div className="flex flex-col gap-6 p-8">
            <main className="space-y-6">
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="rounded-lg border bg-card shadow-sm">
                        {user?.role === "ADMIN" && <AdminStockMovimentsPage />}
                        {user?.role === "MANAGER" && <ManagerStockMovimentsPage />}
                    </div>
                </section>
            </main>
        </div>
    );
}