// service exclusivo para autenticação do usuário

import { api } from "./api";
import { LoginDto } from "../types/auth";

// Executa um post na rota e retorna a response
export class AuthService {
    static async login(data: LoginDto) {
        const response = await api.post("/auth/login", data);

        return response.data;
    }
}