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
        setLoading(true);
        Promise.all([
            stockService.findAll(),
            userService.findAll({ role: "ADMIN" }),
        ])
            .then(([stocks, users]) => {
                setStocks(stocks);
                setUsers(users.filter(u => u.nickname !== "dev@sistema.com"));
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, []);

    return {
        stocks,
        users,
        loading,
    }
}