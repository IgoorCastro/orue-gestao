// hook de domínio responsável pela gestão do ciclo de vida do login

import { feedback } from "@/src/ui/lib/feedback";
import { AuthService } from "@/src/ui/services/login.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogin() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            await AuthService.login({
                nickname,
                password,
            });

            feedback.success("Bem-vindo!");
            router.push("/");

        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Erro no login";

            feedback.error(message);
            setError(message);

        } finally {
            setIsLoading(false);
        }
    };

    return {
        nickname,
        password,
        isLoading,
        error,

        setNickname,
        setPassword,

        handleSubmit,
    }
}