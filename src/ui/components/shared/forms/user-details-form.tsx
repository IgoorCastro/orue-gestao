import { Separator } from "@/src/ui/components/ui/separator";
import { Label } from "@/src/ui/components/ui/label";
import { format } from "date-fns";
import DefaultLoading from "../ui/loading-default";
import { User } from "@/src/ui/types/user";
import { USER_ROLE_LABELS } from "@/src/ui/constants/labels/user-role-labels";

type UserDetailsFormProps = {
  user: User;
};

export function UserDetailsForm({ user }: UserDetailsFormProps) {

  // Helper para campos de exibição
  const InfoField = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col space-y-1">
      <Label className="text-xs text-muted-foreground uppercase font-bold">{label}</Label>
      <div className="text-sm font-medium">{value || "---"}</div>
    </div>
  );

  if (!user) return <DefaultLoading />

  return (
    <div className="space-y-6"><div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-lg font-semibold uppercase tracking-wider">Ficha do usuário</h2>
      <div className="w-min flex flex-row gap-3 items-center justify-center mr-5">
        <Label className="text-xs text-muted-foreground uppercase font-bold mt-0.5">{user.deletedAt ? "Desativo" : "Ativo"}</Label>
        {user.deletedAt
          ? <span className="h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
          : <span className="h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
        }
      </div>
    </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <InfoField label="Nome do Usuário" value={user.name} />
        </div>
        <InfoField label="Cargo" value={USER_ROLE_LABELS[user.role]} />
        <InfoField label="Usuário" value={user.nickname} />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
        <InfoField
          label="Criado em"
          value={user.createdAt ? format(new Date(user.createdAt), "dd/MM/yyyy HH:mm") : undefined}
        />
        <InfoField
          label="Última Atualização"
          value={user.updatedAt ? format(new Date(user.updatedAt), "dd/MM/yyyy HH:mm") : undefined}
        />
      </div>
    </div>
  );
}