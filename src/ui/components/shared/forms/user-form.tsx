"use client";

import { User } from "@/src/ui/types/user";
import { UserService } from "@/src/ui/services/user.service";
import { Label } from "@/src/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/components/ui/select";
import { Input } from "@/src/ui/components/ui/input";
import { Separator } from "@/src/ui/components/ui/separator";
import { Button } from "@/src/ui/components/ui/button";
import { Eye, EyeOff, Save } from "lucide-react";
import { feedback } from "@/src/ui/lib/feedback";
import { useUserForm } from "@/src/app/(dashboard)/user/hooks/use-user-form";
import { useMemo } from "react";
import { UserRole } from "@/src/ui/enum/user-role.enum";

type Props = {
    onSuccess: (user: User) => void;
    initialData?: User;
};


export function UserForm({ onSuccess, initialData }: Props) {
    const {
        name,
        nickname,
        password,
        role,
        showPassword,

        setName,
        setNickname,
        setPassword,
        setRole,
        setShowPassword
    } = useUserForm(initialData);

    const userService = useMemo(() => new UserService("/user"), []);

    // ENVIA OS DADOS DO FORM PARA O SERVICE
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        feedback.loading("Processando entrada...")
        try {
            const user = initialData ? await updateUser(userService) : await createUser(userService);
            feedback.dismiss(); // Remove o loading
            feedback.success('Entrada de usuário realizada com sucesso!');
            onSuccess(user); // atualiza tabela // n precisa mais
        } catch (error) {
            feedback.dismiss();
            feedback.error(error); // O utilitário já trata a mensagem de erro da API
        }
    };

    const createUser = async (service: UserService) => {
        return await service.create({ name, nickname, password, role });
    }

    const updateUser = async (service: UserService) => {
        if (initialData) {
            return await service.update(
                initialData.id,
                { name, nickname, role, password }
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Informações Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                        Nome Completo
                    </Label>
                    <Input
                        id="name"
                        placeholder="Ex: João Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-xs font-bold uppercase tracking-wider">
                        Nickname
                    </Label>
                    <Input
                        id="nickname"
                        placeholder="Ex: joao.silva"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
            </div>

            {/* Credenciais e Acesso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider">
                        Senha
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-10" // Padding à direita para não sobrepor o texto ao ícone
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">
                        Função / Role
                    </Label>
                    <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível de acesso" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(UserRole).map((v) => (
                                <SelectItem key={v} value={v}>
                                    {v}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Label className="tracking-wider">A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (!@#$%^&*).</Label>

            <Separator />

            <div className="flex justify-end pt-4">
                <Button type="submit" className="w-full md:w-auto px-10 gap-2 bg-primary hover:bg-primary/90 shadow-md">
                    <Save className="h-4 w-4" />
                    Salvar Usuário
                </Button>
            </div>
        </form>
    );
}