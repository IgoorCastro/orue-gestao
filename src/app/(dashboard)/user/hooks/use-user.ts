// hook de domínio responsável pela gestão do ciclo de vida dos usuários

import { feedback } from "@/src/ui/lib/feedback";
import { UserService } from "@/src/ui/services/user.service";
import { User } from "@/src/ui/types/user";
import { useEffect, useState, useMemo } from "react";

const userService = new UserService("/user");

export function useUser() {
    const [users, setUsers] = useState<User[]>([]);
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        userService.findAll()
            .then((res) => {
                setUsers(res);
                setLoading(false);
            })
            .catch(console.error);
    }, [refreshSignal]);


    // Handle para desativar um usuário
    const handleConfirmdDeactivation = (userId: string) => {
        setLoading(true);
        feedback.loading("Desativando usuário...");
        userService.delete(userId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Usuário desativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error)
                setLoading(false);
            })
    }

    // Handle para reativar um usuário
    const handleRestoreUser = (storeId: string) => {
        setLoading(true);
        feedback.loading("Reativando usuário...");
        userService.restore(storeId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Usuário reativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error);
                setLoading(false);
            })
    }

    const isDisableUser = (deletedAt?: string) => {
        return !!deletedAt;
    }

    return {
        // campos
        users,
        loading,

        // setters
        setRefreshSignal,

        // utils
        handleConfirmdDeactivation,
        handleRestoreUser,
        isDisableUser,
    }
}