import { StockService } from "@/src/ui/services/stock.service";
import { UserService } from "@/src/ui/services/user.service";
import { Stock } from "@/src/ui/types/stock";
import { User } from "@/src/ui/types/user";
import { useEffect, useMemo, useState } from "react";

const stockService = new StockService("/stock");
const userService = new UserService("/user");

export function useStockMovimentFilterDependencies() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function load() {
            try {
                const [stocks, users] = await Promise.all([
                    stockService.findAll(),
                    userService.findAll({ role: "ADMIN" }),
                ])

                setStocks(stocks);
                setUsers(users);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        stocks,
        users,
        loading,
    }
}