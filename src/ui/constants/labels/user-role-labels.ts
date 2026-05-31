// Mapeamento para exibição
// dos tipos de usuários

import { UserRole } from "../../enum/user-role.enum";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "Administrador",
    MANAGER: "Gerente",
    OPERATOR: "Operador",
};