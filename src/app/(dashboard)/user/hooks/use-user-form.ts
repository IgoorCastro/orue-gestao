import { UserRole } from "@/src/domain/enums/user-role.enum";
import { User } from "@/src/ui/types/user";
import { useEffect, useState } from "react";

export function useUserForm(initialData?: User) {
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");
    const [role, setRole] = useState<UserRole>(initialData?.role as UserRole ?? UserRole.OPERATOR);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        initialData && mapUser(initialData);
    }, [initialData]);

    const mapUser = (initialData: User) => {
        setName(initialData.name);
        setNickname(initialData.nickname);
        setRole(initialData.role as UserRole);
    }

    return {
        name,
        password,
        nickname,
        role,
        showPassword,

        setName,
        setPassword,
        setNickname,
        setRole,
        setShowPassword,
    }
}